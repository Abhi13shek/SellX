# 💼 SellX

### B2B Negotiation & Deal Management Platform

> **Negotiate better. Track everything. Close smarter.**

SellX is a modern B2B negotiation and deal management platform designed to simplify the way buyers and sellers discover products, negotiate prices, manage offers, and close deals.

Instead of managing negotiations across emails, calls, spreadsheets, and messaging platforms, SellX brings the complete negotiation lifecycle into one centralized digital workspace.

---

<p align="center">

**🛒 Product Discovery**   →  
**💬 Negotiation**   →  
**🤝 Deal Management**   →  
**💰 Margin Tracking**   →  
**✅ Deal Closure**

</p>

---

## 📸 Product Preview

<p align="center">
  <img src="docs/images/dashboard.png" alt="SellX Dashboard" width="900"/>
</p>

### Dashboard

The SellX dashboard provides a centralized view of products, active negotiations, deals, pipeline activity, and business performance.

---

# ✨ Key Features

<table>
<tr>
<td width="50%">

### 🤝 Real-Time Negotiation

* Create offers
* Send counteroffers
* Track negotiation history
* Compare pricing
* Negotiate commercial terms
* Confirm final agreements

</td>

<td width="50%">

### 🏢 Digital Deal Room

A centralized workspace for every negotiation.

* Deal information
* Offer history
* Counteroffers
* Delivery terms
* Deal status
* Final confirmation

</td>
</tr>

<tr>
<td>

### 📊 Seller Pipeline

Track every opportunity from initial interest to final closure.

* Active opportunities
* Negotiation stages
* Deal progress
* Pipeline visibility
* Deal status tracking

</td>

<td>

### 💰 Margin Tracking

Understand the financial impact of every negotiation.

* Selling price
* Cost
* Negotiated price
* Expected margin
* Deal profitability

</td>
</tr>

<tr>
<td>

### 📦 Product Catalog

Browse and manage products available for negotiation.

* Product information
* Pricing
* Product discovery
* Product-specific deals

</td>

<td>

### 🛡️ Decision Confirmation

Important deal actions use confirmation steps to reduce accidental decisions and provide a controlled negotiation workflow.

</td>
</tr>
</table>

---

# 🔄 How SellX Works

```text
                    ┌──────────────────┐
                    │      Buyer       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Product Catalog  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Create Offer   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Deal Room      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Counter Offer    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Negotiate Terms  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Review Margin    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Confirm Deal     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Deal Closed    │
                    └──────────────────┘
```

---

# 🖥️ Product Showcase

## 📊 Dashboard

<p align="center">
  <img src="docs/images/dashboard.png" alt="SellX Dashboard" width="900"/>
</p>

The dashboard gives users a high-level overview of their business activity, negotiations, deals, and pipeline.

---

## 📦 Product Catalog

<p align="center">
  <img src="docs/images/product-catalog.png" alt="SellX Product Catalog" width="900"/>
</p>

The product catalog allows buyers and sellers to discover products and initiate negotiations.

---

## 🤝 Deal Room

<p align="center">
  <img src="docs/images/deal-room.png" alt="SellX Deal Room" width="900"/>
</p>

The Deal Room acts as the central workspace for individual negotiations, allowing participants to review offers, counteroffers, pricing, and delivery terms.

---

## 💬 Negotiation Interface

<p align="center">
  <img src="docs/images/negotiation.png" alt="SellX Negotiation" width="900"/>
</p>

The negotiation interface allows buyers and sellers to exchange offers and counteroffers while maintaining a clear negotiation history.

---

## 📈 Seller Pipeline

<p align="center">
  <img src="docs/images/seller-pipeline.png" alt="SellX Seller Pipeline" width="900"/>
</p>

The seller pipeline provides visibility into active opportunities and the current stage of each deal.

---

# 📊 Analytics & Insights

SellX can provide visual insights into deal activity, negotiation performance, and profitability.

### Deal Pipeline

