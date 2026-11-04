const fs = require('node:fs/promises');
const path = require('node:path');
const project='https://dlfgepzuxmkjkjwyrrsp.supabase.co';
const allowed = email => typeof email === 'string' && email.length<=254 && /^[^\s@]+@(ergovn\.com|tfw\.space)$/i.test(email);
const root = path.resolve(__dirname, '../web');
const cookieName='__Host-ergo_academy_session';
function authorized(user){return !!(user?.id&&user.email_confirmed_at&&allowed(user.email)&&!(user.banned_until&&Date.parse(user.banned_until)>Date.now())&&!user.factors?.some(f=>f.status==='verified'));}
function sessionCookie(token,age){return cookieName+'='+encodeURIComponent(token)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+age;}
function page(ready) {
return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in · Ergo Academy</title><style>
*{box-sizing:border-box}body{margin:0;background:#eef4f0;color:#163d35;font:16px system-ui}header{padding:28px 6%;background:#123c36;color:white;font-size:24px;font-weight:750}main{display:grid;place-items:center;padding:24px;min-height:75vh}a{color:#136556}.signin{background:white;border:1px solid #d1dfd6;box-shadow:0 22px 90px #123c3622;border-radius:24px;padding:36px;max-width:460px;width:100%}.tag{font-size:12px;letter-spacing:2px;font-weight:750;color:#28745c}h2{font-size:30px;letter-spacing:-1px;margin:14px 0}p{line-height:1.6;color:#567067}label{display:block;font-weight:650;margin:22px 0 8px}input,button{font:inherit;border-radius:9px;padding:13px;width:100%}input{border:1px solid #a4bbb0}button{background:#136556;color:white;border:0;font-weight:650;cursor:pointer;margin-top:16px}button:disabled{opacity:.5;cursor:default}.secondary{background:#edf3ef;color:#285847}small{display:block;color:#657e72;line-height:1.6;margin-top:20px}.notice{background:#fff4d9;padding:12px;border-radius:9px;color:#715422;font-size:14px}#message{min-height:24px;font-size:14px}input:focus-visible,button:focus-visible{outline:3px solid #9ccab6;outline-offset:3px}[hidden]{display:none!important}@media(max-width:500px){.signin{padding:26px}}
</style><header>ergoers road map</header><main><section class="signin" aria-labelledby="title"><span class="tag">ERGO ACADEMY · MEMBERS ONLY</span><h2 id="title">Your next step starts here.</h2><p>Sign in with the same Ergo account you use for POs and Project Management.</p>${ready?'':'<p class="notice">Email sign-in is being connected. Academy access is locked until setup is complete.</p>'}<form id="emailForm"><label for="email">Company email</label><input id="email" type="email" autocomplete="email" required placeholder="your.name@ergovn.com" maxlength="254"><button ${ready?'':'disabled'}>Send verification code</button></form><form id="codeForm" hidden><label for="code">Verification code</label><input id="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}" minlength="6" maxlength="10" required placeholder="Enter code from your email"><button>Verify & enter academy</button><button type="button" class="secondary" id="change">Use another email</button></form><p id="message" role="status" aria-live="polite"></p><small>Only @ergovn.com and @tfw.space emails are accepted.<br>No password needed. Use an existing Ergo account.</small><p><a href="https://ergovn-pm-system.vercel.app/#projects">Ergovn PM</a> · <a href="https://ergovn-po-system.vercel.app/team/workspace">Ergo POs System</a></p></section></main><script>
const emailForm=document.getElementById('emailForm'),codeForm=document.getElementById('codeForm'),email=document.getElementById('email'),code=document.getElementById('code'),message=document.getElementById('message');let selected='';
async function post(url,data){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const b=await r.json();if(!r.ok)throw Error(b.error||'Please try again.');return b;}
emailForm.onsubmit=async e=>{e.preventDefault();selected=email.value.trim().toLowerCase();if(!/^[^\\s@]+@(ergovn\\.com|tfw\\.space)$/.test(selected)){message.textContent='Use your @ergovn.com or @tfw.space email.';return;}const b=emailForm.querySelector('button');b.disabled=true;message.textContent='Sending your code…';try{await post('/auth/send',{email:selected});emailForm.hidden=true;codeForm.hidden=false;message.textContent='Check '+selected+' for your code. Check spam too.';code.focus();}catch(e){message.textContent=e.message;}finally{b.disabled=false;}};
codeForm.onsubmit=async e=>{e.preventDefault();const b=codeForm.querySelector('button');b.disabled=true;message.textContent='Verifying…';try{await post('/auth/verify',{email:selected,token:code.value.trim()});location.reload();}catch(e){message.textContent=e.message;}finally{b.disabled=false;}};
document.getElementById('change').onclick=()=>{codeForm.hidden=true;emailForm.hidden=false;code.value='';message.textContent='';email.focus();};
</script></html>`;
}
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));}
async function auth(endpoint,body,token){const base=project;const key=process.env.SUPABASE_PUBLISHABLE_KEY;const r=await fetch(base+'/auth/v1/'+endpoint,{method:body?'POST':'GET',headers:{apikey:key,...(token?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(10000)});return {ok:r.ok,status:r.status,data:await r.json()};}
async function handler(req,res){
res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');
const ready=process.env.SUPABASE_URL===project&&!!process.env.SUPABASE_PUBLISHABLE_KEY;
let pathname;try{pathname=decodeURIComponent(new URL(req.url,'https://academy.invalid').pathname);}catch{return json(res,400,{error:'Invalid path.'});}
if(req.method==='POST'){
 const origin=req.headers.origin;const host=req.headers.host;
 if(!origin||origin!=='https://'+host&&!(process.env.NODE_ENV==='test'&&origin==='http://'+host))return json(res,403,{error:'Request not allowed.'});
 if(pathname==='/auth/logout'){res.setHeader('Set-Cookie',sessionCookie('',0));return json(res,200,{ok:true});}
 if(!['/auth/send','/auth/verify'].includes(pathname))return json(res,404,{error:'Not found.'});
 if(!ready)return json(res,503,{error:'Email sign-in setup is not complete yet.'});
 let body=req.body;try{if(typeof body==='string')body=JSON.parse(body);}catch{return json(res,400,{error:'Invalid request.'});}
 const email=typeof body?.email==='string'?body.email.trim().toLowerCase():'';if(email.length>254||!allowed(email))return json(res,403,{error:'Use your @ergovn.com or @tfw.space email.'});
 try{
 if(pathname==='/auth/send'){const r=await auth('otp',{email,create_user:false});return json(res,r.ok?200:r.status===429?429:400,r.ok?{ok:true}:{error:'Could not send a code. Please wait a minute and try again.'});}
 const token=String(body?.token||'');if(!/^\d{6,10}$/.test(token))return json(res,400,{error:'Enter the code from your email.'});
 const r=await auth('verify',{email,token,type:'email'});const u=r.data?.user;
 if(!r.ok||typeof r.data?.access_token!=='string'||!authorized(u)||u.email.toLowerCase()!==email||!Number.isFinite(r.data.expires_in)||r.data.expires_in<=0)return json(res,401,{error:'Code invalid or expired. Request a new code.'});
 res.setHeader('Set-Cookie',sessionCookie(r.data.access_token,Math.min(r.data.expires_in,3600)));return json(res,200,{ok:true});
 }catch{return json(res,503,{error:'Sign-in is temporarily unavailable. Please try again.'});}
}
if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD, POST');return json(res,405,{error:'Method not allowed.'});}
let user=null;const match=String(req.headers.cookie||'').split(';').map(part=>part.trim()).find(part=>part.startsWith(cookieName+'='));
if(ready&&match&&match.length<12000){try{const r=await auth('user',null,decodeURIComponent(match.slice(cookieName.length+1)));if(r.ok&&authorized(r.data))user=r.data;}catch{}}
if(pathname.startsWith('/auth/'))return json(res,404,{error:'Not found.'});
if(!user&&pathname!=='/'&&!pathname.endsWith('.html'))return json(res,401,{error:'Sign in to access academy resources.'});
if(!user){res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");res.statusCode=200;return res.end(req.method==='HEAD'?'':page(ready));}
if(pathname.includes('\\')||pathname.split('/').some(p=>p.startsWith('.')))return json(res,404,{error:'Not found.'});
const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))return json(res,404,{error:'Not found.'});
try{let data=await fs.readFile(file);const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf'};res.setHeader('Content-Type',types[ext]||'application/octet-stream');if(ext==='.html'){data=data.toString().replace('</body>',`<footer><a href="https://ergovn-pm-system.vercel.app/#projects">Ergovn PM</a> · <a href="https://ergovn-po-system.vercel.app/team/workspace">Ergo POs System</a> · <button onclick="fetch('/auth/logout',{method:'POST'}).then(response=>{if(response.ok)location.reload()})">Sign out</button></footer></body>`);}return res.end(req.method==='HEAD'?'':data);}catch{return json(res,404,{error:'Not found.'});}
}
module.exports=handler;
module.exports.allowed=allowed;
module.exports.page=page;
