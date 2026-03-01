# Base HTML: Static Fallbacks, Favicons, OG Image

## Why index.html Needs Meta Tags Too

Social media crawlers (Twitter, LinkedIn, Slack unfurls) often do not execute JavaScript. They read the raw HTML. If your meta tags are only injected by `react-helmet-async`, those crawlers will see nothing.

**Solution:** Put static fallback meta tags directly in `index.html`. The `<Seo />` component overrides them at runtime for users with JS, but crawlers get the static versions.

## Base index.html Pattern

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta Tags (static fallback) -->
    <title>Your App Name</title>
    <meta name="description" content="What your app does." />

    <!-- Open Graph (static fallback) -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Your App Name" />
    <meta property="og:description" content="What your app does." />
    <meta property="og:image" content="/images/og.webp" />
    <meta property="og:site_name" content="Your App Name" />

    <!-- Twitter Card (static fallback) -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Your App Name" />
    <meta name="twitter:description" content="What your app does." />
    <meta name="twitter:image" content="/images/og.webp" />

    <!-- Brand color (shown in browser chrome on mobile) -->
    <meta name="theme-color" content="#your-brand-color" />

    <!-- Favicons (generated via realfavicongenerator.net) -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Example from codebase** (`index.html`):

```html
<meta property="og:image" content="/images/og.webp" />
<meta name="twitter:image" content="/images/og.webp" />
<meta name="theme-color" content="#10B981" />
```

## OG Image

**Recommended size:** 1200 × 630px

**Format:** `.webp` (smallest) or `.jpeg`

**Location:** `public/images/og.webp` — served at `/images/og.webp`

**Generate your OG image:** [https://ogimagemaker.com](https://ogimagemaker.com)
- Enter your app name, tagline, and brand colors
- Download and save to `public/images/og.webp`

## Favicons

A complete favicon set covers: browser tab, bookmarks, mobile home screen, PWA, Windows tiles.

**Generate your favicon set:** [https://realfavicongenerator.net](https://realfavicongenerator.net)

1. Upload your logo (SVG or high-res PNG, at least 512×512)
2. Configure colors for iOS/Android/Windows
3. Download the package
4. Drop all files into `/public/`
5. The generator gives you the exact `<link>` tags to paste into `index.html`

**Files you'll typically get in `/public/`:**

```
public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── site.webmanifest
```

`site.webmanifest` controls the PWA name and icons. Update `name` and `short_name` to your app name.
