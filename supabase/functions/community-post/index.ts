import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin":"https://humbertomennella.github.io", "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods":"POST, OPTIONS", "Vary":"Origin" };
const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json; charset=utf-8"}});
const clean=(v:unknown,n:number)=>typeof v==="string"?v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"").trim().slice(0,n):"";
const suspicious=(s:string)=>((s.match(/https?:\/\//gi)||[]).length>2)||/(.)\1{11,}/i.test(s)||/\b(viagra|crypto giveaway|double your money|clique aqui para ganhar|ganhe dinheiro fácil)\b/i.test(s);
async function digest(v:string){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,"0")).join("");}
Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return respond({ok:false,error:"Método não permitido."},405);
  const origin=req.headers.get("origin")||"";
  if(origin!=="https://humbertomennella.github.io"&&!origin.startsWith("http://localhost:"))return respond({ok:false,error:"Origem não autorizada."},403);
  const url=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),salt=Deno.env.get("RATE_LIMIT_SALT");
  if(!url||!service||!salt)return respond({ok:false,error:"Backend incompleto."},503);
  let body:Record<string,unknown>;try{body=await req.json();}catch{return respond({ok:false,error:"JSON inválido."},400);}
  const type=body.type==="chat"||body.type==="guestbook"?body.type:null;if(!type)return respond({ok:false,error:"Tipo inválido."},400);
  const name=clean(type==="chat"?body.nickname:body.name,type==="chat"?20:30),message=clean(body.message,type==="chat"?180:300),homepage=clean(body.url,100);
  if(!name||!message)return respond({ok:false,error:"Preencha nick/nome e mensagem."},400);
  if(type==="guestbook"&&homepage){try{const u=new URL(homepage);if(!["http:","https:"].includes(u.protocol))throw new Error();}catch{return respond({ok:false,error:"Homepage inválida. Use HTTP ou HTTPS."},400);}}
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown",fingerprint=await digest(salt+":"+ip);
  const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const now=new Date(),period=type==="chat"?60000:300000,max=type==="chat"?6:3;
  const {data:bucket,error:readErr}=await db.from("community_rate_limits").select("*").eq("fingerprint",fingerprint).maybeSingle();
  if(readErr)return respond({ok:false,error:"Falha na proteção anti-spam."},500);
  const reset=!bucket||now.getTime()-new Date(bucket.window_started_at).getTime()>=period,hits=reset?1:bucket.hits+1;
  if(hits>max)return respond({ok:false,error:"Muitas publicações em sequência. Aguarde um pouco."},429);
  const {error:limitErr}=await db.from("community_rate_limits").upsert({fingerprint,window_started_at:reset?now.toISOString():bucket.window_started_at,hits},{onConflict:"fingerprint"});
  if(limitErr)return respond({ok:false,error:"Falha na proteção anti-spam."},500);
  const moderation_status=suspicious(message)?"pending":"approved",table=type==="chat"?"community_messages":"community_guestbook";
  const record=type==="chat"?{nickname:name,message,moderation_status}:{name,homepage_url:homepage||null,message,moderation_status};
  const {data,error}=await db.from(table).insert(record).select("*").single();
  if(error)return respond({ok:false,error:"Não foi possível publicar agora."},500);
  return respond({ok:true,status:moderation_status,record:data});
});
