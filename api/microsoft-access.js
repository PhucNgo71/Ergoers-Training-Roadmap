const crypto=require('node:crypto');
const SITE='https://ergoers-training-roadmap.vercel.app';
const TENANT='03de5145-b616-469e-81a5-abd072f37b2c';
const COMPANY_ISSUER='https://login.microsoftonline.com/'+TENANT+'/v2.0';
const allowed=email=>typeof email==='string'&&/^[^\s@]+@(ergovn\.com|tfw\.space)$/i.test(email);
function ready(){return process.env.MICROSOFT_AUTH_READY==='true'&&!!process.env.SUPABASE_PUBLISHABLE_KEY&&process.env.SUPABASE_URL==='https://dlfgepzuxmkjkjwyrrsp.supabase.co';}
function cookie(req,name){try{return decodeURIComponent(String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='))?.slice(name.length+1)||'');}catch{return '';}}
function pkce(){const verifier=crypto.randomBytes(32).toString('base64url');return {verifier,state:crypto.randomBytes(32).toString('base64url'),at:Date.now()};}
function start(res){
const flow=pkce(),url=new URL(process.env.SUPABASE_URL+'/auth/v1/authorize');
url.searchParams.set('provider','azure');url.searchParams.set('scopes','email');url.searchParams.set('prompt','select_account');
url.searchParams.set('redirect_to',SITE+'/auth/callback?request='+flow.state);
url.searchParams.set('code_challenge',crypto.createHash('sha256').update(flow.verifier).digest('base64url'));url.searchParams.set('code_challenge_method','s256');
res.setHeader('Set-Cookie','__Host-ergo_pkce='+encodeURIComponent(JSON.stringify(flow))+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600');
res.statusCode=302;res.setHeader('Location',url.href);res.end();
}
async function service(endpoint,body,token){const response=await fetch(process.env.SUPABASE_URL+'/auth/v1/'+endpoint,{method:body?'POST':'GET',headers:{apikey:process.env.SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000)});let data=null;try{data=await response.json();}catch{}return {ok:response.ok,status:response.status,data};}
function authorized(user,token){
try{
 if(!user?.email_confirmed_at||!allowed(user.email)||!user.id)return false;
 const identity=user.identities?.find(i=>i.provider==='azure'&&i.identity_data?.email_verified===true&&String(i.identity_data.email).toLowerCase()===user.email.toLowerCase());
 if(!identity)return false;
 if(identity.identity_data.iss&&identity.identity_data.iss!==COMPANY_ISSUER)return false;
 // getUser validates the token remotely BEFORE these claims are consulted.
 const claims=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString());
 return claims.sub===user.id&&Array.isArray(claims.amr)&&claims.amr.some(a=>a.method==='oauth');
}catch{return false;}
}
async function user(token){if(!token||token.length>12000)return null;const r=await service('user',null,token);return r.ok&&authorized(r.data,token)?r.data:null;}
async function callback(req,res,url){
const clear='__Host-ergo_pkce=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
res.setHeader('Set-Cookie',clear);
try{
 const flow=JSON.parse(cookie(req,'__Host-ergo_pkce'));
 if(!flow||!/^[A-Za-z0-9_-]{43}$/.test(flow.verifier)||!/^[A-Za-z0-9_-]{43}$/.test(flow.state)||flow.state!==url.searchParams.get('request')||!Number.isFinite(flow.at)||Date.now()-flow.at>600000||Date.now()<flow.at||!url.searchParams.get('code')||url.searchParams.get('error'))throw Error('Invalid sign-in request');
 const result=await service('token?grant_type=pkce',{auth_code:url.searchParams.get('code'),code_verifier:flow.verifier});
 if(!result.ok||!result.data?.access_token)throw Error('Sign-in failed');
 const identity=await user(result.data.access_token);if(!identity)throw Error('Company account required');
 res.setHeader('Set-Cookie',[clear,'__Host-ergo_access='+encodeURIComponent(result.data.access_token)+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+Math.min(Number(result.data.expires_in)||3600,3600)]);
 res.statusCode=303;res.setHeader('Location',SITE+'/');res.end();return;
}catch{res.statusCode=303;res.setHeader('Location',SITE+'/?signin=failed');res.end();}
}
module.exports={SITE,TENANT,ready,cookie,start,callback,user,authorized,pkce};
