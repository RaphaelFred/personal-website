import { getCollection } from 'astro:content';

const staticRoutes = ['/', '/beratung/', '/ueber-mich/', '/blog/'];

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function toSitemapEntry(url: URL, lastmod?: Date) {
  const lastmodTag = lastmod
    ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>`
    : '';

  return `  <url>\n    <loc>${escapeXml(url.toString())}</loc>${lastmodTag}\n  </url>`;
}

export async function GET({ site }: { site: URL }) {
  const posts = await getCollection('blog');
  const staticEntries = staticRoutes.map((route) => toSitemapEntry(new URL(route, site)));
  const postEntries = posts
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((post) => toSitemapEntry(new URL(`/blog/${post.slug}/`, site), post.data.publishDate));

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...staticEntries,
    ...postEntries,
  ].join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
