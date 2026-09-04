# 💼 SellX

### B2B Negotiation & Deal Management Platform

**SellX** is a modern B2B negotiation platform designed to make buying and selling more transparent, structured, and efficient.

It provides a shared environment where **buyers and sellers can negotiate prices, exchange offers and counteroffers, manage delivery terms, track deals, and monitor margins** in real time.

Instead of relying on scattered conversations and spreadsheets, SellX brings the entire negotiation workflow into a single **digital deal room**.

---

## ✨ Features

### 🤝 Real-Time Negotiation

* Buyers and sellers can exchange offers and counteroffers.
* Negotiate pricing and commercial terms.
* Track the complete negotiation flow.
* Confirmation steps help prevent accidental decisions.

### 🏢 Deal Room

A shared workspace for managing individual negotiations.

* View deal information
* Track current offers
* Review negotiation history
* Manage delivery terms
* Monitor deal status
* Confirm finalized decisions

### 📊 Seller Pipeline

A centralized view of seller-side opportunities and active negotiations.

* Track active deals
* Monitor deal progress
* Organize opportunities
* Review pipeline status

### 💰 Live Margin Tracking

SellX helps sellers understand the financial impact of negotiations.

* Track selling price
* Monitor costs
* Calculate margins
* Evaluate the effect of negotiated prices

### 📦 Product Catalog

Manage and browse products that are available for negotiation.

* Product information
* Pricing details
* Product discovery
* Product-specific negotiation workflows

### 🛡️ Decision Confirmation

Important deal actions use confirmation steps to reduce accidental changes and provide a more deliberate negotiation workflow.

### 📈 Trade Desk Dashboard

A centralized interface for monitoring negotiations, products, deals, and business activity.

---

## 🧩 How SellX Works

```text
Buyer
  │
  │ Selects Product
  ▼
Product Catalog
  │
  │ Creates / Receives Offer
  ▼
Deal Room
  │
  ├── Offer
  ├── Counteroffer
  ├── Price Negotiation
  └── Delivery Terms
  │
  ▼
Confirmation
  │
  ▼
Deal Closed
  │
  ▼
Margin & Pipeline Tracking
```

---

## 🏗️ Architecture

SellX follows a **frontend + backend architecture**:

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│  Catalog │ Deal Room │      │
│  Seller  │ Dashboard │ UI   │
└──────────────┬──────────────┘
               │
               │ API
               ▼
┌─────────────────────────────┐
│       Express Backend       │
│                             │
│  REST APIs │ Business Logic │
│  Products  │ Deals          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Data / Storage        │
│                             │
│  Initialization │ Persistence│
└─────────────────────────────┘
```

The backend initializes its database/storage layer when the server starts and exposes APIs including product and deal endpoints. It also handles graceful shutdown and saves database state before termination.

---

## 🛠️ Tech Stack

### Frontend

* **React 18**
* **Vite**
* **Tailwind CSS**
* **Lucide React**
* JavaScript / JSX

### Backend

* **Node.js**
* **Express 5**
* **CORS**
* **dotenv**
* **Morgan**

### Development Tools

* Vite
* PostCSS
* Autoprefixer
* Concurrently

The repository's package configuration confirms React, Vite, Tailwind CSS, Express, CORS, dotenv, Morgan, Lucide React, and Concurrently as core dependencies/tooling.

---

## 📁 Project Structure

```text
SellX/
│
├── server/
│   ├── src/
│   └── index.js
│
├── src/
│   ├── components/
│   │   ├── catalog/
│   │   ├── common/
│   │   ├── dealroom/
│   │   ├── layout/
│   │   ├── modals/
│   │   └── seller/
│   │
│   ├── data/
│   ├── hooks/
│   │   ├── useCountdown.js
│   │   └── useTick.js
│   │
│   ├── services/
│   ├── utils/
│   ├── NegotiationPlatform.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

The frontend is organized into feature-focused component groups such as `catalog`, `dealroom`, `seller`, `layout`, `common`, and `modals`, with separate hooks, services, utilities, and data modules.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Abhi13shek/SellX.git
cd SellX
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the application

```bash
npm run dev
```

This starts both the frontend and backend development processes concurrently.

### 4. Open the application

The Vite development server will provide the frontend URL, while the Express server runs separately according to the configured environment.

---

## ⚙️ Available Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Start frontend and backend together |
| `npm run client` | Start Vite frontend                 |
| `npm run server` | Start Express backend               |
| `npm run build`  | Build the frontend for production   |

These scripts are defined in the project's `package.json`.

---

## 🔌 Backend APIs

The backend currently exposes core endpoints for the SellX platform, including:

```text
GET /health
GET /api/products
GET /api/deals
```

The server logs these endpoints when it starts successfully.

---

## 🎯 Core Use Cases

SellX can be used for:

* B2B product negotiations
* Wholesale purchasing
* Supplier–buyer negotiations
* Price negotiations
* Commercial deal management
* Seller opportunity tracking
* Margin monitoring
* Structured deal approvals

---

## 💡 Why SellX?

Traditional B2B negotiations often happen across:

* Emails
* Phone calls
* Messaging applications
* Spreadsheets
* Separate CRM systems

This can make it difficult to understand **what was offered, what changed, who agreed to what, and whether the final deal is profitable**.

SellX brings these activities into one structured platform.

> **Negotiate better. Track everything. Close smarter.**

---

## 🔐 Design Principles

SellX is built around a few key principles:

**Transparency**
Every important negotiation step should be visible and understandable.

**Control**
Critical actions require deliberate confirmation.

**Efficiency**
Buyers and sellers should be able to negotiate without unnecessary complexity.

**Visibility**
Deal status, pipeline activity, and margins should be easy to understand.

**Flexibility**
Negotiations should support offers, counteroffers, pricing changes, and delivery terms.

---

## 🧪 Development

The project uses a modular component architecture on the frontend and a dedicated Express backend.

Frontend functionality is separated into reusable feature components, hooks, services, data, and utility modules, making the application easier to extend and maintain.

---

## 🗺️ Future Improvements

Potential areas for future development include:

* 🔐 User authentication & role-based access
* 💬 Real-time buyer/seller messaging
* 🔔 Deal notifications
* 📜 Complete negotiation audit logs
* 📊 Advanced analytics
* 📄 PDF quotation generation
* 💳 Payment integration
* ☁️ Cloud database integration
* 🔄 WebSocket-based live negotiation updates
* 👥 Multi-user organizations
* 📱 Responsive/mobile-first improvements
* 🚀 Production deployment & CI/CD

---

## 🤝 Contributing

Contributions are welcome.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add your feature"

# Push your branch
git push origin feature/your-feature
```

Then open a Pull Request.

---

## 📄 License

This project is currently available as an open repository on GitHub.

See the repository for the latest licensing and usage information.

---

## 👨‍💻 Author

**Abhishek**

GitHub:
https://github.com/Abhi13shek

---

## ⭐ Support

If you find SellX useful, consider giving the repository a ⭐ on GitHub.

**SellX — A smarter way to negotiate B2B deals.**