```text
Prospecting
     │
     ▼
Negotiation
     │
     ▼
Counter Offer
     │
     ▼
Agreement
     │
     ▼
Closed
```

### Example Analytics

> The following visualization represents the type of analytics that can be integrated into the platform.

```text
Deal Value

Jan  ███████████████
Feb  ███████████████████
Mar  █████████████████████
Apr  █████████████████████████
May  ███████████████████████████
```

Recommended analytics for the platform include:

* 📈 Deal value over time
* 💰 Margin by deal
* 📊 Deals by negotiation stage
* 🤝 Successful vs unsuccessful negotiations
* 📦 Product performance
* 🏷️ Pricing comparisons
* 📋 Pipeline conversion

---

# 💰 Negotiation & Margin Flow

One of SellX's core concepts is connecting negotiation decisions with their financial impact.

```text
                Initial Price
                     │
                     ▼
              Buyer Offer
                     │
                     ▼
             Seller Counteroffer
                     │
                     ▼
             Negotiated Price
                     │
                     ▼
                   Cost
                     │
                     ▼
             ┌───────────────┐
             │ Final Margin  │
             └───────────────┘
```

This allows sellers to understand how pricing decisions affect the profitability of a deal.

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────┐
│                  SELLX CLIENT                 │
│                                               │
│  React + Vite + Tailwind CSS                 │
│                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Catalog  │ │ Deal Room│ │ Seller       │ │
│  │          │ │          │ │ Pipeline     │ │
│  └──────────┘ └──────────┘ └──────────────┘ │
│                                               │
│              Dashboard & UI                  │
└───────────────────────┬───────────────────────┘
                        │
                        │ REST API
                        ▼
┌───────────────────────────────────────────────┐
│                EXPRESS SERVER                 │
│                                               │
│              Node.js + Express                │
│                                               │
│       ┌────────────┐    ┌────────────┐       │
│       │ Products   │    │   Deals    │       │
│       │ API        │    │   API      │       │
│       └────────────┘    └────────────┘       │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                DATA / STORAGE                 │
└───────────────────────────────────────────────┘
```

---

# 🧩 Project Structure

```text
SellX/
│
├── 📁 server/
│   ├── 📁 src/
│   └── 📄 index.js
│
├── 📁 src/
│   │
│   ├── 📁 components/
│   │   ├── 📁 catalog/
│   │   ├── 📁 common/
│   │   ├── 📁 dealroom/
│   │   ├── 📁 layout/
│   │   ├── 📁 modals/
│   │   └── 📁 seller/
│   │
│   ├── 📁 data/
│   ├── 📁 hooks/
│   │   ├── 📄 useCountdown.js
│   │   └── 📄 useTick.js
│   │
│   ├── 📁 services/
│   ├── 📁 utils/
│   │
│   ├── 📄 NegotiationPlatform.jsx
│   ├── 📄 index.css
│   └── 📄 main.jsx
│
├── 📄 index.html
├── 📄 package.json
├── 📄 package-lock.json
└── 📄 vite.config.js
```

---

# 🛠️ Tech Stack

### Frontend

<p>
<img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" />
</p>

### Backend

<p>
<img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" />
</p>

### Tools & Libraries

* Vite
* Express
* CORS
* dotenv
* Morgan
* Lucide React
* Concurrently
* PostCSS
* Autoprefixer

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Abhi13shek/SellX.git
cd SellX
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Development Environment

```bash
npm run dev
```

This starts the frontend and backend development processes.

## 4. Run Frontend Only

```bash
npm run client
```

## 5. Run Backend Only

```bash
npm run server
```

---

# 📜 Available Scripts

| Command          | Purpose                       |
| ---------------- | ----------------------------- |
| `npm run dev`    | Start frontend and backend    |
| `npm run client` | Start Vite frontend           |
| `npm run server` | Start Express backend         |
| `npm run build`  | Build frontend for production |

---

# 🔌 API Endpoints

The current backend provides core endpoints for the application.

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| GET    | `/health`       | Check server health |
| GET    | `/api/products` | Retrieve products   |
| GET    | `/api/deals`    | Retrieve deals      |

---

# 🎯 Use Cases

SellX can be used for a variety of B2B commerce workflows:

* 🏭 Supplier–buyer negotiations
* 📦 Wholesale purchasing
* 💰 Price negotiations
* 🤝 Commercial deal management
* 📊 Seller opportunity tracking
* 📈 Margin monitoring
* 🧾 Structured deal approvals
* 🔄 Offer and counteroffer management

---

# 💡 Problem Statement

Traditional B2B negotiations are often fragmented across multiple platforms.

```text
Email
  +
