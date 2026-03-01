# Seo Component

A reusable wrapper around `react-helmet-async` that injects meta tags, OG tags, Twitter Card tags, and optional JSON-LD into the document head per route.

## Install

```bash
npm install react-helmet-async
```

## HelmetProvider Setup

Wrap the app root once in `main.tsx`:

```tsx
import { HelmetProvider } from "react-helmet-async";

root.render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
```

## The Component

```tsx
// src/components/shared/seo.tsx

import { Helmet } from "react-helmet-async";

export interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  schemaMarkup?: Record<string, unknown>;
}

const DEFAULT_TITLE = "Your App Name";
const DEFAULT_DESCRIPTION = "What your app does.";
const DEFAULT_IMAGE = "/images/og-image.jpeg";
const SITE_NAME = "Your App Name";
const BASE_URL = "https://yourdomain.com"; // set this to your actual domain

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  noindex = false,
  schemaMarkup,
}: SeoProps) {
  // "Page Title | Site Name", or just DEFAULT_TITLE if no title given
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  // Resolve relative image paths to absolute URLs
  const fullImageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  // Resolve relative canonical paths to absolute URLs
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${BASE_URL}${canonical}`
    : undefined;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* JSON-LD Structured Data */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
}
```

## Props

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | — | Page title. Auto-appends `\| Site Name`. Omit to use `DEFAULT_TITLE`. |
| `description` | `string` | `DEFAULT_DESCRIPTION` | Meta description and OG description |
| `canonical` | `string` | — | Canonical URL. Relative paths are resolved to absolute. |
| `image` | `string` | `DEFAULT_IMAGE` | OG and Twitter image. Relative paths resolved to absolute. |
| `noindex` | `boolean` | `false` | Adds `noindex, nofollow` — use on auth callbacks, password reset, etc. |
| `schemaMarkup` | `object` | — | JSON-LD structured data object. Rendered as `<script type="application/ld+json">`. |

## Usage Patterns

**Public page with canonical:**

```tsx
<Seo
  title="Sign In"
  description="Sign in to your account to access the dashboard."
  canonical="/auth/signin"
/>
```

**Landing page with structured data:**

```tsx
<Seo
  title="Welcome"
  description="What your app does for users."
  canonical="/"
  schemaMarkup={organizationSchema}
/>
```

**Sensitive page — block indexing:**

```tsx
<Seo title="Reset Password" noindex />
```

**Conditional noindex (e.g. after form submit):**

```tsx
<Seo
  title={emailSent ? "Link Sent" : "Reset Password"}
  noindex={emailSent}
/>
```

**Examples from codebase:**

`src/routes/auth/signin.tsx`:

```tsx
<Seo
  title="Sign In"
  description="Sign in to your account to access the fraud intelligence dashboard."
  canonical="/auth/signin"
/>
```

`src/routes/auth/reset-password.tsx` — token in URL, never index:

```tsx
<Seo title="Change Password" noindex />
```
