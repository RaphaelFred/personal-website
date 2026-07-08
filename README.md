# Raphael Fredebeul Website

Personal website built with Astro and intended to be published at:

- Primary domain: `raphaelfredebeul.de`
- Redirect/backup domain: `raphael-fredebeul.de`

## Local Development

```sh
npm install
npm run dev
```

## Production Build

```sh
npm run build
npm run preview
```

The production output is generated in `dist/`.

After the Cloudflare Pages deployment and domain redirects are live, verify the public setup with:

```sh
npm run check:deployment
```

The deployment check verifies the canonical page, `robots.txt`, `sitemap.xml`, root-domain redirects, and one nested redirect with query string preservation.

Static launch files in `public/` are copied into `dist/` during the build:

- `robots.txt` sets `raphaelfredebeul.de` as the preferred host.
- `_headers` adds conservative security and privacy headers for Cloudflare Pages.

## Cloudflare Pages Setup

Recommended setup:

- Hosting: Cloudflare Pages Free
- Repository: `RaphaelFred/personal-website`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `>=18.17.1`

Add these custom domains to the Cloudflare Pages project:

- `raphaelfredebeul.de`
- `www.raphaelfredebeul.de`
- `raphael-fredebeul.de`
- `www.raphael-fredebeul.de`

Use `raphaelfredebeul.de` as the canonical domain. Redirect the other variants to it with Cloudflare Bulk Redirects, not with a Pages `_redirects` file. Pages `_redirects` is useful for path redirects, but not for domain-level redirects.

Create a bulk redirect list with these entries:

| Source URL | Target URL | Status |
| :--- | :--- | :--- |
| `www.raphaelfredebeul.de` | `https://raphaelfredebeul.de` | `301` |
| `raphael-fredebeul.de` | `https://raphaelfredebeul.de` | `301` |
| `www.raphael-fredebeul.de` | `https://raphaelfredebeul.de` | `301` |

Enable these parameters for each entry:

- Preserve query string
- Subpath matching
- Preserve path suffix

## Domain Checklist

1. Register `raphaelfredebeul.de`.
2. Register `raphael-fredebeul.de`.
3. Add both domains to Cloudflare.
4. Point both domains to Cloudflare nameservers if they were registered elsewhere.
5. Connect the GitHub repository to Cloudflare Pages.
6. Add the four custom domain variants listed above.
7. Configure Bulk Redirects to the canonical domain.
8. Run `npm run check:deployment` once DNS and HTTPS certificates are active.
9. Run a production build locally before pushing major changes.
