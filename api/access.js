// Academy access is temporarily public at the owner's request.
const fs=require('node:fs/promises'),path=require('node:path');
const root=path.resolve(__dirname,'../web');
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));}
async function handler(req,res){
res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');
res.setHeader('Set-Cookie','__Host-ergo_access=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');return json(res,405,{error:'Method not allowed.'});}
let pathname;try{pathname=decodeURIComponent(new URL(req.url,'https://academy.invalid').pathname);}catch{return json(res,400,{error:'Invalid path.'});}
if(pathname.startsWith('/auth/'))return json(res,404,{error:'Sign-in is currently disabled.'});
if(pathname.includes('\\')||pathname.split('/').some(p=>p.startsWith('.')))return json(res,404,{error:'Not found.'});
const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))return json(res,404,{error:'Not found.'});
try{let data=await fs.readFile(file);const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf'};res.setHeader('Content-Type',types[ext]||'application/octet-stream');return res.end(req.method==='HEAD'?'':data);}catch{return json(res,404,{error:'Not found.'});}
}
module.exports=handler;
