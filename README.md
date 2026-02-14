# Network Debug Lab — DevTools & Debugging

Find and fix intentional bugs in API calls to learn browser DevTools and network debugging.

## What You'll Learn
- Browser DevTools Network tab
- Console debugging and error inspection
- Error handling best practices
- Fetch troubleshooting techniques
- Debugging JSON responses
- Offline handling and fallbacks

## Tech Stack
- **React Router v7** (framework mode) — pages and routing
- **Supabase** — database and auth
- **Tailwind CSS v4** — styling
- **TypeScript** — type-safe JavaScript

## Getting Started

```bash
# 1. Clone this repo
git clone https://github.com/LoisBN/fpp-network-debug.git
cd fpp-network-debug

# 2. Install dependencies
npm install

# 3. Copy the environment file
cp .env.example .env
# Add your Supabase URL and anon key to .env

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the app.

## Project Structure

```
fpp-network-debug/
├── app/
│   ├── routes/
│   │   └── home.tsx          # Debug interface with intentional bugs
│   └── lib/
│       └── supabase.ts       # Supabase client setup
├── .env.example
├── package.json
└── README.md
```

## Exercise Tasks

1. **Open DevTools Network tab** — Learn to inspect all HTTP requests and responses
2. **Find Bug 1** — Typo in API URL (pots → posts), check Network tab for 404 error
3. **Find and fix Bug 2-3** — Add try/catch blocks and offline error handling
4. **Find and fix Bug 4** — Display user names instead of [object Object], use proper JSON parsing
5. **Test debugging techniques** — Use Console tab, Network tab, and breakpoints

## Hints

- Open DevTools: F12 or Cmd+Option+I (Mac)
- Network tab shows all requests with status codes (red = failed, green = success)
- Console tab displays JavaScript errors and console.log output
- Offline mode: DevTools → Network → check "Offline" checkbox to test
- `typeof data === 'object'` helps detect when you're logging objects instead of values
- Use JSON.stringify(data, null, 2) to pretty-print objects in console

---

Built for [AI Code Academy](https://aicode-academy.com) — From Prompt to Production course.
