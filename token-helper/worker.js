/* Sadhana token helper: a Cloudflare Worker you own.
   It swaps Google sign-in codes for passes, and renews them, using the client secret kept here.
   It stores nothing and never sees the planner itself: the app talks to Google Drive directly.
   Settings needed (Worker > Settings > Variables and Secrets):
     GOOGLE_CLIENT_ID      the same client ID as in config.js
     GOOGLE_CLIENT_SECRET  the client secret from Google Cloud (add it as type "Secret") */
const ALLOWED_ORIGIN = 'https://sagarjhamb.github.io';

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const out = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return out({ error: 'Sadhana token helper is running.' }, 405);
    if (req.headers.get('Origin') !== ALLOWED_ORIGIN) return out({ error: 'origin' }, 403);
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return out({ error: 'helper_not_set_up' }, 500);

    let body;
    try { body = await req.json(); } catch (e) { return out({ error: 'bad_request' }, 400); }
    const path = new URL(req.url).pathname;
    const p = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET });

    if (path === '/exchange') {
      if (!body.code || !String(body.redirect_uri || '').startsWith(ALLOWED_ORIGIN + '/')) return out({ error: 'bad_request' }, 400);
      p.set('grant_type', 'authorization_code');
      p.set('code', body.code);
      p.set('redirect_uri', body.redirect_uri);
      if (body.code_verifier) p.set('code_verifier', body.code_verifier);
    } else if (path === '/refresh') {
      if (!body.refresh_token) return out({ error: 'bad_request' }, 400);
      p.set('grant_type', 'refresh_token');
      p.set('refresh_token', body.refresh_token);
    } else if (path === '/revoke') {
      if (body.token) await fetch('https://oauth2.googleapis.com/revoke', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token: body.token }) });
      return out({ ok: true });
    } else {
      return out({ error: 'not_found' }, 404);
    }

    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: p,
    });
    const j = await r.json();
    const keep = {};
    for (const k of ['access_token', 'expires_in', 'refresh_token', 'scope', 'error', 'error_description']) if (j[k] !== undefined) keep[k] = j[k];
    return out(keep, r.status);
  },
};
