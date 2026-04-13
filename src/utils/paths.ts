export function withBase(path: string) {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  if (!path || path === '/') {
    return base;
  }

  const normalizedPath = path.startsWith('#') ? path.slice(1) : path.replace(/^\/+/, '');
  return `${base}${normalizedPath}`;
}
