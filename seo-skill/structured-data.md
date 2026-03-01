# Structured Data (JSON-LD)

JSON-LD tells search engines what your site is about in a machine-readable format. Google uses it for rich results.

## When to Use

- **Homepage / landing page** — yes. Define your Organization and WebSite.
- **Auth pages** — no. Not useful for crawlers.
- **Dashboard / app pages** — no. These are excluded from indexing.

## Basic Schemas

### Organization

Describes the company behind the app:

```ts
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Your Company Name",
  description: "What your company does.",
  url: "https://yourdomain.com",
};
```

### WebSite

Describes the website itself. Enables the sitelinks searchbox in Google:

```ts
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Your App Name",
  url: "https://yourdomain.com",
};
```

## Passing to the Seo Component

Use `schemaMarkup` to pass a single object or a `@graph` array combining multiple schemas:

```tsx
// Single schema
<Seo
  title="Home"
  canonical="/"
  schemaMarkup={organizationSchema}
/>

// Multiple schemas via @graph
<Seo
  title="Home"
  canonical="/"
  schemaMarkup={{
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema],
  }}
/>
```

The `<Seo />` component renders this as:

```html
<script type="application/ld+json">
  { ...your schema }
</script>
```

## Example from codebase

`src/routes/index.tsx` — homepage with both Organization and WebSite:

```ts
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rancard F8",
  description: "Ghana's centralized fraud intelligence hub.",
  url: "https://example.com",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rancard F8",
  url: "https://example.com",
};

function RouteComponent() {
  return (
    <main>
      <Seo
        title="Fraud Intelligence Hub for Mobile Money"
        description="..."
        canonical="/"
        schemaMarkup={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema, websiteSchema],
        }}
      />
      {/* page content */}
    </main>
  );
}
```

## Other Useful Schema Types

Add these to `@graph` as your content grows:

```ts
// For a blog post or article
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Article Title",
  description: "Article description.",
  datePublished: "2026-01-01",
  author: { "@type": "Organization", name: "Your Company" },
};

// For an FAQ section
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is your product?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our product does...",
      },
    },
  ],
};
```

**Validate your schema:** [https://validator.schema.org](https://validator.schema.org)
