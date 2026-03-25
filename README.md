# Network Debug Lab — DevTools & Debugging

Find and fix 4 intentional bugs using only the browser Network Tab and Console.

## Quick Start

**1. Fork this repo** — Click the **Fork** button at the top right of this page.

**2. Clone your fork:**
```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/fpp-network-debug.git
cd fpp-network-debug
npm install
```

Create `.env` with your Supabase credentials, then `npm run dev`.

Open Chrome DevTools (F12) → Network tab. Keep it open the entire time.

## Exercise Instructions

This repo is part of the **From Prompt to Production** course.

👉 **[Find the full exercise instructions on the course platform](https://aicode-academy.com)**

## Tech Stack

- React Router v7 (framework mode)
- Supabase
- Tailwind CSS v4
- TypeScript

## Project Structure

```
app/
├── routes/
│   └── home.tsx          ← Debug interface with intentional bugs
├── lib/
│   └── supabase.ts       ← Supabase client
└── routes.ts             ← Route configuration
```

---

Built for [AI Code Academy](https://aicode-academy.com) — From Prompt to Production course.
