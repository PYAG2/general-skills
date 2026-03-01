# General Skills

A collection of reusable skills for rapid development. Each skill is a self-contained reference — source code + docs — that an LLM or developer can read and replicate in any project.

Skills live outside the main `src/` so they don't affect the build. They are gitignored and cloned separately (see **Installation** below).

---

## Installation

```bash
# In the root of your project
git clone <skills-repo-url> general-skills

# Then gitignore it so it doesn't mix with project source
echo "general-skills/" >> .gitignore
```

The folder stays local as a reference. Pull it to get updates, or copy individual files to your project as needed.

---

## Available Skills

### API Documentation — [`api-doc-skill/SKILL.md`](api-doc-skill/SKILL.md)

Build a professional API docs portal: MDX content, 3-column layout, syntax-highlighted code blocks, copy-page button, and a data-driven sidebar. Includes source files ready to copy into your project.

---

### Permissions & Authorization — [`permissions-skill/SKILL.md`](permissions-skill/SKILL.md)

How to implement `hasRole` / `hasPermission` checks from route guards (`beforeLoad`) through to conditional rendering and disabled buttons. Based on TanStack Router + React Query.

---

### Page Layout — [`page-layout-skill/SKILL.md`](page-layout-skill/SKILL.md)

The `PageHeader` pattern: titles, descriptions, primary actions, and custom actions slots. How the dashboard layout wraps routes and how breadcrumbs work.

---

### Analytics (PostHog) — [`analytics-skill/SKILL.md`](analytics-skill/SKILL.md)

How PostHog is set up and how to call `track()`, `identifyUser()`, and `resetUserIdentity()` across the app. Includes the full typed event map and an `EVENT_NAMES` constant enhancement for better autocomplete.

---

### SEO — [`seo-skill/SKILL.md`](seo-skill/SKILL.md)

`<Seo />` component (react-helmet-async) for per-route meta tags, OG, and Twitter Cards. Base HTML static fallbacks, favicon setup via realfavicongenerator.net, OG image via ogimagemaker.com, sitemap generation, robots.txt, and JSON-LD structured data.

---

### Integration (TanStack Query + Axios) — [`integration-skill/SKILL.md`](integration-skill/SKILL.md)

QueryClient and axios setup (session cookie + JWT variant), query key conventions, single and parallel queries (`useQuery` / `useQueries`), and three mutation patterns: simple form submit, with confirmation dialog, and with cache invalidation.

---

## How to Use a Skill

Each skill has a `SKILL.md` that explains what it covers and links to the relevant files. Start there, then follow the file references for the specific thing you need.