Phone Calls
  +
WhatsApp / Messaging
  +
Spreadsheets
  +
CRM
  ↓
Fragmented Negotiation
```

This creates problems such as:

* Lack of negotiation visibility
* Difficult offer tracking
* Unclear deal status
* Manual margin calculations
* Scattered communication
* Higher chances of mistakes

### SellX solves this by bringing the workflow together:

```text
              ┌───────────────────┐
              │      SELLX        │
              └─────────┬─────────┘
                        │
       ┌────────────────┼────────────────┐
       │                │                │
       ▼                ▼                ▼
   Products         Negotiation       Deals
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
                 Margin Tracking
                        │
                        ▼
                   Deal Closure
```

---

# 🔐 Design Principles

### Transparency

Every important step in a negotiation should be easy to understand and track.

### Control

Critical actions should require deliberate confirmation.

### Efficiency

Buyers and sellers should be able to negotiate without unnecessary complexity.

### Visibility

Deal status, pipeline activity, and financial impact should remain visible.

### Modularity

The application is structured into reusable components and services to make future expansion easier.

---

# 🗺️ Roadmap

### 🔐 Authentication

* [ ] User registration
* [ ] Login
* [ ] Role-based access
* [ ] Buyer / Seller profiles

### 💬 Communication

* [ ] Real-time messaging
* [ ] Negotiation notifications
* [ ] Email notifications

### 📊 Analytics

* [ ] Advanced deal analytics
* [ ] Revenue dashboard
* [ ] Margin analytics
* [ ] Conversion analytics
* [ ] Seller performance metrics

### 📄 Documents

* [ ] Generate quotations
* [ ] Generate invoices
* [ ] PDF deal summaries
* [ ] Downloadable negotiation history

### ☁️ Infrastructure

* [ ] Cloud database
* [ ] Production deployment
* [ ] CI/CD pipeline
* [ ] Monitoring & logging

### 📱 Experience

* [ ] Mobile optimization
* [ ] Responsive dashboards
* [ ] Improved accessibility

---

# 🔮 Future Vision

SellX aims to evolve from a negotiation interface into a complete **B2B deal operating system**.

```text
             PRODUCT DISCOVERY
                    │
                    ▼
              NEGOTIATION
                    │
                    ▼
              DEAL ROOM
                    │
                    ▼
             APPROVAL FLOW
                    │
                    ▼
              DEAL CLOSURE
                    │
                    ▼
             ORDER MANAGEMENT
                    │
                    ▼
              ANALYTICS
                    │
                    ▼
            BUSINESS INSIGHTS
```

---

# 🤝 Contributing

Contributions, ideas, and improvements are welcome.

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Make your changes
git add .

# Commit
git commit -m "Add your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📄 License

This project is currently available as a public GitHub repository.

See the repository for the latest licensing and usage information.

---

# 👨‍💻 Author

### Abhishek

GitHub:
https://github.com/Abhi13shek

---

# ⭐ Support

If you like **SellX**, consider giving the repository a ⭐ on GitHub.

Your support helps the project grow!

---

<p align="center">

### 💼 SellX

**Negotiate better. Track everything. Close smarter.**

Built with ❤️ using React, Vite, Node.js & Express.

</p>
