import fs from "fs";
import path from "path";
import crypto from "crypto";
import express from "express";

async function runTests() {
  let passed = 0;
  let failed = 0;
  let TEST_DIR;
  let server;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  let ENV;
  try {
    const envModule = await import("../src/config/env.js");
    ENV = envModule.ENV;
  } catch (err) {
    console.error("Failed to load env.js", err);
    process.exit(1);
  }

  const originalDataDir = ENV.DATA_DIR;
  const originalMysqlEnvExists = ('MYSQL' in ENV);
  const originalMysqlHost = ENV.MYSQL?.host;

  try {
    const uniqueId = crypto.randomBytes(4).toString("hex");
    TEST_DIR = path.resolve(process.cwd(), `server/data_storage/test_tmp_${Date.now()}_${uniqueId}`);
    
    const expectedParentDir = path.resolve(process.cwd(), "server/data_storage");
    const relativeTestDir = path.relative(expectedParentDir, TEST_DIR);
    if (!relativeTestDir || relativeTestDir.startsWith("..") || path.isAbsolute(relativeTestDir)) {
      throw new Error(`Guard Failed: TEST_DIR (${TEST_DIR}) is not strictly inside data_storage`);
    }

    if (fs.existsSync(TEST_DIR)) {
      throw new Error(`[FAIL] Temporary directory ${TEST_DIR} already exists. Aborting.`);
    }

    fs.mkdirSync(TEST_DIR, { recursive: true });

    ENV.DATA_DIR = TEST_DIR;
    if (ENV.MYSQL) ENV.MYSQL.host = null; 

    const expectedDbPath = path.resolve(ENV.DATA_DIR, "db.json");
    
    const relativeDbPath = path.relative(TEST_DIR, expectedDbPath);
    if (!relativeDbPath || relativeDbPath.startsWith("..") || path.isAbsolute(relativeDbPath)) {
      throw new Error("Guard Failed: expectedDbPath is not strictly inside TEST_DIR!");
    }

    const realDbPath = path.resolve(process.cwd(), "server/data_storage/db.json");
    if (expectedDbPath === realDbPath) {
      throw new Error("Guard Failed: Test environment resolved to the real database path!");
    }

    const { SEED_PRODUCTS, getSeedDeals } = await import("../src/seed/seedData.js");
    const initialData = {
      products: [...SEED_PRODUCTS],
      deals: getSeedDeals(SEED_PRODUCTS),
      users: [
        { id: "usr-alice", email: "alice@sellx.trade", name: "Alice", role: "seller", verified: true },
        { id: "usr-bob", email: "bob@sellx.trade", name: "Bob", role: "seller", verified: true },
        { id: "usr-charlie", email: "charlie@sellx.trade", name: "Charlie", role: "seller", verified: true },
        { id: "usr-seller-01", email: "seller@sellx.trade", name: "Verified Trade Partner", role: "seller", verified: true }
      ],
      sessions: [],
      notifications: []
    };
    fs.writeFileSync(expectedDbPath, JSON.stringify(initialData, null, 2), "utf-8");

    const { db } = await import("../src/config/database.js");
    const { SessionModel } = await import("../src/models/SessionModel.js");
    
    console.log("Initializing test DB...");
    await db.init();

    // Setup an Express app
    const { default: authRoutes } = await import("../src/routes/authRoutes.js");
    const { default: productRoutes } = await import("../src/routes/productRoutes.js");
    const { default: dealRoutes } = await import("../src/routes/dealRoutes.js");
    const { default: copilotRoutes } = await import("../src/routes/copilotRoutes.js");
    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/deals", dealRoutes);
    app.use("/api/copilot", copilotRoutes);
    
    await new Promise((resolve) => {
      server = app.listen(0, () => resolve());
    });
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api`;

    const request = async (endpoint, token, method = "GET", body = null) => {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const options = { method, headers };
      if (body) options.body = JSON.stringify(body);
      const res = await fetch(`${baseUrl}${endpoint}`, options);
      const data = await res.json().catch(() => null);
      return { status: res.status, data };
    };

    const tokenAlice = SessionModel.create("usr-alice");
    const tokenBob = SessionModel.create("usr-bob");
    const tokenCharlie = SessionModel.create("usr-charlie");
    const tokenSeller01 = SessionModel.create("usr-seller-01");

    // 1. Unauthenticated requests to protected product, deal, message and copilot endpoints return 401
    let r = await request("/products", null, "POST", { name: "Test", basePrice: 100 });
    assert(r.status === 401, "Unauth POST /products returns 401");
    r = await request("/deals", null, "GET");
    assert(r.status === 401, "Unauth GET /deals returns 401");
    r = await request("/copilot/seller/D-1001", null, "GET");
    assert(r.status === 401, "Unauth GET /copilot/seller returns 401");
    r = await request("/copilot/buyer/D-1001", null, "GET");
    assert(r.status === 401, "Unauth GET /copilot/buyer returns 401");

    // 2. Public product browsing remains accessible without authentication
    r = await request("/products", null, "GET");
    assert(r.status === 200 && r.data.data.length > 0, "Public GET /products accessible");
    const legacyProductId = r.data.data[0].id;

    // 3. A user can modify or delete their own product, but another user cannot.
    r = await request("/products", tokenAlice, "POST", { name: "Alice's Item", basePrice: 100 });
    const aliceProduct = r.data.data;
    assert(aliceProduct.userId === "usr-alice", "Product created with correct owner ID");
    
    r = await request(`/products/${aliceProduct.id}/automation`, tokenBob, "PUT", { automationRules: {} });
    assert(r.status === 403, "Bob cannot modify Alice's product");
    
    r = await request(`/products/${aliceProduct.id}/automation`, tokenAlice, "PUT", { automationRules: {} });
    assert(r.status === 200, "Alice can modify her own product");

    // 4. Legacy products without an owner remain publicly readable and cannot be modified by authenticated users.
    r = await request(`/products/${legacyProductId}`, null, "GET");
    assert(r.status === 200, "Legacy product publicly readable");
    r = await request(`/products/${legacyProductId}/automation`, tokenAlice, "PUT", { automationRules: {} });
    assert(r.status === 403, "Alice cannot modify legacy unowned product");

    // 5. A deal is visible and actionable only by its buyer or seller.
    r = await request("/deals", tokenBob, "POST", { productId: aliceProduct.id, initialOffer: { unitPrice: 90, leadTimeDays: 1 } });
    const dealId = r.data.data.id;
    
    r = await request(`/deals/${dealId}`, tokenCharlie, "GET");
    assert(r.status === 403, "Charlie cannot view Bob and Alice's deal");
    
    r = await request(`/deals/${dealId}`, tokenAlice, "GET");
    assert(r.status === 200, "Alice (seller) can view the deal");

    // 6. Deal-list results contain only deals involving the authenticated user.
    r = await request("/deals", tokenAlice, "GET");
    assert(r.data.data.every(d => d.buyerId === "usr-alice" || d.sellerId === "usr-alice"), "Deal list only contains Alice's deals");

    // 7. Spoofed actor, sender, buyerId and sellerId values cannot grant another user's privileges.
    r = await request(`/deals/${dealId}/accept`, tokenCharlie, "POST", { actor: "seller" });
    assert(r.status === 403, "Charlie cannot spoof actor field to accept deal");
    r = await request(`/deals/${dealId}/messages`, tokenBob, "POST", { sender: "seller", text: "Spoof test" });
    // Bob is buyer. He sent `sender: "seller"`. It should succeed but override the sender to "buyer".
    assert(r.status === 201 && r.data.data.sender === "buyer", "Backend securely overrides spoofed sender role");
    
    // 8. Legacy catalog product maps to usr-seller-01; authenticated buyer can create a deal; self-dealing is prevented.
    r = await request("/deals", tokenBob, "POST", { productId: legacyProductId, initialOffer: { unitPrice: 90, leadTimeDays: 1 } });
    assert(r.status === 201 && r.data?.success === true, "Authenticated buyer can create deal for legacy catalog product");
    const legacyDeal = r.data?.data;
    assert(legacyDeal && typeof legacyDeal.id === "string" && legacyDeal.id.startsWith("D-"), "Deal response includes canonical server-generated deal ID");
    assert(legacyDeal.buyerId === "usr-bob", "Deal buyerId equals authenticated buyer ID");
    assert(legacyDeal.sellerId === "usr-seller-01", "Deal sellerId defaults to usr-seller-01");

    // Buyer cannot spoof buyerId or sellerId via request body
    r = await request("/deals", tokenBob, "POST", {
      productId: legacyProductId,
      buyerId: "usr-alice",
      sellerId: "usr-charlie",
      initialOffer: { unitPrice: 90, leadTimeDays: 1 }
    });
    assert(r.status === 201, "Deal creation with spoofed fields in body is processed");
    assert(r.data?.data?.buyerId === "usr-bob", "Buyer cannot spoof buyerId via request body");
    assert(r.data?.data?.sellerId === "usr-seller-01", "Buyer cannot spoof sellerId via request body");

    // Seeded seller cannot create deal with themselves as buyer for legacy product
    r = await request("/deals", tokenSeller01, "POST", { productId: legacyProductId, initialOffer: { unitPrice: 90, leadTimeDays: 1 } });
    assert(r.status === 400, "Seeded seller cannot create deal with themselves as buyer for legacy product");

    // Product injection prevention: non-existent productId with embedded product object
    const catalogBefore = (await request("/products", null, "GET")).data.data.length;
    r = await request("/deals", tokenBob, "POST", {
      productId: "P-NONEXISTENT-999",
      product: { name: "Injected Malicious Item", basePrice: 5000 },
      initialOffer: { unitPrice: 4000, leadTimeDays: 1 }
    });
    assert(r.status === 404, "Non-existent productId with supplied product object returns 404");
    assert(r.data?.error?.message === "Product not found", "Returns standard Product not found error message");

    const catalogAfter = (await request("/products", null, "GET")).data.data.length;
    assert(catalogAfter === catalogBefore, "Rejected deal request does not inject product into shared catalog");

    const checkInjected = await request("/products/P-NONEXISTENT-999", null, "GET");
    assert(checkInjected.status === 404, "Injected product ID does not exist in catalog");

    // 9. Copilot endpoints enforce participant and seller authorization
    // Buyer Copilot:
    r = await request(`/copilot/buyer/${dealId}`, null, "GET");
    assert(r.status === 401, "Unauthenticated request to buyer Copilot returns 401");

    r = await request(`/copilot/buyer/${dealId}`, tokenBob, "GET");
    assert(r.status === 200 && r.data?.success === true, "Buyer participant can access buyer insights");

    r = await request(`/copilot/buyer/${dealId}`, tokenAlice, "GET");
    assert(r.status === 200 && r.data?.success === true, "Seller participant can access buyer insights");

    r = await request(`/copilot/buyer/${dealId}`, tokenCharlie, "GET");
    assert(r.status === 403, "Unrelated authenticated user receives 403 from buyer Copilot");

    r = await request("/copilot/buyer/D-NONEXISTENT", tokenBob, "GET");
    assert(r.status === 404, "Nonexistent deal returns 404 from buyer Copilot");

    // Seller Copilot:
    r = await request(`/copilot/seller/${dealId}`, null, "GET");
    assert(r.status === 401, "Unauthenticated request to seller Copilot returns 401");

    r = await request(`/copilot/seller/${dealId}`, tokenAlice, "GET");
    assert(r.status === 200 && r.data?.success === true, "Seller participant can access seller insights");

    r = await request(`/copilot/seller/${dealId}`, tokenBob, "GET");
    assert(r.status === 403, "Buyer receives 403 from seller Copilot");

    r = await request(`/copilot/seller/${dealId}`, tokenCharlie, "GET");
    assert(r.status === 403, "Unrelated authenticated user receives 403 from seller Copilot");

    r = await request("/copilot/seller/D-NONEXISTENT", tokenAlice, "GET");
    assert(r.status === 404, "Nonexistent deal returns 404 from seller Copilot");

    // 10. Logout revokes the token, and subsequent authenticated requests using it are rejected.
    r = await request("/auth/logout", tokenAlice, "POST");
    assert(r.status === 200, "Alice logged out");
    r = await request("/deals", tokenAlice, "GET");
    assert(r.status === 401, "Alice token is rejected after logout");

  } catch (error) {
    console.error("Test execution failed:", error);
    failed++;
  } finally {
    if (server) {
      server.close();
    }
    
    console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
    
    ENV.DATA_DIR = originalDataDir;
    if (!originalMysqlEnvExists) {
      delete ENV.MYSQL;
    } else if (ENV.MYSQL) {
      ENV.MYSQL.host = originalMysqlHost;
    }

    if (TEST_DIR) {
      const expectedParentDir = path.resolve(process.cwd(), "server/data_storage");
      const relativePath = path.relative(expectedParentDir, TEST_DIR);
      const isContained = relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);

      if (isContained) {
        if (fs.existsSync(TEST_DIR)) {
          fs.rmSync(TEST_DIR, { recursive: true, force: true });
          console.log("Temporary test directory safely cleaned up.");
        }
      } else {
        console.error(`[DANGER] Attempted to clean up invalid or non-contained path: ${TEST_DIR}`);
      }
    }

    if (failed > 0) {
      console.error("SOME TESTS FAILED.");
      process.exitCode = 1;
    }
  }
}

runTests();
