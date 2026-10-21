const assert=require('node:assert/strict'),gate=require('./api/access'),auth=require('./api/password-access');
process.env.SUPABASE_URL='https://dlfgepzuxmkjkjwyrrsp.supabase.co';process.env.SUPABASE_PUBLISHABLE_KEY='test';
const token='h.'+Buffer.from(JSON.stringify({sub:'test',amr:[{method:'password'}]})).toString('base64url')+'.s';
const person={id:'test',email:'learner@ergovn.com',email_confirmed_at:'2026',app_metadata:{academy_access:true}};
async function req(url,method='GET',body=null,cookie='',origin='https://academy.test'){const r={headers:{},setHeader(k,v){this.headers[k]=v},end(b){this.body=String(b||'')}};await gate({url,method,body,headers:{host:'academy.test',origin,cookie}},r);return r;}
(async()=>{global.fetch=async u=>({ok:true,status:200,json:async()=>u.includes('/token?')?{access_token:token,expires_in:3600}:person});
for(const p of ['/','/costing.html','/product-content.js'])assert.match((await req(p)).body,/academy password/);
assert.equal((await req('/auth/login','POST',{email:person.email,password:'test'},'','https://evil.test')).statusCode,403);
assert.equal((await req('/auth/login','POST',{email:'x@ergovn.com.evil',password:'test'})).statusCode,401);
const signed=await req('/auth/login','POST',{email:person.email,password:'test'});assert.equal(signed.statusCode,200);assert.match(signed.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Strict/);
const cookie=signed.headers['Set-Cookie'].split(';')[0];assert.match((await req('/','GET',null,cookie)).body,/const modules=/);
person.app_metadata.academy_access=false;assert.equal((await req('/auth/login','POST',{email:person.email,password:'test'})).statusCode,401);assert.match((await req('/','GET',null,cookie)).body,/academy password/);person.app_metadata.academy_access=true;
person.email='learner@tfw.space';assert.equal(auth.authorized(person,token),true);person.email='x@gmail.com';assert.equal(auth.authorized(person,token),false);person.email='learner@ergovn.com';assert.equal(auth.authorized(person,'bad'),false);
const oauth='h.'+Buffer.from(JSON.stringify({sub:'test',amr:[{method:'oauth'}]})).toString('base64url')+'.s';assert.equal(auth.authorized(person,oauth),false);
global.fetch=async()=>({ok:false,status:401,json:async()=>({})});assert.match((await req('/','GET',null,'__Host-ergo_access=forged')).body,/academy password/);
assert.equal((await req('/auth/microsoft')).statusCode,404);assert.equal((await req('/auth/send','POST')).statusCode,404);assert.match((await req('/auth/logout','POST')).headers['Set-Cookie'],/Max-Age=0/);
console.log('PASS: password sessions, administrator approval, both domains, revocation, token and OAuth rejection, CSRF, protected assets, logout.');
})().catch(e=>{console.error(e);process.exitCode=1});
