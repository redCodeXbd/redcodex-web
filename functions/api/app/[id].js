// Cloudflare Pages Function: /api/app/erpx and /api/app/hrmx-sync.
// The mobile apps publish an update.json to a file host that does not allow browsers on other sites to read it (no CORS). The website
// asks this function instead: it reads the manifest on the server and hands it back from the website's own address, so the download
// cards always show the newest version and its direct link. Only the two manifests listed here can be fetched.
const MANIFESTS = {
  'erpx': 'https://redspace.sgp1.cdn.digitaloceanspaces.com/redcodex/erpx-mobile/update.json',
  'hrmx-sync': 'https://redspace.sgp1.cdn.digitaloceanspaces.com/aenrivercruise/production/hrmx-sync/update.json',
};

export async function onRequestGet({ params }) {
  const url = MANIFESTS[String(params.id)];
  if (!url) { return new Response('Not found', { status: 404 }); }
  try {
    const r = await fetch(url, { cf: { cacheTtl: 60, cacheEverything: true } });
    if (!r.ok) { return new Response('The manifest is not available', { status: 502 }); }
    return new Response(await r.text(), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=60' } });
  } catch {
    return new Response('The manifest is not available', { status: 502 });
  }
}
