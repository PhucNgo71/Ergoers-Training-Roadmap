const assert=require('node:assert/strict'),gate=require('./api/access');
async function request(url,method='GET',body=null,cookie=''){const headers={host:'academy.test',origin:'https://academy.test',cookie};const res={headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.body=String(v||'')}};await gate({url,method,body,headers},res);return res;}
(async()=>{
delete process.env.SUPABASE_URL;delete process.env.SUPABASE_PUBLISHABLE_KEY;
for(const url of ['/','/index.html','/product-content.js','/costing.html','/web/index.html','/api/access.js']){const r=await request(url);assert.match(r.body,/Email sign-in is being connected/);assert.ok(!r.body.includes('const modules='));assert.match(r.headers['Cache-Control'],/no-store/);}
for(const e of ['a@ergovn.com','a@tfw.space','A@ERGOVN.COM'])assert.equal(gate.allowed(e),true);
for(const e of ['a@gmail.com','a@evilergovn.com','a@ergovn.com.evil','a@sub.tfw.space','a@@tfw.space'])assert.equal(gate.allowed(e),false);
assert.equal((await request('/auth/send','POST',{email:'a@ergovn.com'})).statusCode,503);
process.env.SUPABASE_URL='https://project.supabase.co';process.env.SUPABASE_PUBLISHABLE_KEY='test-only';
let calls=[];global.fetch=async(url,opts)=>{calls.push({url,opts});return {ok:true,status:200,json:async()=>url.endsWith('/user')?{email:'a@ergovn.com',email_confirmed_at:'2026-01-01'}:{access_token:'test-token',expires_in:3600,user:{email:'a@ergovn.com',email_confirmed_at:'2026-01-01'}}};};
assert.equal((await request('/auth/send','POST',{email:'a@gmail.com'})).statusCode,403);assert.equal(calls.length,0);
assert.equal((await request('/auth/send','POST',{email:'a@ergovn.com'})).statusCode,200);
const verified=await request('/auth/verify','POST',{email:'a@ergovn.com',token:'123456'});assert.equal(verified.statusCode,200);assert.match(verified.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Strict/);
const content=await request('/','GET',null,'__Host-ergo_access=test-token');assert.match(content.body,/const modules=/);assert.match(content.body,/Sign out/);
global.fetch=async()=>({ok:true,json:async()=>({email:'a@gmail.com',email_confirmed_at:'2026-01-01'})});assert.match((await request('/product-content.js','GET',null,'__Host-ergo_access=test-token')).body,/Your next step starts here/);
global.fetch=async()=>{throw Error('network down')};assert.match((await request('/','GET',null,'__Host-ergo_access=forged')).body,/Your next step starts here/);
const config=require('./vercel.json');assert.equal(config.builds.length,1);assert.equal(config.routes[0].src,'/(.*)');assert.equal(config.routes[0].dest,'/api/access.js');
console.log('PASSED: closed without configuration, exact domains, server verification, protected assets, cookie flags and upstream failure denial. Real email delivery pending setup.');
})().catch(e=>{console.error(e);process.exitCode=1});
