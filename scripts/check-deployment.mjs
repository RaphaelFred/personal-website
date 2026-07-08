const canonicalOrigin = 'https://raphaelfredebeul.de';
const canonicalUrl = `${canonicalOrigin}/`;
const redirectHosts = [
  'www.raphaelfredebeul.de',
  'raphael-fredebeul.de',
  'www.raphael-fredebeul.de',
];
const redirectPaths = [
  '/',
  '/beratung/?source=deployment-check',
];

const timeoutMs = 10000;

function normalizeLocation(location) {
  if (!location) {
    return '';
  }

  return new URL(location, canonicalUrl).toString();
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function assertCanonicalPage() {
  const response = await fetchWithTimeout(canonicalUrl, {
    redirect: 'manual',
    headers: { 'user-agent': 'deployment-check' },
  });

  if (response.status !== 200) {
    throw new Error(`${canonicalUrl} returned ${response.status}, expected 200`);
  }

  const html = await response.text();
  const requiredSnippets = [
    '<link rel="canonical" href="https://raphaelfredebeul.de/">',
    '<meta property="og:url" content="https://raphaelfredebeul.de/">',
    '<meta property="og:image" content="https://raphaelfredebeul.de/social-card.svg">',
    '<meta name="twitter:image" content="https://raphaelfredebeul.de/social-card.svg">',
  ];

  for (const snippet of requiredSnippets) {
    if (!html.includes(snippet)) {
      throw new Error(`Missing expected HTML snippet: ${snippet}`);
    }
  }

  console.log(`OK ${canonicalUrl} returns 200 and canonical metadata`);
}

async function assertRedirect(sourceUrl, expectedUrl) {
  const response = await fetchWithTimeout(sourceUrl, {
    method: 'HEAD',
    redirect: 'manual',
    headers: { 'user-agent': 'deployment-check' },
  });
  const location = normalizeLocation(response.headers.get('location'));

  if (response.status !== 301) {
    throw new Error(`${sourceUrl} returned ${response.status}, expected 301`);
  }

  if (location !== expectedUrl) {
    throw new Error(`${sourceUrl} redirects to ${location || '(empty)'}, expected ${expectedUrl}`);
  }

  console.log(`OK ${sourceUrl} redirects to ${expectedUrl}`);
}

async function assertTextAsset(path, requiredSnippets) {
  const url = `${canonicalOrigin}${path}`;
  const response = await fetchWithTimeout(url, {
    redirect: 'manual',
    headers: { 'user-agent': 'deployment-check' },
  });

  if (response.status !== 200) {
    throw new Error(`${url} returned ${response.status}, expected 200`);
  }

  const text = await response.text();

  for (const snippet of requiredSnippets) {
    if (!text.includes(snippet)) {
      throw new Error(`${url} is missing expected text: ${snippet}`);
    }
  }

  console.log(`OK ${url} returns 200 and expected content`);
}

try {
  await assertCanonicalPage();
  await assertTextAsset('/robots.txt', [
    'Host: raphaelfredebeul.de',
    'Sitemap: https://raphaelfredebeul.de/sitemap.xml',
  ]);
  await assertTextAsset('/sitemap.xml', [
    '<loc>https://raphaelfredebeul.de/</loc>',
    '<loc>https://raphaelfredebeul.de/beratung/</loc>',
    '<loc>https://raphaelfredebeul.de/ueber-mich/</loc>',
    '<loc>https://raphaelfredebeul.de/blog/</loc>',
  ]);

  for (const host of redirectHosts) {
    for (const path of redirectPaths) {
      const sourceUrl = `https://${host}${path}`;
      const expectedUrl = `${canonicalOrigin}${path}`;
      await assertRedirect(sourceUrl, expectedUrl);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
