const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[API Client] Error on ${options.method || "GET"} ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    const res = await request(`/products?${query.toString()}`);
    return res.data;
  },

  async getProductById(id) {
    const res = await request(`/products/${id}`);
    return res.data;
  },

  async createProduct(productData) {
    const res = await request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    return res.data;
  },

  // Deals
  async getDeals(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.role) query.append("role", params.role);
    const res = await request(`/deals?${query.toString()}`);
    return res.data;
  },

  async getDealById(id) {
    const res = await request(`/deals/${id}`);
    return res.data;
  },

  async createDeal({ productId, product, buyerName, initialOffer }) {
    const res = await request("/deals", {
      method: "POST",
      body: JSON.stringify({ productId, product, buyerName, initialOffer }),
    });
    return res.data;
  },

  async acceptDeal(dealId, actor = "seller") {
    const res = await request(`/deals/${dealId}/accept`, {
      method: "POST",
      body: JSON.stringify({ actor }),
    });
    return res.data;
  },

  async declineDeal(dealId, actor = "seller", reason = "") {
    const res = await request(`/deals/${dealId}/decline`, {
      method: "POST",
      body: JSON.stringify({ actor, reason }),
    });
    return res.data;
  },

  async submitCounter(dealId, { sender, unitPrice, leadTimeDays, note }) {
    const res = await request(`/deals/${dealId}/counter`, {
      method: "POST",
      body: JSON.stringify({ sender, unitPrice, leadTimeDays, note }),
    });
    return res.data;
  },

  async postMessage(dealId, { sender, text, type = "text", offer = null }) {
    const res = await request(`/deals/${dealId}/messages`, {
      method: "POST",
      body: JSON.stringify({ sender, text, type, offer }),
    });
    return res;
  },

  // Copilot
  async getBuyerCopilot(dealId) {
    const res = await request(`/copilot/buyer/${dealId}`);
    return res.data;
  },

  async getSellerCopilot(dealId) {
    const res = await request(`/copilot/seller/${dealId}`);
    return res.data;
  },

  // Stats
  async getStats() {
    const res = await request("/stats");
    return res.data;
  },

  // Auth
  async login({ email, password }) {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return res.data;
  },
};
