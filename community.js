(() => {
  "use strict";
  const config = window.WEBZONE_SUPABASE_CONFIG || {};
  const lib = window.supabase;
  const enabled = Boolean(config.url && config.anonKey && lib?.createClient);
  const api = { enabled, client: null, sendChat(nickname,message){ return send("chat",{nickname,message}); }, sendGuestbook(entry){ return send("guestbook",entry); } };
  window.WEBZONE_COMMUNITY = api;
  const $ = s => document.querySelector(s);
  const seenMessages = new Set(), seenGuests = new Set();
  const fmt = v => { const d = new Date(v); return Number.isNaN(d.getTime()) ? "agora" : d.toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}); };
  function appendMessage(row) {
    if (!row?.id || seenMessages.has(row.id)) return;
    seenMessages.add(row.id);
    for (const log of [$("#window-room-log"),$("#room-log")].filter(Boolean)) {
      const p=document.createElement("p"), b=document.createElement("b");
      b.textContent=(row.nickname||"visitante")+": "; p.append(b,document.createTextNode(row.message||"")); p.title=fmt(row.created_at);
      log.append(p); while(log.children.length>80) log.firstElementChild?.remove(); log.scrollTop=log.scrollHeight;
    }
  }
  function renderGuestbook(rows) {
    const box=$("#guestbook-entries"); if(!box)return; box.replaceChildren();
    rows.slice(0,6).forEach(row=>{
      if(row.id)seenGuests.add(row.id);
      const div=document.createElement("div");div.className="guest-entry";
      const name=document.createElement("b");name.textContent=row.name+" escreveu:";
      const p=document.createElement("p");p.textContent=row.message;
      const date=document.createElement("small");date.textContent=fmt(row.created_at);div.append(name,p,date);
      if(row.homepage_url){const link=document.createElement("a");link.href=row.homepage_url;link.target="_blank";link.rel="noopener noreferrer";link.textContent=row.homepage_url;link.className="guest-homepage";div.append(link);}
      box.append(div);
    });
  }
  async function send(type,payload) {
    if(!enabled||!api.client)return false;
    const status=$(type==="chat"?"#community-chat-status":"#community-guestbook-status");
    if(status)status.textContent="Enviando para a comunidade…";
    try {
      const {data,error}=await api.client.functions.invoke("community-post",{body:{type,...payload}});
      if(error)throw error;if(!data?.ok)throw new Error(data?.error||"Publicação recusada.");
      if(status)status.textContent=data.status==="pending"?"Recebido e aguardando moderação.":(type==="chat"?"Mensagem enviada à sala compartilhada.":"Assinatura publicada no livro compartilhado.");
      if(type==="chat"&&data.record)appendMessage(data.record);
      if(type==="guestbook"){ $("#guestbook-form")?.reset(); if(data.status==="approved")await loadGuestbook(); }
      return true;
    } catch(error) { console.error("WEB ZONE community:",error);if(status)status.textContent="Falha ao enviar. Confira a conexão e tente novamente.";return false; }
  }
  async function loadChat() {
    const {data,error}=await api.client.from("community_messages").select("id,nickname,message,created_at,moderation_status").eq("moderation_status","approved").order("created_at",{ascending:true}).limit(60);
    if(error)throw error;(data||[]).forEach(appendMessage);
  }
  async function loadGuestbook() {
    const {data,error}=await api.client.from("community_guestbook").select("id,name,homepage_url,message,created_at,moderation_status").eq("moderation_status","approved").order("created_at",{ascending:false}).limit(6);
    if(error)throw error;renderGuestbook(data||[]);
  }
  function presence(count){const label="● "+count+" visitante"+(count===1?"":"s")+" online";["#community-presence","#community-presence-window"].forEach(s=>{const n=$(s);if(n)n.textContent=label;});}
  async function init() {
    if(!enabled){console.info("WEB ZONE: backend ainda não configurado; mantendo modo local.");return;}
    api.client=lib.createClient(config.url,config.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    try {
      await Promise.all([loadChat(),loadGuestbook()]);
      const key=(window.crypto?.randomUUID?.()||String(Math.random()));
      const channel=api.client.channel("webzone-community",{config:{presence:{key}}});
      channel.on("postgres_changes",{event:"INSERT",schema:"public",table:"community_messages",filter:"moderation_status=eq.approved"},p=>appendMessage(p.new));
      channel.on("postgres_changes",{event:"INSERT",schema:"public",table:"community_guestbook",filter:"moderation_status=eq.approved"},async p=>{if(p.new?.id&&!seenGuests.has(p.new.id))await loadGuestbook();});
      channel.on("presence",{event:"sync"},()=>presence(Object.keys(channel.presenceState()).length));
      channel.subscribe(async state=>{if(state==="SUBSCRIBED")await channel.track({nickname:($("#window-room-nick")?.value||"visitante").slice(0,20),online_at:new Date().toISOString()});});
      $("#window-room-nick")?.addEventListener("change",()=>channel.track({nickname:($("#window-room-nick").value.trim()||"visitante").slice(0,20),online_at:new Date().toISOString()}));
      if($("#community-chat-status"))$("#community-chat-status").textContent="Conectado à sala compartilhada. As mensagens são públicas.";
      if($("#community-guestbook-status"))$("#community-guestbook-status").textContent="Livro de visitas compartilhado entre visitantes.";
    } catch(error) { console.error("WEB ZONE: falha ao iniciar comunidade",error);if($("#community-chat-status"))$("#community-chat-status").textContent="Não foi possível conectar ao chat. O restante do site continua disponível."; }
  }
  init();
})();
