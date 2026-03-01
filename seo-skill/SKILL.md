# SEO Skill

How to handle SEO in a React + Vite app: dynamic meta tags per route, static HTML fallbacks, favicons, OG images, sitemaps, robots.txt, and structured data.

## Structure

```
seo-skill/
├── SKILL.md              # This file
├── seo-component.md      # <Seo /> component — dynamic meta tags per route
├── index-html.md         # Static fallback meta tags, favicon setup, OG image
├── sitemap-robots.md     # vite-plugin-sitemap + robots.txt
└── structured-data.md    # JSON-LD schema markup
```

## Where to Start

| Task | File |
| --- | --- |
| Add meta tags to a route | [seo-component.md](seo-component.md) |
| Set up base HTML, favicons, OG image | [index-html.md](index-html.md) |
| Generate sitemap and configure robots.txt | [sitemap-robots.md](sitemap-robots.md) |
| Add structured data to a landing page | [structured-data.md](structured-data.md) |

## Quick Reference

```tsx
// In any route component
import { Seo } from "@/components/shared/seo";

// Public page
<Seo
  title="Sign In"
  description="Sign in to your account."
  canonical="/auth/signin"
/>

// Landing page with structured data
<Seo
  title="Home"
  description="What your app does."
  canonical="/"
  schemaMarkup={organizationSchema}
/>

// Sensitive page — block indexing
<Seo title="Reset Password" noindex />
```
