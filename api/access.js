const fs = require('node:fs/promises');
const path = require('node:path');
const companyAccess = require('./company-access');
const allowed = email => typeof email === 'string' && /^[^\s@]+@(ergovn\.com|tfw\.space)$/i.test(email);
const root = path.resolve(__dirname, '../web');
function page(ready) {
return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in · Ergo Academy</title><style>
*{box-sizing:border-box}body{margin:0;background:#eef4f0;color:#163d35;font:16px system-ui}header{padding:28px 6%;background:#123c36;color:white;font-size:24px;font-weight:750}.preview{filter:blur(9px);pointer-events:none;user-select:none;padding:50px 7%;height:100vh;overflow:hidden}.preview h1{font-size:48px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.cards div{background:white;border:1px solid #d4e1d9;border-radius:18px;padding:35px;height:170px}.veil{position:fixed;inset:0;background:#e8f1ec88;display:grid;place-items:center;padding:20px;overflow:auto}.signin{background:white;border:1px solid #d1dfd6;box-shadow:0 22px 90px #123c3622;border-radius:24px;padding:36px;max-width:460px;width:100%}.tag{font-size:12px;letter-spacing:2px;font-weight:750;color:#28745c}h2{font-size:30px;letter-spacing:-1px;margin:14px 0}p{line-height:1.6;color:#567067}label{display:block;font-weight:650;margin:22px 0 8px}input,button{font:inherit;border-radius:9px;padding:13px;width:100%}input{border:1px solid #a4bbb0}button{background:#136556;color:white;border:0;font-weight:650;cursor:pointer;margin-top:16px}button:disabled{opacity:.5;cursor:default}.secondary{background:#edf3ef;color:#285847}small{display:block;color:#657e72;line-height:1.6;margin-top:20px}.notice{background:#fff4d9;padding:12px;border-radius:9px;color:#715422;font-size:14px}#message{min-height:24px;font-size:14px}input:focus-visible,button:focus-visible{outline:3px solid #9ccab6;outline-offset:3px}[hidden]{display:none!important}@media(max-width:500px){.signin{padding:26px}.cards{grid-template-columns:1fr}}
</style><header aria-hidden="true">ergoers road map</header><div class="preview" aria-hidden="true" inert><h1>Learn. Apply. Remember.</h1><p>Your academy. Your next step.</p><div class="cards"><div>Corporate Culture</div><div>Operation Process</div><div>General Market</div><div>Costing</div><div>Product Training</div><div>Project Management</div></div></div><main class="veil"><section class="signin" aria-labelledby="title"><span class="tag">ERGO ACADEMY · MEMBERS ONLY</span><h2 id="title">Your next step starts here.</h2><p>Enter your company email and the individual access code provided by your company.</p>${ready?'':'<p class="notice">Company-code access is awaiting activation. Please contact your academy administrator.</p>'}<form id="companyForm"><label for="email">Company email</label><input id="email" type="email" autocomplete="username" required maxlength="254" placeholder="your.name@ergovn.com"><label for="code">Company access code</label><input id="code" type="password" autocomplete="current-password" required maxlength="80" spellcheck="false" autocapitalize="off" placeholder="Enter your assigned code"><button ${ready?'':'disabled'}>Enter academy</button></form><p id="message" role="status" aria-live="polite"></p><small>Only assigned @ergovn.com and @tfw.space accounts can enter.<br>Keep your individual code private. No email delivery is needed.<br>Need a code or a replacement? Contact your academy administrator.</small></section></main><script>
const form=document.getElementById('companyForm'),message=document.getElementById('message');
form.onsubmit=async e=>{e.preventDefault();const button=form.querySelector('button');button.disabled=true;message.textContent='Checking your access…';try{const response=await fetch('/auth/company-code',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('email').value.trim().toLowerCase(),code:document.getElementById('code').value})});const data=await response.json();if(!response.ok)throw Error(data.error||'Please try again.');document.getElementById('code').value='';location.reload();}catch(error){message.textContent=error.message;}finally{button.disabled=false;}};
</script></html>`;
}
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));}
async function handler(req,res){
res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');
const companyConfig=companyAccess.configuration();const ready=!!companyConfig;
let pathname;try{pathname=decodeURIComponent(new URL(req.url,'https://academy.invalid').pathname);}catch{return json(res,400,{error:'Invalid path.'});}
if(req.method==='POST'){
 const origin=req.headers.origin;const host=req.headers.host;
 if(!origin||origin!=='https://'+host&&!(process.env.NODE_ENV==='test'&&origin==='http://'+host))return json(res,403,{error:'Request not allowed.'});
 if(pathname==='/auth/logout'){res.setHeader('Set-Cookie','__Host-ergo_access=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');return json(res,200,{ok:true});}
 if(pathname!=='/auth/company-code')return json(res,404,{error:'Use your company-assigned code to sign in.'});
 if(!ready)return json(res,503,{error:'Company-code access is awaiting activation.'});
 let input=req.body;try{if(typeof input==='string')input=JSON.parse(input);}catch{return json(res,400,{error:'Invalid request.'});}
 try{
  const record=await companyAccess.verify(companyConfig,input?.email,input?.code);
  if(!record)return json(res,401,{error:'Email or company code is incorrect, expired or revoked.'});
  const token=companyAccess.issue(companyConfig,record);
  res.setHeader('Set-Cookie','__Host-ergo_access='+token+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600');
  return json(res,200,{ok:true});
 }catch{return json(res,503,{error:'Sign-in is temporarily unavailable. Please try again.'});}
}
if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD, POST');return json(res,405,{error:'Method not allowed.'});}
let user=null;const match=String(req.headers.cookie||'').match(/(?:^|;\s*)__Host-ergo_access=([^;]+)/);
if(ready&&match){try{user=companyAccess.session(companyConfig,decodeURIComponent(match[1]));}catch{}}
if(!user){res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");res.statusCode=200;return res.end(req.method==='HEAD'?'':page(ready));}
if(pathname.includes('\\')||pathname.split('/').some(p=>p.startsWith('.')))return json(res,404,{error:'Not found.'});
const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))return json(res,404,{error:'Not found.'});
try{let data=await fs.readFile(file);const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf'};res.setHeader('Content-Type',types[ext]||'application/octet-stream');if(ext==='.html'){data=data.toString().replace('</body>',`<button style="position:fixed;bottom:12px;right:12px;z-index:100" onclick="fetch('/auth/logout',{method:'POST'}).then(()=>location.reload())">Sign out</button></body>`);}return res.end(req.method==='HEAD'?'':data);}catch{return json(res,404,{error:'Not found.'});}
}
module.exports=handler;
module.exports.allowed=allowed;
module.exports.page=page;
