# Etho-Can Gemstones — Online Store

E-commerce storefront and admin dashboard for Etho-Can Gemstones, an Ethiopian
Welo opal wholesaler based in Toronto (est. 2012). Products are sold by gram
and carat: rough opal, crystal opal, and polished opal.

## Stack

- **React 19 + Vite** — frontend SPA
- **React Router** — multi-page routing (shop, product pages, checkout, admin)
- **Tailwind CSS v4** — styling
- **Framer Motion** — animation
- **lucide-react** — icons

Store data (products, orders, coupons, reviews, analytics) persists in the
browser via `localStorage` — no backend required for demo use. The order and
payment model is Stripe-ready (`paymentStatus` per order, mark-as-paid flow).

## Getting started

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  pages/          # storefront pages (home, shop, product, checkout, ...)
  components/     # shared storefront components
  admin/          # admin dashboard (products, orders, inventory, analytics)
  context/        # cart state
  analytics/      # event tracking for the admin analytics page
  hooks/          # shared hooks (page meta, ...)
  data/           # default product catalog
```

## Admin

The dashboard lives at `/admin`. Sign-in credentials are stored as SHA-256
hashes in `src/admin/AdminContext.jsx` — to rotate the password, generate a
new hash with:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_NEW_PASSWORD').digest('hex'))"
```

and replace `ADMIN_PASSWORD_HASH`.

## Deployment

Configured for Vercel (SPA rewrites + security headers in `vercel.json`).
