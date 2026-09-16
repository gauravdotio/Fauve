# Fauve — Luxury E-Commerce Platform & Admin Suite

A modern, high-performance, full-stack luxury fashion and apparel e-commerce platform built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, PostgreSQL, and Prisma ORM.

---

## ✨ Features

### 🛍️ Customer Storefront
- **High-Performance Catalog:** Real-time search, category navigation, multi-attribute filtering (size, color, price range), and sorting.
- **Product Experience:** Multi-image gallery with high-res zoom, color swatches, size selectors, real-time stock availability, and verified buyer reviews.
- **Cart & Wishlist:** Client-side persistent state powered by Zustand with instant cart drawer updates.
- **Checkout & Promotions:** Frictionless multi-step checkout supporting promotional coupon codes (percentage and flat discounts) and order generation.
- **Customer Accounts:** Secure authentication via NextAuth (credentials & bcrypt hashing), address book management, and order history tracking.

### ⚙️ Merchant Admin Portal (`/admin`)
- **Executive Analytics:** Sales overview, revenue trends, and key performance metrics visualized with Recharts.
- **Catalog Management:** Full CRUD operations for products, categories, image galleries, and multi-variant SKUs (size/color matrix).
- **Order Fulfillment:** Comprehensive pipeline tracking order statuses (`PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED` → `CANCELLED`).
- **Promotional Engine:** Active coupon generator supporting percentage and fixed discount configurations.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions)
- **Frontend:** [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/) with role-based access control
- **Validation:** [Zod](https://zod.dev/)
- **Charts & Visuals:** [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database instance

### 1. Clone & Install
```bash
git clone https://github.com/gauravdotio/Fauve.git
cd Fauve
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fauve"
AUTH_SECRET="your-generated-auth-secret"
```

### 3. Database Migration & Seed
Run database migrations and populate sample products, categories, and accounts:
```bash
npm run db:migrate
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the merchant dashboard.

---

## 🔑 Demo Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fauve.example.com` | `admin12345` | Full access to `/admin` dashboard, orders, products, and coupons |
| **Customer** | `customer@fauve.example.com` | `customer12345` | Storefront account, checkout, and order history |
| **Promo Code** | `WELCOME10` | — | 10% discount on cart during checkout |

---

## 📂 Project Architecture

```
├── prisma/
│   ├── schema.prisma       # Database models (Products, Orders, Users, Coupons)
│   ├── migrations/         # PostgreSQL database migrations
│   └── seed.ts             # Comprehensive database seeder
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── (storefront)/   # Customer-facing routes (shop, product, cart, checkout)
│   │   ├── admin/          # Merchant admin dashboard (products, orders, coupons)
│   │   └── api/            # API endpoints & NextAuth handler
│   ├── components/         # Reusable UI components & navigation
│   ├── lib/                # Database clients, actions, validation schemas
│   └── store/              # Zustand global client state stores
└── package.json
```

---

## 📄 License
This project is licensed under the MIT License.
