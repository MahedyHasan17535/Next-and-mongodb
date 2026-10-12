<div align="center">

# 🛒 বাজার দর | BazarDor

**প্রয়োজনীয় পণ্যের দাম এক নজরে।**

নিত্যপ্রয়োজনীয় পণ্যের আজকের দর, দাম বাড়া-কমার হার এবং বিভিন্ন বাজারের দাম তুলনা করার একটি ওয়েব অ্যাপ।

</div>

---

## 📖 Description

BazarDor is a Bengali grocery price tracker. It shows today's price of everyday
products (rice, pulses, vegetables, fish, meat, oil, spices and more), how much the
price went up or down, and compares the price of each product across different
bazars. Signed-in users can open a detailed price summary for every product.

## 🛠️ Technologies Used

| Purpose | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + DaisyUI 5 |
| Authentication | [Better Auth](https://better-auth.com) (Email/Password, Google, GitHub) |
| Database | MongoDB (users only) |
| Notifications | react-hot-toast |
| Price ticker | react-marquee-text |
| Data | BazarDor Open API |

## ✨ Key Features

1. **Live price ticker** – an infinite scrolling strip with emoji, name, price per unit and ▲/▼ change.
2. **Risers & fallers** – top 6 products whose price went up and top 6 whose price went down today.
3. **Category pages with sorting** – sort by default, price low → high, or price high → low (Bengali numerals are compared by numeric value).
4. **Protected product details** – min / max / average price and a market-wise price table (login required).
5. **Authentication** – email/password plus Google and GitHub login, with toast messages for every action.
6. **Profile update** – change your name from the `My Profile` page.
7. **Skeleton loading & 404 pages** – smooth loading states and friendly "হোম পেজে ফিরে যান" empty states.
8. **Fully responsive** – works on mobile, tablet and desktop.

## 📁 Project Structure

```
src/
├── proxy.ts                 # protects /profile and /product/*
├── lib/                     # api, format helpers, better-auth (server + client)
├── components/              # Header, NavLinks, UserInfo, Marquee, Hero, ProductCard ...
└── app/
    ├── page.tsx             # home (hero + risers + fallers + all products)
    ├── category/[categoryId]
    ├── product/[slug]
    ├── signin | signup
    ├── profile | profile/update
    └── api/auth/[...all]
```

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

> For social login, add `<BETTER_AUTH_URL>/api/auth/callback/google` and
> `<BETTER_AUTH_URL>/api/auth/callback/github` as the redirect URLs in the Google / GitHub apps.

## 🌐 API

Base: `https://openapi.programming-hero.com/api/bazardor`
(alternatives are used automatically if the main one fails)

`/products` · `/products?category=chal` · `/products/1` · `/categories` · `/categories/chal`

## ☁️ Deployment

Deploy on Vercel and add the same environment variables in the project settings.
Dynamic routes (`/category/[categoryId]`, `/product/[slug]`) are server rendered, so reloading never causes a 404.
