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
      users: [{ id: "usr-seller-01", email: "seller@sellx.trade", name: "Verified Trade Partner", role: "seller", verified: true }],
      sessions: [],
      notifications: []
    };
    fs.writeFileSync(expectedDbPath, JSON.stringify(initialData, null, 2), "utf-8");

    const { db } = await import("../src/config/database.js");
    const { SessionModel } = await import("../src/models/SessionModel.js");
    const { UserModel } = await import("../src/models/UserModel.js");

    console.log("Initializing test DB...");
    await db.init();

    // Setup an Express app using the real routes to test HTTP behavior
    const { default: authRoutes } = await import("../src/routes/authRoutes.js");
    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);
    
    // Start server on a random available port
    await new Promise((resolve) => {
      server = app.listen(0, () => resolve());
    });
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/auth`;

    const request = async (endpoint, token, method = "GET") => {
      const headers = { "Content-Type": "application/json" };
      if (token !== undefined) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (token === null) {
        headers["Authorization"] = "InvalidFormat"; // Test malformed
      }
      const res = await fetch(`${baseUrl}${endpoint}`, { method, headers });
      const data = await res.json().catch(() => null);
      return { status: res.status, data };
    };

    const validUser = UserModel.findByEmail("seller@sellx.trade");
    const rawToken = SessionModel.create(validUser.id);
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // 1. Missing header
    let res = await request("/me", undefined);
    assert(res.status === 401 && !res.data.success, "Missing Authorization header returns 401");

    // 2. Malformed header
    res = await request("/me", null);
    assert(res.status === 401 && !res.data.success, "Malformed Authorization header returns 401");

    // 3. Valid token
    res = await request("/me", rawToken);
    assert(res.status === 200 && res.data.success && res.data.data.id === validUser.id, "Valid token returns user profile via /me");

    // 4. Unknown user session (valid token, but user deleted)
    const unknownUserId = "usr-ghost-999";
    const ghostToken = SessionModel.create(unknownUserId);
    res = await request("/me", ghostToken);
    assert(res.status === 401 && res.data.error.message === "User not found", "Token for non-existent user returns 401");

    // 5. Expired token
    const sessionInMemory = db.data.sessions.find(s => s.tokenHash === tokenHash);
    sessionInMemory.expiresAt = Date.now() - 1000;
    db.saveSync();
    res = await request("/me", rawToken);
    assert(res.status === 401 && res.data.error.message === "Session invalid or expired", "Expired token returns 401");

    // 6. Logout / Revoke test
    sessionInMemory.expiresAt = Date.now() + 100000; // Un-expire
    db.saveSync();
    
    res = await request("/logout", rawToken, "POST");
    assert(res.status === 200 && res.data.success, "Logout endpoint succeeds with valid token");
    
    // Verify it was revoked
    res = await request("/me", rawToken);
    assert(res.status === 401, "Token is successfully revoked after /logout");

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
