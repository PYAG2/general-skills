# Sitemap & robots.txt

## Sitemap with vite-plugin-sitemap

Generates `sitemap.xml` at build time based on your public routes.

```bash
npm install vite-plugin-sitemap
```

In `vite.config.ts`:

```ts
import Sitemap from "vite-plugin-sitemap";

// Routes crawlers should index
const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/reset-request",
  // add other public pages here
];

export default defineConfig({
  plugins: [
    // ... other plugins
    Sitemap({
      hostname: "https://yourdomain.com", // replace with your actual domain
      dynamicRoutes: publicRoutes,
      exclude: [
        "/dashboard",
        "/dashboard/*",
        "/docs",
        "/docs/*",
        "/auth/reset-password",  // contains token — never index
        "/auth/accept-invite",   // contains token — never index
      ],
      generateRobotsTxt: false, // manage robots.txt manually
    }),
  ],
});
```

**What to include / exclude:**

| Include | Exclude |
| --- | --- |
| Landing pages | Dashboard and all sub-routes |
| Auth pages (sign in, sign up) | Docs (behind auth) |
| Marketing pages | Auth callbacks with tokens in URL |

**Example from codebase** (`vite.config.ts`):

```ts
Sitemap({
  hostname: "https://example.com", // TODO: Replace with actual domain
  dynamicRoutes: publicRoutes,
  exclude: [
    "/dashboard",
    "/dashboard/*",
    "/docs",
    "/docs/*",
    "/auth/reset-password",
    "/auth/accept-invite",
  ],
  generateRobotsTxt: false,
}),
```

## robots.txt

Create `public/robots.txt` — this is served at `/robots.txt` by Vite automatically:

```
User-agent: *
Allow: /

# Protected app routes
Disallow: /dashboard
Disallow: /dashboard/*

# Behind auth
Disallow: /docs
Disallow: /docs/*

# Auth callbacks with tokens in the URL
Disallow: /auth/reset-password
Disallow: /auth/accept-invite

# Point to your sitemap
Sitemap: https://yourdomain.com/sitemap.xml
```

**Two places to update when the domain changes:**

1. `vite.config.ts` → `hostname`
2. `public/robots.txt` → `Sitemap:` URL
