const assert=require('node:assert/strict'),crypto=require('node:crypto'),gate=require('./api/access'),company=require('./api/company-access');
async function request(url,method='GET',body=null,cookie='',origin='https://academy.test'){const res={headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.body=String(v||'')}};await gate({url,method,body,headers:{host:'academy.test',origin,cookie}},res);return res;}
(async()=>{
delete process.env.COMPANY_ACCESS_CONFIG;
for(const url of ['/','/product-content.js','/costing.html','/web/index.html','/api/company-access.js']){const r=await request(url);assert.match(r.body,/Company-code access is awaiting activation/);assert.ok(!r.body.includes('const modules='));assert.match(r.headers['Cache-Control'],/no-store/);}
assert.equal((await request('/auth/company-code','POST',{email:'a@ergovn.com',code:'test'})).statusCode,503);
const code=crypto.randomBytes(15).toString('hex'),salt=crypto.randomBytes(16).toString('hex');const record={id:crypto.randomBytes(16).toString('hex'),email:'a@ergovn.com',name:'Test User',salt,hash:crypto.scryptSync(code,salt,32).toString('hex'),expiresAt:new Date(Date.now()+86400000).toISOString()};const c={version:1,signingKey:crypto.randomBytes(32).toString('hex'),records:[record]};process.env.COMPANY_ACCESS_CONFIG=JSON.stringify(c);assert.ok(company.configuration());
assert.equal(await company.verify(c,'a@gmail.com',code),null);assert.equal(await company.verify(c,'b@ergovn.com',code),null);assert.equal(await company.verify(c,'a@ergovn.com','wrong'),null);assert.equal((await company.verify(c,'A@ERGOVN.COM',code)).email,record.email);
const verified=await request('/auth/company-code','POST',{email:record.email,code});assert.equal(verified.statusCode,200);assert.match(verified.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Strict/);const cookie=verified.headers['Set-Cookie'].split(';')[0];assert.match((await request('/','GET',null,cookie)).body,/const modules=/);assert.match((await request('/product-content.js','GET',null,cookie)).headers['Content-Type'],/javascript/);
const token=company.issue(c,record);assert.equal(company.session(c,token).email,record.email);assert.equal(company.session(c,token+'x'),null);assert.equal(company.session(c,token,Date.now()+3601000),null);
assert.equal((await request('/auth/company-code','POST',{email:record.email,code},'','https://evil.test')).statusCode,403);
c.records[0].revoked=true;assert.equal(company.session(c,token),null);assert.equal(await company.verify(c,record.email,code),null);process.env.COMPANY_ACCESS_CONFIG=JSON.stringify(c);assert.ok(!(await request('/','GET',null,cookie)).body.includes('const modules='));
c.records[0].revoked=false;c.records[0].expiresAt=new Date(Date.now()-1).toISOString();assert.equal(await company.verify(c,record.email,code),null);assert.equal(company.session(c,token),null);
c.signingKey='short';process.env.COMPANY_ACCESS_CONFIG=JSON.stringify(c);assert.equal(company.configuration(),null);
assert.equal((await request('/auth/logout','POST')).statusCode,200);assert.equal((await request('/auth/send','POST')).statusCode,404);
console.log('PASSED: company email/code matching, invalid/wrong-user codes, revocation, expiry, cookie signatures, forged/expired sessions, CSRF, locked assets and disabled email delivery.');
})().catch(e=>{console.error(e);process.exitCode=1});
