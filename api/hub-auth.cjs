const {createHash, randomBytes} = require('node:crypto');

const hub = 'https://ergovn-po-system.vercel.app/api/auth/hub/roadmap';
const roadmap = 'https://ergoers-training-roadmap.vercel.app';
const handshakeCookie = '__Host-ergo_roadmap_hub';
const valueFormat = /^[A-Za-z0-9_-]{43}$/;

function redirect(res, location) {
 res.statusCode = 303;
 res.setHeader('Location', location);
 res.setHeader('Referrer-Policy', 'no-referrer');
 res.end();
}

function cookie(value, age) {
 return handshakeCookie + '=' + value + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + age;
}

async function handleHub(req, res, url, verify, sessionCookie) {
 if (req.method !== 'GET') {
  res.statusCode = 405;
  res.setHeader('Allow', 'GET');
  return res.end();
 }

 const secret = process.env.ERGO_HUB_ROADMAP_SECRET;
 if (!secret || !valueFormat.test(secret)) return redirect(res, roadmap + '/');

 if (url.pathname === '/auth/hub') {
  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(32).toString('base64url');
  const destination = new URL(hub);
  destination.searchParams.set('state', state);
  destination.searchParams.set('challenge', createHash('sha256').update(verifier).digest('base64url'));
  res.setHeader('Set-Cookie', cookie(state + '.' + verifier, 600));
  return redirect(res, destination.href);
 }

 const saved = String(req.headers.cookie || '').split(';').map(part => part.trim())
  .find(part => part.startsWith(handshakeCookie + '='))?.slice(handshakeCookie.length + 1);
 const [savedState, verifier, extra] = saved?.split('.') ?? [];
 const state = url.searchParams.get('state');
 const code = url.searchParams.get('code');
 if (!state || state !== savedState || !valueFormat.test(state) || !verifier ||
  !valueFormat.test(verifier) || extra !== undefined) return redirect(res, roadmap + '/');

 res.setHeader('Set-Cookie', cookie('', 0));
 if (!code || !/^[A-Za-z0-9_.-]{100,7200}$/.test(code)) return redirect(res, roadmap + '/');

 try {
  const response = await fetch(hub, {
   method: 'POST',
   headers: {Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json'},
   body: JSON.stringify({code, state, verifier}),
   cache: 'no-store',
   redirect: 'error',
   signal: AbortSignal.timeout(10000),
  });
  if (response.ok) {
   const session = await response.json();
   if (typeof session?.accessToken === 'string' && session.accessToken.length <= 12000 &&
    Number.isSafeInteger(session.expires) && session.expires > Date.now() &&
    typeof session.userId === 'string' && await verify(session.accessToken, session.userId)) {
    const seconds = Math.min(3600, Math.floor((session.expires - Date.now()) / 1000));
    if (seconds > 0) res.setHeader('Set-Cookie', [cookie('', 0), sessionCookie(session.accessToken, seconds)]);
   }
  }
 } catch {
  // Leave the existing email login available.
 }
 return redirect(res, roadmap + '/');
}

module.exports = handleHub;
