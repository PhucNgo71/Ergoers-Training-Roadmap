const assert=require('node:assert/strict');
const gate=require('./api/access');
const host='academy.test',origin='https://'+host,email='member@ergovn.com';
process.env.SUPABASE_URL='https://dlfgepzuxmkjkjwyrrsp.supabase.co';
process.env.SUPABASE_PUBLISHABLE_KEY='test-publishable';
const member={id:'user-1',email,email_confirmed_at:'2026-11-04'};
global.fetch=async(url,options)=>{
 assert.ok(url.startsWith(process.env.SUPABASE_URL+'/auth/v1/'));
 if(url.endsWith('/otp')){assert.deepEqual(JSON.parse(options.body),{email,create_user:false});return Response.json({});}
 if(url.endsWith('/verify')){
  assert.equal(JSON.parse(options.body).type,'email');
  return JSON.parse(options.body).token==='123456'?Response.json({user:member,access_token:'fixture-token',expires_in:3600}):Response.json({},{status:400});
 }
 return options.headers.Authorization==='Bearer fixture-token'?Response.json(member):Response.json({},{status:401});
};
async function request(url,{method='GET',body,cookie,requestOrigin=origin}={}){
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(v){this.body=String(v||'');}};
 await gate({url,method,headers:{host,origin:requestOrigin,cookie},body},res);
 return res;
}
(async()=>{
 const signedOut=await request('/#progress');assert.equal(signedOut.statusCode,200);assert.match(signedOut.body,/same Ergo account/);
 assert.equal((await request('/product-content.js')).statusCode,401);
 assert.equal((await request('/auth/send',{method:'POST',body:{email},requestOrigin:'https://other.test'})).statusCode,403);
 assert.equal((await request('/auth/send',{method:'POST',body:{email}})).statusCode,200);
 assert.equal((await request('/auth/verify',{method:'POST',body:{email,token:'000000'}})).statusCode,401);
 const login=await request('/auth/verify',{method:'POST',body:{email,token:'123456'}});assert.equal(login.statusCode,200);
 assert.match(login.headers['Set-Cookie'],/^__Host-ergo_academy_session=fixture-token; Path=\/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600$/);
 const cookie=login.headers['Set-Cookie'].split(';')[0];
 assert.equal((await request('/product-content.js',{cookie})).statusCode,undefined);
 assert.equal((await request('/product-content.js',{cookie:cookie.replace('fixture-token','forged')})).statusCode,401);
 assert.match((await request('/auth/logout',{method:'POST',cookie})).headers['Set-Cookie'],/Max-Age=0$/);
 console.log('PASS: shared Ergo OTP, verified sessions, protected academy assets, cross-origin rejection and sign-out.');
})().catch(error=>{console.error(error);process.exitCode=1;});
