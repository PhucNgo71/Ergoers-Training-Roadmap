const crypto = require('node:crypto');
const {promisify} = require('node:util');
const scrypt = promisify(crypto.scrypt);
const domainAllowed = email => /^[^\s@]+@(ergovn\.com|tfw\.space)$/.test(email);
function configuration() {
  try {
    const c=JSON.parse(process.env.COMPANY_ACCESS_CONFIG||'null');
    if(c?.version!==1||!/^([0-9a-f]{64})$/.test(c.signingKey)||!Array.isArray(c.records)||c.records.length>1000)return null;
    const emails=new Set();
    for(const r of c.records){if(typeof r.email!=='string'||!domainAllowed(r.email)||emails.has(r.email)||typeof r.name!=='string'||!r.name.trim()||!/^([0-9a-f]{32})$/.test(r.salt)||!/^([0-9a-f]{64})$/.test(r.hash)||!/^([0-9a-f]{32})$/.test(r.id)||!Number.isFinite(Date.parse(r.expiresAt)))return null;emails.add(r.email);}
    return c;
  }catch{return null;}
}
function live(record,now=Date.now()){return !!record&&!record.revoked&&Date.parse(record.expiresAt)>now;}
async function verify(c,email,code){
  email=String(email||'').trim().toLowerCase();code=String(code||'').replace(/[-\s]/g,'');
  if(email.length>254||!domainAllowed(email)||!code||code.length>80)return null;
  const record=c.records.find(r=>r.email===email);
  const hash=await scrypt(code,record?.salt||'0'.repeat(32),32);
  const correct=crypto.timingSafeEqual(hash,Buffer.from(record?.hash||'0'.repeat(64),'hex'));
  return correct&&live(record)?record:null;
}
function signature(c,value){return crypto.createHmac('sha256',Buffer.from(c.signingKey,'hex')).update(value).digest('base64url');}
function issue(c,record,now=Date.now()){
  const data=Buffer.from(JSON.stringify({email:record.email,id:record.id,iat:Math.floor(now/1000),exp:Math.floor(Math.min(now+3600000,Date.parse(record.expiresAt))/1000)})).toString('base64url');
  return data+'.'+signature(c,data);
}
function session(c,token,now=Date.now()){
  try{
    if(typeof token!=='string'||token.length>2048)return null;
    const parts=token.split('.');if(parts.length!==2)return null;
    const expected=Buffer.from(signature(c,parts[0])),actual=Buffer.from(parts[1]);
    if(actual.length!==expected.length||!crypto.timingSafeEqual(expected,actual))return null;
    const d=JSON.parse(Buffer.from(parts[0],'base64url').toString());
    if(!Number.isInteger(d.iat)||!Number.isInteger(d.exp)||d.exp*1000<=now||d.iat*1000>now||d.exp-d.iat>3600)return null;
    const r=c.records.find(r=>r.email===d.email&&r.id===d.id);
    return live(r,now)?{email:r.email,name:r.name,id:r.id}:null;
  }catch{return null;}
}
module.exports={configuration,verify,issue,session};
