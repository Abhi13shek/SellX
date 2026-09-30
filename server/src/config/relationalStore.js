const USER_FIELDS = ["id", "email", "name", "role", "verified", "createdAt", "passwordHash"];
const PRODUCT_FIELDS = [
  "id", "sku", "name", "category", "image", "basePrice", "cost",
  "minAcceptablePrice", "condition", "city", "locality", "distanceKm",
  "leadTimeDays", "supplier", "sellerTrust", "handoverOptions", "description",
  "highlights", "includes", "sellerAdded", "createdAt", "automationRules",
];
const DEAL_FIELDS = [
  "id", "productId", "product", "buyerName", "sellerName", "targetMarginPct",
  "handoverType", "meetupLocation", "handoverOtp", "createdAt", "updatedAt",
  "termSheet", "messages",
];
const TERM_FIELDS = [
  "unitPrice", "leadTimeDays", "handoverType", "meetupLocation", "status",
  "expiresAt", "lastProposedBy", "acceptedBy", "acceptedAt", "declinedBy",
  "declinedAt", "declineReason", "handoverOtp",
];
const MESSAGE_FIELDS = ["id", "sender", "type", "text", "offer", "timestamp"];

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash VARCHAR(255) NULL,
    created_at BIGINT NULL,
    extra_json JSON NULL,
    sort_order INT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(120) NOT NULL PRIMARY KEY,
    sku VARCHAR(120) NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(120) NULL,
    image TEXT NULL,
    base_price DECIMAL(15,2) NULL,
    cost DECIMAL(15,2) NULL,
    min_acceptable_price DECIMAL(15,2) NULL,
    condition_label VARCHAR(120) NULL,
    city VARCHAR(160) NULL,
    locality VARCHAR(255) NULL,
    distance_km DECIMAL(12,3) NULL,
    lead_time_days INT NULL,
    supplier VARCHAR(255) NULL,
    seller_trust JSON NULL,
    handover_options JSON NULL,
    description TEXT NULL,
    highlights JSON NULL,
    includes_json JSON NULL,
    seller_added BOOLEAN NULL,
    created_at BIGINT NULL,
    automation_rules JSON NULL,
    extra_json JSON NULL,
    sort_order INT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS deals (
    id VARCHAR(120) NOT NULL PRIMARY KEY,
    product_id VARCHAR(120) NULL,
    product_snapshot JSON NULL,
    buyer_name VARCHAR(255) NULL,
    seller_name VARCHAR(255) NULL,
    target_margin_pct DECIMAL(8,5) NULL,
    handover_type VARCHAR(160) NULL,
    meetup_location VARCHAR(255) NULL,
    handover_otp VARCHAR(32) NULL,
    created_at BIGINT NULL,
    updated_at BIGINT NULL,
    extra_json JSON NULL,
    sort_order INT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS deal_terms (
    deal_id VARCHAR(120) NOT NULL PRIMARY KEY,
    unit_price DECIMAL(15,2) NULL,
    lead_time_days INT NULL,
    handover_type VARCHAR(160) NULL,
    meetup_location VARCHAR(255) NULL,
    status VARCHAR(64) NULL,
    expires_at BIGINT NULL,
    last_proposed_by VARCHAR(160) NULL,
    accepted_by VARCHAR(160) NULL,
    accepted_at BIGINT NULL,
    declined_by VARCHAR(160) NULL,
    declined_at BIGINT NULL,
    decline_reason TEXT NULL,
    handover_otp VARCHAR(32) NULL,
    extra_json JSON NULL,
    CONSTRAINT fk_deal_terms_deal FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS deal_messages (
    id VARCHAR(120) NOT NULL PRIMARY KEY,
    deal_id VARCHAR(120) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    sender VARCHAR(120) NULL,
    type VARCHAR(64) NULL,
    message_text TEXT NULL,
    offer_json JSON NULL,
    timestamp BIGINT NULL,
    extra_json JSON NULL,
    INDEX idx_deal_messages_deal_position (deal_id, position),
    CONSTRAINT fk_deal_messages_deal FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(120) NOT NULL PRIMARY KEY,
    position INT NOT NULL DEFAULT 0,
    payload_json JSON NOT NULL
  ) ENGINE=InnoDB`,
];

const jsonString = (value) => value == null ? null : JSON.stringify(value);

function parseJson(value, fallback = null) {
  if (value == null) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function extras(record, knownFields) {
  return Object.fromEntries(
    Object.entries(record || {}).filter(([key]) => !knownFields.includes(key))
  );
}

function insertStatement(table, row, primaryKey, preserveExisting) {
  const columns = Object.keys(row);
  const placeholders = columns.map(() => "?").join(", ");
  const updates = preserveExisting
    ? `${primaryKey} = ${primaryKey}`
    : columns.filter((column) => column !== primaryKey)
      .map((column) => `${column} = VALUES(${column})`).join(", ");
  const suffix = updates ? ` ON DUPLICATE KEY UPDATE ${updates}` : "";
  return {
    sql: `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})${suffix}`,
    values: columns.map((column) => row[column]),
  };
}

async function insertMissing(connection, table, row, primaryKey = "id") {
  const statement = insertStatement(table, row, primaryKey, true);
  await connection.execute(statement.sql, statement.values);
}

async function upsert(connection, table, row, primaryKey = "id") {
  const statement = insertStatement(table, row, primaryKey, false);
  await connection.execute(statement.sql, statement.values);
}

function userRow(user, position) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || "Verified Partner",
    role: user.role || "seller",
    verified: !!user.verified,
    password_hash: user.passwordHash ?? null,
    created_at: user.createdAt ?? null,
    extra_json: jsonString(extras(user, USER_FIELDS)),
    sort_order: position,
  };
}

function productRow(product, position) {
  return {
    id: product.id,
    sku: product.sku ?? null,
    name: product.name || "",
    category: product.category ?? null,
    image: product.image ?? null,
    base_price: product.basePrice ?? null,
    cost: product.cost ?? null,
    min_acceptable_price: product.minAcceptablePrice ?? null,
    condition_label: product.condition ?? null,
    city: product.city ?? null,
    locality: product.locality ?? null,
    distance_km: product.distanceKm ?? null,
    lead_time_days: product.leadTimeDays ?? null,
    supplier: product.supplier ?? null,
    seller_trust: jsonString(product.sellerTrust),
    handover_options: jsonString(product.handoverOptions),
    description: product.description ?? null,
    highlights: jsonString(product.highlights),
    includes_json: jsonString(product.includes),
    seller_added: product.sellerAdded ?? null,
    created_at: product.createdAt ?? null,
    automation_rules: jsonString(product.automationRules),
    extra_json: jsonString(extras(product, PRODUCT_FIELDS)),
    sort_order: position,
  };
}

function dealRow(deal, position) {
  return {
    id: deal.id,
    product_id: deal.productId ?? deal.product?.id ?? null,
    product_snapshot: jsonString(deal.product),
    buyer_name: deal.buyerName ?? null,
    seller_name: deal.sellerName ?? null,
    target_margin_pct: deal.targetMarginPct ?? null,
    handover_type: deal.handoverType ?? null,
    meetup_location: deal.meetupLocation ?? null,
    handover_otp: deal.handoverOtp ?? null,
    created_at: deal.createdAt ?? null,
    updated_at: deal.updatedAt ?? null,
    extra_json: jsonString(extras(deal, DEAL_FIELDS)),
    sort_order: position,
  };
}

function termRow(deal) {
  const terms = deal.termSheet || {};
  return {
    deal_id: deal.id,
    unit_price: terms.unitPrice ?? null,
    lead_time_days: terms.leadTimeDays ?? null,
    handover_type: terms.handoverType ?? null,
    meetup_location: terms.meetupLocation ?? null,
    status: terms.status ?? null,
    expires_at: terms.expiresAt ?? null,
    last_proposed_by: terms.lastProposedBy ?? null,
    accepted_by: terms.acceptedBy ?? null,
    accepted_at: terms.acceptedAt ?? null,
    declined_by: terms.declinedBy ?? null,
    declined_at: terms.declinedAt ?? null,
    decline_reason: terms.declineReason ?? null,
    handover_otp: terms.handoverOtp ?? null,
    extra_json: jsonString(extras(terms, TERM_FIELDS)),
  };
}

function messageRow(message, dealId, position) {
  return {
    id: message.id,
    deal_id: dealId,
    position,
    sender: message.sender ?? null,
    type: message.type ?? null,
    message_text: message.text ?? null,
    offer_json: jsonString(message.offer),
    timestamp: message.timestamp ?? null,
    extra_json: jsonString(extras(message, MESSAGE_FIELDS)),
  };
}

function notificationRow(notification, position) {
  return {
    id: notification.id || `notification-${position}`,
    position,
    payload_json: jsonString(notification),
  };
}

export async function ensureRelationalSchema(pool) {
  for (const statement of SCHEMA) await pool.query(statement);
  const [columns] = await pool.execute(
    `SELECT COUNT(*) AS column_count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'password_hash'`
  );
  if (Number(columns[0].column_count) === 0) {
    await pool.query("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER verified");
  }
}

export async function readBackupState(pool) {
  try {
    const [rows] = await pool.execute("SELECT state_json FROM sellx_state WHERE id = 1");
    return rows.length ? parseJson(rows[0].state_json, {}) : null;
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") return null;
    throw error;
  }
}

export async function migrateState(pool, state) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const [position, user] of (state.users || []).entries()) {
      await insertMissing(connection, "users", userRow(user, position));
    }
    for (const [position, product] of (state.products || []).entries()) {
      await insertMissing(connection, "products", productRow(product, position));
    }
    for (const [position, deal] of (state.deals || []).entries()) {
      await insertMissing(connection, "deals", dealRow(deal, position));
      if (deal.termSheet) {
        await insertMissing(connection, "deal_terms", termRow(deal), "deal_id");
      }
      for (const [messagePosition, message] of (deal.messages || []).entries()) {
        await insertMissing(
          connection,
          "deal_messages",
          messageRow(message, deal.id, messagePosition)
        );
      }
    }
    for (const [position, notification] of (state.notifications || []).entries()) {
      await insertMissing(connection, "notifications", notificationRow(notification, position));
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

const asNumber = (value) => value == null ? value : Number(value);

export async function loadRelationalState(pool) {
  const [users, products, deals, terms, messages, notifications] = await Promise.all([
    pool.query("SELECT * FROM users ORDER BY sort_order, id"),
    pool.query("SELECT * FROM products ORDER BY sort_order, id"),
    pool.query("SELECT * FROM deals ORDER BY sort_order, id"),
    pool.query("SELECT * FROM deal_terms"),
    pool.query("SELECT * FROM deal_messages ORDER BY deal_id, position, id"),
    pool.query("SELECT * FROM notifications ORDER BY position, id"),
  ]).then((results) => results.map(([rows]) => rows));

  const termsByDeal = new Map(terms.map((row) => [row.deal_id, {
    ...parseJson(row.extra_json, {}),
    unitPrice: asNumber(row.unit_price),
    leadTimeDays: row.lead_time_days,
    handoverType: row.handover_type,
    meetupLocation: row.meetup_location,
    status: row.status,
    expiresAt: asNumber(row.expires_at),
    lastProposedBy: row.last_proposed_by,
    acceptedBy: row.accepted_by,
    acceptedAt: asNumber(row.accepted_at),
    declinedBy: row.declined_by,
    declinedAt: asNumber(row.declined_at),
    declineReason: row.decline_reason,
    handoverOtp: row.handover_otp,
  }]));
  const messagesByDeal = new Map();
  for (const row of messages) {
    const message = {
      ...parseJson(row.extra_json, {}),
      id: row.id,
      sender: row.sender,
      type: row.type,
      text: row.message_text,
      offer: parseJson(row.offer_json),
      timestamp: asNumber(row.timestamp),
    };
    if (!messagesByDeal.has(row.deal_id)) messagesByDeal.set(row.deal_id, []);
    messagesByDeal.get(row.deal_id).push(message);
  }

  return {
    users: users.map((row) => ({
      ...parseJson(row.extra_json, {}),
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      verified: !!row.verified,
      passwordHash: row.password_hash || null,
      ...(row.created_at == null ? {} : { createdAt: asNumber(row.created_at) }),
    })),
    products: products.map((row) => ({
      ...parseJson(row.extra_json, {}),
      id: row.id,
      sku: row.sku,
      name: row.name,
      category: row.category,
      image: row.image,
      basePrice: asNumber(row.base_price),
      cost: asNumber(row.cost),
      minAcceptablePrice: asNumber(row.min_acceptable_price),
      condition: row.condition_label,
      city: row.city,
      locality: row.locality,
      distanceKm: asNumber(row.distance_km),
      leadTimeDays: row.lead_time_days,
      supplier: row.supplier,
      sellerTrust: parseJson(row.seller_trust),
      handoverOptions: parseJson(row.handover_options),
      description: row.description,
      highlights: parseJson(row.highlights),
      includes: parseJson(row.includes_json),
      sellerAdded: row.seller_added == null ? row.seller_added : !!row.seller_added,
      createdAt: asNumber(row.created_at),
      automationRules: parseJson(row.automation_rules),
    })),
    deals: deals.map((row) => ({
      ...parseJson(row.extra_json, {}),
      id: row.id,
      productId: row.product_id,
      product: parseJson(row.product_snapshot),
      buyerName: row.buyer_name,
      sellerName: row.seller_name,
      targetMarginPct: asNumber(row.target_margin_pct),
      handoverType: row.handover_type,
      meetupLocation: row.meetup_location,
      handoverOtp: row.handover_otp,
      createdAt: asNumber(row.created_at),
      updatedAt: asNumber(row.updated_at),
      termSheet: termsByDeal.get(row.id) || {},
      messages: messagesByDeal.get(row.id) || [],
    })),
    notifications: notifications.map((row) => parseJson(row.payload_json, {})),
  };
}

function changed(before, after) {
  return JSON.stringify(before) !== JSON.stringify(after);
}

async function persistCollection(connection, table, primaryKey, oldRows, newRows, rowMapper) {
  const oldById = new Map(oldRows.map((row) => [row.id, row]));
  const newById = new Map(newRows.map((row) => [row.id, row]));

  for (const id of oldById.keys()) {
    if (!newById.has(id)) {
      await connection.execute(`DELETE FROM ${table} WHERE ${primaryKey} = ?`, [id]);
    }
  }
  for (const [position, row] of newRows.entries()) {
    if (!oldById.has(row.id) || changed(oldById.get(row.id), row)) {
      await upsert(connection, table, rowMapper(row, position), primaryKey);
    }
  }
}

export async function persistRelationalChanges(pool, previous, current) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await persistCollection(connection, "deal_messages", "id",
      previous.deals.flatMap((deal) => (deal.messages || []).map((message) => ({ ...message, dealId: deal.id }))),
      current.deals.flatMap((deal) => (deal.messages || []).map((message) => ({ ...message, dealId: deal.id }))),
      (message, position) => messageRow(message, message.dealId, position));

    await persistCollection(connection, "deal_terms", "deal_id",
      previous.deals.filter((deal) => deal.termSheet).map((deal) => ({ id: deal.id, ...deal.termSheet })),
      current.deals.filter((deal) => deal.termSheet).map((deal) => ({ id: deal.id, ...deal.termSheet })),
      (terms) => termRow({ id: terms.id, termSheet: terms }));

    await persistCollection(connection, "deals", "id", previous.deals, current.deals, dealRow);
    await persistCollection(connection, "products", "id", previous.products, current.products, productRow);
    await persistCollection(connection, "users", "id", previous.users, current.users, userRow);

    const oldNotifications = previous.notifications.map((notification, position) => ({
      ...notification,
      id: notification.id || `notification-${position}`,
    }));
    const newNotifications = current.notifications.map((notification, position) => ({
      ...notification,
      id: notification.id || `notification-${position}`,
    }));
    await persistCollection(connection, "notifications", "id", oldNotifications, newNotifications,
      (notification, position) => notificationRow(notification, position));
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}