const fs = require('node:fs/promises');
const path = require('node:path');
const microsoftAccess = require('./microsoft-access');
const allowed = email => typeof email === 'string' && /^[^\s@]+@(ergovn\.com|tfw\.space)$/i.test(email);
const root = path.resolve(__dirname, '../web');
function page(ready) {
return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in · Ergo Academy</title><style>
*{box-sizing:border-box}body{margin:0;background:#eef4f0;color:#163d35;font:16px system-ui}header{padding:28px 6%;background:#123c36;color:white;font-size:24px;font-weight:750}.preview{filter:blur(9px);pointer-events:none;user-select:none;padding:50px 7%;height:100vh;overflow:hidden}.preview h1{font-size:48px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.cards div{background:white;border:1px solid #d4e1d9;border-radius:18px;padding:35px;height:170px}.veil{position:fixed;inset:0;background:#e8f1ec88;display:grid;place-items:center;padding:20px;overflow:auto}.signin{background:white;border:1px solid #d1dfd6;box-shadow:0 22px 90px #123c3622;border-radius:24px;padding:36px;max-width:460px;width:100%}.tag{font-size:12px;letter-spacing:2px;font-weight:750;color:#28745c}h2{font-size:30px;letter-spacing:-1px;margin:14px 0}p{line-height:1.6;color:#567067}label{display:block;font-weight:650;margin:22px 0 8px}input,button{font:inherit;border-radius:9px;padding:13px;width:100%}input{border:1px solid #a4bbb0}button{background:#136556;color:white;border:0;font-weight:650;cursor:pointer;margin-top:16px}button:disabled{opacity:.5;cursor:default}.secondary{background:#edf3ef;color:#285847}small{display:block;color:#657e72;line-height:1.6;margin-top:20px}.notice{background:#fff4d9;padding:12px;border-radius:9px;color:#715422;font-size:14px}#message{min-height:24px;font-size:14px}input:focus-visible,button:focus-visible{outline:3px solid #9ccab6;outline-offset:3px}[hidden]{display:none!important}@media(max-width:500px){.signin{padding:26px}.cards{grid-template-columns:1fr}}
</style><header aria-hidden="true">ergoers road map</header><div class="preview" aria-hidden="true" inert><h1>Learn. Apply. Remember.</h1><p>Your academy. Your next step.</p><div class="cards"><div>Corporate Culture</div><div>Operation Process</div><div>General Market</div><div>Costing</div><div>Product Training</div><div>Project Management</div></div></div><main class="veil"><section class="signin" aria-labelledby="title"><span class="tag">ERGO ACADEMY · MEMBERS ONLY</span><h2 id="title">Your next step starts here.</h2><p>Use your company Microsoft account to unlock learning, tests and progress.</p>${ready?'':'<p class="notice">Microsoft sign-in is awaiting company activation.</p>'}<form method="get" action="/auth/microsoft"><button ${ready?'':'disabled'} type="submit"><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" style="vertical-align:middle;margin-right:10px"><path fill="#f25022" d="M0 0h9v9H0z"/><path fill="#7fba00" d="M11 0h9v9h-9z"/><path fill="#00a4ef" d="M0 11h9v9H0z"/><path fill="#ffb900" d="M11 11h9v9h-9z"/></svg>Sign in with Microsoft</button></form><p id="message" role="status" aria-live="polite"></p><small>Company Microsoft accounts only: @ergovn.com and @tfw.space.<br>Microsoft handles your password and company authentication.<br>No academy code or email delivery needed.</small></section></main><script>if(new URLSearchParams(location.search).get('signin')==='failed'){document.getElementById('message').textContent='Sign-in could not be completed. Use your company Microsoft account or contact IT.';}</script></html>`;
}
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));}
async function handler(req,res){
res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');
const ready=microsoftAccess.ready();
let pathname;try{pathname=decodeURIComponent(new URL(req.url,'https://academy.invalid').pathname);}catch{return json(res,400,{error:'Invalid path.'});}
if(req.method==='POST'){
 const origin=req.headers.origin;const host=req.headers.host;
 if(!origin||origin!=='https://'+host&&!(process.env.NODE_ENV==='test'&&origin==='http://'+host))return json(res,403,{error:'Request not allowed.'});
 if(pathname==='/auth/logout'){res.setHeader('Set-Cookie','__Host-ergo_access=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');return json(res,200,{ok:true});}
 return json(res,404,{error:'Use Sign in with Microsoft.'});
}
if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD, POST');return json(res,405,{error:'Method not allowed.'});}
if(pathname==='/auth/microsoft'){if(!ready)return json(res,503,{error:'Microsoft sign-in is awaiting activation.'});return microsoftAccess.start(res);}
if(pathname==='/auth/callback'){if(!ready)return json(res,503,{error:'Microsoft sign-in is awaiting activation.'});return microsoftAccess.callback(req,res,new URL(req.url,microsoftAccess.SITE));}
let user=null;const token=microsoftAccess.cookie(req,'__Host-ergo_access');if(ready&&token){try{user=await microsoftAccess.user(token);}catch{}}

if(!user){res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");res.statusCode=200;return res.end(req.method==='HEAD'?'':page(ready));}
if(pathname.includes('\\')||pathname.split('/').some(p=>p.startsWith('.')))return json(res,404,{error:'Not found.'});
const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))return json(res,404,{error:'Not found.'});
try{let data=await fs.readFile(file);const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf'};res.setHeader('Content-Type',types[ext]||'application/octet-stream');if(ext==='.html'){data=data.toString().replace('</body>',`<button style="position:fixed;bottom:12px;right:12px;z-index:100" onclick="fetch('/auth/logout',{method:'POST'}).then(()=>location.reload())">Sign out</button></body>`);}return res.end(req.method==='HEAD'?'':data);}catch{return json(res,404,{error:'Not found.'});}
}
module.exports=handler;
module.exports.allowed=allowed;
module.exports.page=page;
