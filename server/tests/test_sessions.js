import fs from "fs";
import path from "path";
import crypto from "crypto";

async function runTests() {
  let passed = 0;
  let failed = 0;
  let TEST_DIR;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Dynamic import of ENV first
  let ENV;
  try {
    const envModule = await import("../src/config/env.js");
    ENV = envModule.ENV;
  } catch (err) {
    console.error("Failed to load env.js", err);
    process.exit(1);
  }

  // Save original environment
  const originalDataDir = ENV.DATA_DIR;
  const originalMysqlEnvExists = ('MYSQL' in ENV);
  const originalMysqlHost = ENV.MYSQL?.host;

  try {
    // 2. Put temporary-directory setup inside try block
    const uniqueId = crypto.randomBytes(4).toString("hex");
    TEST_DIR = path.resolve(process.cwd(), `server/data_storage/test_tmp_${Date.now()}_${uniqueId}`);
    
    // Verify TEST_DIR is strictly inside server/data_storage
    const expectedParentDir = path.resolve(process.cwd(), "server/data_storage");
    const relativeTestDir = path.relative(expectedParentDir, TEST_DIR);
    if (!relativeTestDir || relativeTestDir.startsWith("..") || path.isAbsolute(relativeTestDir)) {
      throw new Error(`Guard Failed: TEST_DIR (${TEST_DIR}) is not strictly inside data_storage`);
    }

    if (fs.existsSync(TEST_DIR)) {
      throw new Error(`[FAIL] Temporary directory ${TEST_DIR} already exists. Aborting.`);
    }

    fs.mkdirSync(TEST_DIR, { recursive: true });

    // 3. Configure environment
    ENV.DATA_DIR = TEST_DIR;
    if (ENV.MYSQL) {
      ENV.MYSQL.host = null; // Disable MySQL explicitly
    }

    // 4. Resolve and guard the database path BEFORE importing database.js
    const expectedDbPath = path.resolve(ENV.DATA_DIR, "db.json");
    
    // Verify expectedDbPath is strictly inside TEST_DIR
    const relativeDbPath = path.relative(TEST_DIR, expectedDbPath);
    if (!relativeDbPath || relativeDbPath.startsWith("..") || path.isAbsolute(relativeDbPath)) {
      throw new Error("Guard Failed: expectedDbPath is not strictly inside TEST_DIR!");
    }

    // Verify expectedDbPath does not equal the real production path
    const realDbPath = path.resolve(process.cwd(), "server/data_storage/db.json");
    if (expectedDbPath === realDbPath) {
      throw new Error("Guard Failed: Test environment resolved to the real database path!");
    }

    // 5. Seed test data manually in the temp directory
    const { SEED_PRODUCTS, getSeedDeals } = await import("../src/seed/seedData.js");
    const initialData = {
      products: [...SEED_PRODUCTS],
      deals: getSeedDeals(SEED_PRODUCTS),
      users: [{ id: "usr-seller-01", email: "seller@sellx.trade", name: "Verified Trade Partner", role: "seller", verified: true }],
      sessions: [],
      notifications: []
    };
    fs.writeFileSync(expectedDbPath, JSON.stringify(initialData, null, 2), "utf-8");

    // 6. Dynamically import database and models now that ENV is securely overridden
    const { db } = await import("../src/config/database.js");
    const { SessionModel } = await import("../src/models/SessionModel.js");

    console.log("Initializing test DB...");
    await db.init();

    // Capture baseline state to enforce strict preservation testing later
    const baselineState = JSON.parse(fs.readFileSync(expectedDbPath, "utf-8"));
    delete baselineState.sessions;

    const userId = "usr-test-123";

    // Test: Session creation
    const rawToken = SessionModel.create(userId);
    assert(typeof rawToken === "string" && rawToken.length > 0, "Session created and raw token returned");

    // Test: Persisted state verification
    const fileContent = fs.readFileSync(expectedDbPath, "utf-8");
    const persistedState = JSON.parse(fileContent);
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    const persistedSession = persistedState.sessions.find(s => s.tokenHash === tokenHash);
    assert(persistedSession !== undefined, "Session stored with token hash in persisted file");
    assert(persistedSession.userId === userId, "Session associated with correct user in persisted file");
    assert(!fileContent.includes(rawToken), "Raw token is NOT present in persisted file");

    // Test: Valid token
    const validatedUserId = SessionModel.validate(rawToken);
    assert(validatedUserId === userId, "Valid raw token successfully resolves to user ID");

    // Test: Invalid token
    const invalidResult = SessionModel.validate("invalid_token_string");
    assert(invalidResult === null, "Invalid token is rejected");

    // Test: Expired token
    const sessionInMemory = db.data.sessions.find(s => s.tokenHash === tokenHash);
    sessionInMemory.expiresAt = Date.now() - 1000;
    db.saveSync();
    
    const expiredResult = SessionModel.validate(rawToken);
    assert(expiredResult === null, "Expired token is rejected");

    // Test: Revoked token
    sessionInMemory.expiresAt = Date.now() + 100000; // Un-expire
    db.saveSync();
    SessionModel.revoke(rawToken);
    
    const revokedState = JSON.parse(fs.readFileSync(expectedDbPath, "utf-8"));
    const revokedSessionExists = revokedState.sessions.some(s => s.tokenHash === tokenHash);
    assert(!revokedSessionExists, "Revoked session was removed from persisted file");
    
    const revokedResult = SessionModel.validate(rawToken);
    assert(revokedResult === null, "Revoked token is rejected by validation");

    // Test: Revoke all sessions for a user
    SessionModel.create(userId);
    SessionModel.create(userId);
    const otherUserId = "usr-other-456";
    SessionModel.create(otherUserId);
    
    SessionModel.revokeAllForUser(userId);
    
    const finalState = JSON.parse(fs.readFileSync(expectedDbPath, "utf-8"));
    const remainingUserSessions = finalState.sessions.filter(s => s.userId === userId).length;
    const remainingOtherSessions = finalState.sessions.filter(s => s.userId === otherUserId).length;
    
    assert(remainingUserSessions === 0, "All sessions for the user were revoked in persisted file");
    assert(remainingOtherSessions === 1, "Other user's sessions were untouched in persisted file");

    // Test: Existing application data survives exactly as it was
    delete finalState.sessions;
    assert(
      JSON.stringify(baselineState) === JSON.stringify(finalState),
      "Existing application data (users, products, deals, notifications) is perfectly preserved"
    );

  } catch (error) {
    console.error("Test execution failed:", error);
    failed++;
  } finally {
    console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
    
    // Restore original environment values safely
    ENV.DATA_DIR = originalDataDir;
    
    if (!originalMysqlEnvExists) {
      delete ENV.MYSQL;
    } else if (ENV.MYSQL) {
      ENV.MYSQL.host = originalMysqlHost;
    }

    // Strict containment check for cleanup
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
