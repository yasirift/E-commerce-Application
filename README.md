# E-Commerce App

A practice e-commerce web app built with React, TypeScript, and Redux Toolkit. It has a customer storefront (browse products, cart, checkout, order history) and an admin panel (manage products, view dashboard stats). Product data comes from the [DummyJSON](https://dummyjson.com) API.

## Features

**Customer**
- Login / register
- Browse products with search, category filter, sorting, and pagination
- Product details page
- Shopping cart (add, update quantity, remove)
- Checkout with shipping form
- Order history and order details

**Admin**
- Dashboard with sales, orders, customers, and product stats
- Product list with add, edit, and delete

## Tech Stack

- React 19 + TypeScript
- Vite
- Redux Toolkit
- React Router
- React Hook Form + Zod (form validation)
- Tailwind CSS
- Axios
- Recharts (dashboard charts)

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with:
   ```
   VITE_API_URL=https://dummyjson.com
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open the app at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run the app in development mode |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/          # Redux store setup
├── components/   # Reusable UI and shop components
├── features/     # Redux slices (auth, products, cart, orders)
├── hooks/        # Custom hooks
├── layouts/      # Page layouts (auth, customer, admin)
├── pages/        # Route pages
├── routes/       # Route definitions and route guards
├── schemas/      # Zod validation schemas
├── services/     # API setup (Axios)
├── types/        # Shared TypeScript types
└── utils/        # Helper utilities
```

## Notes

- This project uses the public DummyJSON API for products and auth, so data like orders and cart contents are only stored locally in the browser and are not persisted on a real backend.
- Built as a practice project to work with React, TypeScript, and Redux Toolkit in a full app structure.
