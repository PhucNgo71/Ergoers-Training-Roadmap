// Run locally. Never upload the generated files or codes to GitHub.
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto'),{promisify}=require('node:util');
(async()=>{
const [emailArg,name,...extra]=process.argv.slice(2),email=String(emailArg||'').trim().toLowerCase();
if(!/^[^\s@]+@(ergovn\.com|tfw\.space)$/.test(email)||!name||extra.length)throw Error('Usage: node issue-company-code.cjs employee@ergovn.com "Full Name"');
const dir=path.join(__dirname,'private-access');await fs.mkdir(dir,{recursive:true});const configPath=path.join(dir,'company-access.json');
let config;try{config=JSON.parse(await fs.readFile(configPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;config={version:1,signingKey:crypto.randomBytes(32).toString('hex'),records:[]};}
if(config.records.some(r=>r.email===email))throw Error('An entry already exists. Revoke or replace deliberately; this tool never overwrites existing codes.');
const code=crypto.randomBytes(15).toString('hex'),salt=crypto.randomBytes(16).toString('hex');
const record={id:crypto.randomBytes(16).toString('hex'),email,name:name.trim(),salt,hash:(await promisify(crypto.scrypt)(code,salt,32)).toString('hex'),expiresAt:new Date(Date.now()+90*86400000).toISOString(),revoked:false};config.records.push(record);
await fs.writeFile(configPath,JSON.stringify(config),{mode:0o600});
await fs.writeFile(path.join(dir,email.replace(/[^a-z0-9]/g,'_')+'-code.txt'),`Ergo Academy — private employee access\nName: ${record.name}\nEmail: ${email}\nCompany code (case-sensitive): ${code.match(/.{1,5}/g).join('-')}\nExpires: ${record.expiresAt}\nSign in: https://ergoers-training-roadmap.vercel.app/\nDo not forward this code. A company code proves possession, not ownership of an email address.\n`,{mode:0o600,flag:'wx'});
console.log('Created private code and server configuration in private-access/. No code printed.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
