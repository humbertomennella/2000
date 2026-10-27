(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storage = {
    get(key, fallback) { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be disabled */ } }
  };
  const toast = (message) => {
    const node = $("#toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 2600);
  };

  $("#visitor-date").textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date()).toUpperCase();
  const count = storage.get("webzone-visits", 184) + 1;
  storage.set("webzone-visits", count);
  $("#visitor-count").textContent = String(count).padStart(6, "0");

  const events = [
    {year:1991, category:"tech", region:"world", title:"A World Wide Web fica disponível ao público", text:"A tecnologia criada no CERN começa a sair do ambiente acadêmico e abre caminho para a web que conhecemos.", source:"https://home.cern/science/computing/birth-web"},
    {year:1993, category:"tech", region:"world", title:"Mosaic ajuda a popularizar a web", text:"O navegador gráfico Mosaic facilita a navegação com texto e imagens e inspira a primeira onda de navegadores populares.", source:"https://www.ncsa.illinois.edu/research/project-highlights/ncsa-mosaic/"},
    {year:1994, category:"br", region:"br", title:"O Plano Real muda a economia brasileira", text:"A nova moeda entra em circulação e ajuda a controlar a hiperinflação. Um marco importante da história recente do Brasil.", source:"https://www.bcb.gov.br/controleinflacao/planoreal"},
    {year:1995, category:"tech", region:"world", title:"Windows 95 chega às lojas", text:"Menu Iniciar, barra de tarefas e uma campanha gigantesca transformam o lançamento em um evento cultural e tecnológico.", source:"https://www.microsoft.com/en-us/History"},
    {year:1996, category:"pop", region:"world", title:"Tamagotchi vira febre mundial", text:"O bichinho virtual transforma a obrigação de alimentar, limpar e cuidar de pixels em uma rotina de recreio.", source:"https://www.bandai.com/"},
    {year:1997, category:"pop", region:"world", title:"Titanic domina o cinema", text:"O filme de James Cameron vira fenômeno global e sua trilha sonora invade rádios, lojas e programas de TV.", source:"https://www.oscars.org/oscars/ceremonies/1998"},
    {year:1998, category:"tech", region:"world", title:"Google é fundado", text:"Larry Page e Sergey Brin formalizam a empresa que ajudaria a reorganizar a maneira como encontramos informação na web.", source:"https://about.google/our-story/"},
    {year:1999, category:"tech", region:"world", title:"O bug do milênio assusta o planeta", text:"O uso de dois dígitos para representar anos levanta preocupações sobre sistemas que poderiam interpretar 2000 como 1900. Organizações passam anos se preparando.", source:"https://www.nist.gov/"},
    {year:2000, category:"world", region:"world", title:"A bolha pontocom começa a estourar", text:"Depois da euforia com empresas de internet, o mercado de tecnologia sofre uma queda que muda o rumo de muitas startups.", source:"https://www.federalreservehistory.org/essays/dot-com-bubble"},
    {year:2001, category:"world", region:"world", title:"Ataques de 11 de setembro mudam a política global", text:"Os ataques nos Estados Unidos provocam enormes perdas humanas e transformam a política internacional e a segurança aérea.", source:"https://www.911memorial.org/learn/resources/911-primer"},
    {year:2001, category:"tech", region:"world", title:"Wikipedia começa a funcionar", text:"A enciclopédia colaborativa é lançada e passa a mostrar que milhares de pessoas poderiam construir uma referência compartilhada.", source:"https://en.wikipedia.org/wiki/Wikipedia"},
    {year:2002, category:"br", region:"br", title:"Brasil conquista o pentacampeonato", text:"A seleção brasileira vence a Copa do Mundo no Japão e na Coreia do Sul, com Ronaldo como artilheiro do torneio.", source:"https://www.fifa.com/tournaments/mens/worldcup/2002korea-japan"},
    {year:2004, category:"tech", region:"world", title:"Facebook nasce em Harvard", text:"A rede começa como um serviço universitário e depois se expande para outras instituições e para o público em geral.", source:"https://about.fb.com/company-info/"},
    {year:2004, category:"br", region:"br", title:"Orkut começa sua ascensão no Brasil", text:"A rede social vira ponto de encontro digital: comunidades, scraps, depoimentos e perfis cheios de personalidade.", source:"https://about.google/"},
    {year:2005, category:"tech", region:"world", title:"YouTube é lançado", text:"Compartilhar vídeo pela web fica muito mais simples e abre espaço para uma nova cultura de criadores e vídeos virais.", source:"https://blog.youtube/"},
    {year:2007, category:"tech", region:"world", title:"O iPhone é apresentado", text:"A combinação de telefone, iPod e internet em uma tela multitoque acelera a transformação dos celulares em computadores de bolso.", source:"https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/"},
    {year:2008, category:"world", region:"world", title:"A crise financeira atinge o mundo", text:"A crise global provoca recessão, desemprego e mudanças profundas no debate sobre bancos e regulação financeira.", source:"https://www.federalreservehistory.org/essays/great-recession-of-200709"},
    {year:2009, category:"pop", region:"world", title:"O Twitter ganha força na cultura digital", text:"Mensagens curtas e atualizações em tempo real se tornam uma nova forma de acompanhar notícias e conversar publicamente.", source:"https://blog.x.com/"},
    {year:1998, category:"world", region:"world", title:"A Copa do Mundo chega à França", text:"A França conquista seu primeiro título mundial em casa, derrotando o Brasil na final.", source:"https://www.fifa.com/tournaments/mens/worldcup/1998france"},
    {year:1999, category:"world", region:"world", title:"O euro é lançado como moeda escritural", text:"Onze países adotam o euro para transações financeiras, preparando o caminho para notas e moedas em 2002.", source:"https://european-union.europa.eu/institutions-law-budget/euro/history-and-purpose-euro_en"},
    {year:2000, category:"pop", region:"world", title:"PlayStation 2 chega ao mercado", text:"O console da Sony vira um fenômeno de entretenimento doméstico e ajuda a consolidar o DVD nas salas de estar.", source:"https://www.playstation.com/"},
    {year:2001, category:"pop", region:"world", title:"Harry Potter chega aos cinemas", text:"A adaptação de A Pedra Filosofal inicia uma das franquias cinematográficas mais influentes da década.", source:"https://www.wizardingworld.com/"},
    {year:2003, category:"tech", region:"world", title:"MySpace nasce na era dos perfis personalizáveis", text:"A rede social ganha espaço com páginas customizadas, bandas independentes e perfis que pareciam projetos de HTML pessoal.", source:"https://www.britannica.com/topic/Myspace"},
    {year:2004, category:"pop", region:"world", title:"World of Warcraft abre seu mundo online", text:"O MMORPG da Blizzard transforma Azeroth em ponto de encontro para milhões de jogadores e marca a cultura gamer.", source:"https://worldofwarcraft.blizzard.com/"},
    {year:2004, category:"pop", region:"world", title:"Nintendo DS estreia no Japão", text:"A portátil de duas telas e tela sensível ao toque propõe novas formas de jogar fora da televisão.", source:"https://www.nintendo.com/"},
    {year:2006, category:"pop", region:"world", title:"Nintendo Wii populariza controles por movimento", text:"O console leva controles gestuais a salas de estar e amplia o público que se interessa por videogames.", source:"https://www.nintendo.com/"},
    {year:2007, category:"pop", region:"world", title:"BioShock e Portal viram referências dos games", text:"Do design narrativo à experimentação com puzzles, jogos de PC e console ampliam a conversa sobre videogame como linguagem.", source:"https://www.mobygames.com/"}
  ];
  const timeline = [
    [1990,"A web ainda é um projeto", "Tim Berners-Lee trabalha no sistema que viria a se tornar a World Wide Web."],
    [1991,"A web chega ao público", "A WWW começa a ser disponibilizada fora do CERN."],
    [1993,"Navegadores gráficos", "Mosaic ajuda a tornar a web mais visual e acessível."],
    [1994,"Brasil: Plano Real", "A nova moeda começa a circular e marca a economia brasileira."],
    [1995,"Windows 95", "Menu Iniciar, barra de tarefas e internet discada viram parte do cotidiano."],
    [1996,"Tamagotchi e Pokémon", "Bichinhos virtuais e jogos portáteis dominam mochilas e recreios."],
    [1997,"DVD e Titanic", "Novos formatos de entretenimento e um grande fenômeno de cinema."],
    [1998,"Google", "Uma nova forma de pesquisar a web começa a ganhar espaço."],
    [1999,"MSN Messenger e Y2K", "Mensagens instantâneas entram na rotina enquanto o mundo se prepara para a virada."],
    [2000,"Virada do milênio", "A internet comercial cresce, embora a bolha pontocom comece a perder força."],
    [2001,"Wikipedia e 11 de setembro", "Uma enciclopédia colaborativa nasce em um ano marcado por ataques e mudanças globais."],
    [2002,"Brasil penta", "A seleção conquista a Copa do Mundo e o país entra em festa."],
    [2003,"MySpace e lan houses", "Perfis personalizáveis, música e jogos online se tornam pontos de encontro."],
    [2004,"Facebook e Orkut", "Redes sociais começam a transformar amizades e comunidades online."],
    [2005,"YouTube", "Vídeos online passam a circular com uma facilidade inédita."],
    [2006,"Twitter ganha forma", "O microblog começa a se estabelecer como serviço de mensagens públicas."],
    [2007,"Smartphone moderno", "A apresentação do iPhone acelera a era da internet móvel."],
    [2008,"Crise global", "A crise financeira afeta economias e empregos no mundo inteiro."],
    [2009,"A web social amadurece", "Vídeos, redes sociais e smartphones começam a definir a próxima década."]
  ];
  const facts = [
    "O primeiro site da história continua acessível em sua forma preservada pelo CERN.",
    "Antes do Wi-Fi doméstico se popularizar, muita gente precisava disputar a linha telefônica para entrar na internet.",
    "No MSN, o status e a música do subnick funcionavam como pequenos outdoors emocionais.",
    "O Orkut foi lançado em 2004 e acabou tendo uma base especialmente grande no Brasil.",
    "O YouTube foi lançado em 2005, quando vídeo online ainda era bem mais trabalhoso do que hoje.",
    "O Windows 95 ajudou a popularizar o Menu Iniciar, que virou uma referência de interface.",
    "O bug do milênio era um problema real de software, mas os piores cenários temidos não se concretizaram em escala global.",
    "O primeiro iPhone foi apresentado em janeiro de 2007 e combinava telefone, música e internet."
  ];
  const categoryLabels = {tech:"Tecnologia",world:"Mundo",br:"Brasil",pop:"Cultura pop"};
  const newsGrid = $("#news-grid");
  function renderNews() {
    const category = $("#news-filter").value;
    const decade = $("#year-filter").value;
    const list = events.filter(e => (category === "all" || e.category === category || (category === "world" && e.region === "world")) && (decade === "all" || (decade === "90" ? e.year < 2000 : e.year >= 2000)));
    newsGrid.replaceChildren();
    list.forEach((event, index) => {
      const article = document.createElement("article");
      article.className = "news-card";
      const year = document.createElement("div");
      year.className = "news-year";
      year.textContent = event.year;
      const content = document.createElement("div");
      const label = document.createElement("div");
      label.className = "category";
      label.textContent = categoryLabels[event.category] || "História";
      const title = document.createElement("h3");
      title.textContent = event.title;
      const p = document.createElement("p");
      p.textContent = event.text;
      const link = document.createElement("a");
      link.href = event.source;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Consultar fonte ↗";
      link.className = "source-link";
      link.style.cssText = "font-size:11px;color:#00e";
      content.append(label, title, p, link);
      article.append(year, content);
      newsGrid.append(article);
    });
    if (!list.length) newsGrid.textContent = "Nenhum registro para esse filtro.";
  }
  $("#news-filter").addEventListener("change", renderNews);
  $("#year-filter").addEventListener("change", renderNews);
  renderNews();

  const timelineList = $("#timeline-list");
  function renderTimeline(decade = "all") {
    timelineList.replaceChildren();
    timeline.filter(([year]) => decade === "all" || (decade === "90" ? year < 2000 : year >= 2000)).forEach(([year, title, text]) => {
      const item = document.createElement("article");
      item.className = "timeline-item";
      const yr = document.createElement("div"); yr.className = "year"; yr.textContent = year;
      const h = document.createElement("h3"); h.textContent = title;
      const p = document.createElement("p"); p.textContent = text;
      item.append(yr, h, p); timelineList.append(item);
    });
  }
  renderTimeline();
  const museumExhibits=[
    {year:1996,era:"90",title:"Homepage pessoal",text:"Páginas feitas à mão, GIFs, contadores de visitas, listas de links e mensagens de boas-vindas.",source:"https://www.webdesignmuseum.org/exhibitions/web-design-in-the-90s",label:"Ver sites preservados"},
    {year:1998,era:"90",title:"Diretórios e buscadores",text:"Encontrar um site também era navegar por categorias, diretórios e recomendações de outras páginas.",source:"https://web.archive.org/",label:"Explorar capturas históricas"},
    {year:2001,era:"00",title:"Mensageiros instantâneos",text:"Listas de contatos, status personalizados, emoticons e notificações sonoras transformaram a conversa online.",source:"https://www.webdesignmuseum.org/",label:"Visitar o museu de design"},
    {year:2004,era:"00",title:"Perfis e comunidades",text:"Redes sociais, comunidades e páginas personalizáveis fizeram da identidade online um espaço de expressão.",source:"https://theoldwebproject.org/timeline",label:"Explorar a web pessoal"}
  ];
  function renderMuseum(){
    const container=$("#museum-exhibits"),filter=$("#museum-filter").value;container.replaceChildren();
    museumExhibits.filter(item=>filter==="all"||item.era===filter).forEach(item=>{
      const article=document.createElement("article");article.className="museum-exhibit";
      const year=document.createElement("span");year.className="museum-year";year.textContent=item.year;
      const title=document.createElement("h3");title.textContent=item.title;
      const description=document.createElement("p");description.textContent=item.text;
      const link=document.createElement("a");link.href=item.source;link.target="_blank";link.rel="noopener noreferrer";link.textContent=item.label+" ↗";
      article.append(year,title,description,link);container.append(article);
    });
  }
  $("#museum-filter").addEventListener("change",renderMuseum);renderMuseum();
  $$("[data-decade]").forEach(button => button.addEventListener("click", () => {
    $$("[data-decade]").forEach(b => b.classList.toggle("active", b === button));
    renderTimeline(button.dataset.decade);
  }));

  $("#fact-btn").addEventListener("click", () => {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    $("#random-fact").textContent = fact;
  });
  // Efeitos curtos de interface. A música da rádio vem de transmissões reais.
  let audioContext = null, masterGain = null, soundEnabled = true;
  let soundLevel = Number(storage.get("webzone-sound-level", 0.6));
  if (!Number.isFinite(soundLevel)) soundLevel = 0.6;
  soundLevel = Math.max(0, Math.min(1, soundLevel));
  const soundVolumeInput = $("#global-sound-volume"), soundVolumeValue = $("#global-sound-value");
  if (soundVolumeInput) soundVolumeInput.value = String(Math.round(soundLevel * 100));
  if (soundVolumeValue) soundVolumeValue.textContent = Math.round(soundLevel * 100) + "%";
  function applySoundLevel() { if (masterGain) masterGain.gain.value = soundLevel; if (dialupAudio) dialupAudio.volume = soundLevel * 0.72; }
  function initAudio(){
    if(audioContext) return;
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx) return;
    audioContext=new Ctx();
    masterGain=audioContext.createGain();
    masterGain.gain.value=soundLevel;
    masterGain.connect(audioContext.destination);
  }
  function note(freq,duration,when,opts={}){
    if(!audioContext||!masterGain)return;
    const osc=audioContext.createOscillator(),gain=audioContext.createGain();
    osc.type=opts.wave||"sine";
    osc.frequency.setValueAtTime(freq,when);
    gain.gain.setValueAtTime(.0001,when);
    gain.gain.exponentialRampToValueAtTime(opts.volume||.05,when+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
    osc.connect(gain);gain.connect(masterGain);osc.start(when);osc.stop(when+duration+.025);
  }
  function blip(freq=880,duration=.09,volume=.06){
    if(!soundEnabled)return;
    initAudio();if(!audioContext)return;
    audioContext.resume();
    note(freq,duration,audioContext.currentTime,{volume});
  }
  let dialupAudio = null;
  function dialupSound(){
    if(!soundEnabled || soundLevel === 0)return;
    try{
      if(!dialupAudio){
        dialupAudio=new Audio("https://commons.wikimedia.org/wiki/Special:FilePath/Dial_up_modem_noises.ogg");
        dialupAudio.preload="auto";dialupAudio.volume=soundLevel*.72;
      }
      dialupAudio.pause();dialupAudio.currentTime=0;
      const playback=dialupAudio.play();
      if(playback&&typeof playback.catch==="function")playback.catch(()=>toast("O navegador bloqueou o áudio do modem. Clique novamente em Conectar."));
    }catch{toast("Não foi possível carregar o áudio do modem.");}
  }

  $("#connect-btn").addEventListener("click", () => {
    const status = $("#connection-status");
    const button = $("#connect-btn");
    if (status.textContent === "conectado") {
      status.textContent = "desconectado"; $(".led").style.background = "#f00"; button.textContent = "Conectar à internet";
      if (dialupAudio) { dialupAudio.pause(); dialupAudio.currentTime = 0; }
      toast("Conexão encerrada. Pode liberar a linha telefônica.");
    } else {
      dialupSound();
      status.textContent = "discando..."; button.disabled = true;
      // O áudio de modem completo dura cerca de 29 s, então a conexão não termina em 1,8 s.
      setTimeout(() => { status.textContent = "conectado"; $(".led").style.background = "#0a0"; button.disabled = false; button.textContent = "Desconectar"; toast("Conectado a 56 kbps. Não atenda o telefone!"); }, 28000);
    }
  });

  const profileKey = "webzone-profile";
  const savedProfile = storage.get(profileKey, null);
  if (savedProfile) { $("#nickname").value = savedProfile.name; $("#profile-status").value = savedProfile.mood; }
  function updateProfile() {
    const name = $("#nickname").value.trim().slice(0, 20) || "visitante_2000";
    const mood = $("#profile-status").value;
    $("#nickname").value = name;
    $("#profile-preview").textContent = name + " está " + mood;
    storage.set(profileKey, {name, mood});
  }
  $("#save-profile").addEventListener("click",()=>{
    updateProfile();const data=storage.get(profileWindowKey,{});
    data.name=$("#nickname").value.trim().slice(0,24)||"visitante_2000";data.status=$("#profile-status").value;storage.set(profileWindowKey,data);
    if($("#profile-edit-name"))$("#profile-edit-name").value=data.name;if($("#profile-edit-status"))$("#profile-edit-status").value=data.status;if($("#profile-window-name"))$("#profile-window-name").textContent=data.name;
    toast("Status do Messenger atualizado.");
  });
  $("#nickname").addEventListener("keydown", e => { if (e.key === "Enter") updateProfile(); });
  updateProfile();

  const windows = $$(".floating-window");
  const taskbarApps = $("#taskbar-apps"), startMenu = $("#start-menu"), startButton = $("#start-button");
  const windowIcons = {"browser-window":"🌐","chat-room-window":"💬","messenger-window":"🟢","icq-window":"🌼","profile-window":"👤","secret-window":"🔒"};
  function renderTaskbar() {
    if (!taskbarApps) return;
    taskbarApps.replaceChildren();
    windows.forEach(win => {
      if (win.classList.contains("hidden")) return;
      const button=document.createElement("button");button.type="button";
      button.className="taskbar-app"+(win.classList.contains("minimized")?"":" is-active");
      const title=$(".floating-title span",win)?.textContent?.trim()||win.getAttribute("aria-label")||win.id;
      button.textContent=(windowIcons[win.id]||"▣")+" "+title;button.title=title;
      button.addEventListener("click",()=>{
        if(win.classList.contains("minimized")||win.classList.contains("hidden"))openWindow(win.id);
        else win.style.zIndex=String(Date.now()%100000+30);
        renderTaskbar();
      });
      taskbarApps.append(button);
    });
  }
  function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    windows.forEach(w => { if (w !== win) w.style.zIndex = "20"; });
    win.classList.remove("hidden","minimized"); win.style.zIndex = String(Date.now() % 100000 + 30);
    const input = $("input", win); if (input) setTimeout(() => input.focus(), 50);
    if(startMenu)startMenu.classList.add("hidden");if(startButton)startButton.setAttribute("aria-expanded","false");renderTaskbar();
  }
  function closeWindow(id){const win=document.getElementById(id);if(win)win.classList.add("hidden");renderTaskbar();}
  $$("[data-open]").forEach(button=>button.addEventListener("click",()=>openWindow(button.dataset.open)));
  $$("[data-close]").forEach(button=>button.addEventListener("click",()=>closeWindow(button.dataset.close)));
  if(startButton&&startMenu)startButton.addEventListener("click",()=>{
    const opening=startMenu.classList.contains("hidden");startMenu.classList.toggle("hidden",!opening);startButton.setAttribute("aria-expanded",String(opening));
  });
  document.addEventListener("click",e=>{
    if(!startMenu||!startButton||startMenu.classList.contains("hidden"))return;
    if(!startMenu.contains(e.target)&&!startButton.contains(e.target)){startMenu.classList.add("hidden");startButton.setAttribute("aria-expanded","false");}
  });
  $$("[data-start-radio]").forEach(link=>link.addEventListener("click",()=>{
    $("#radio").scrollIntoView({behavior:"smooth",block:"start"});if(startMenu)startMenu.classList.add("hidden");if(startButton)startButton.setAttribute("aria-expanded","false");
  }));
  $$(".floating-title").forEach(bar => {
    let drag = null;
    bar.addEventListener("pointerdown", e => {
      if (e.target.closest("button")) return;
      const win = bar.closest(".floating-window");
      const rect = win.getBoundingClientRect();
      drag = {x:e.clientX,y:e.clientY,left:rect.left,top:rect.top};
      win.style.transform = "none"; bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", e => {
      if (!drag) return;
      const win = bar.closest(".floating-window");
      const width = Math.min(win.offsetWidth || 430, window.innerWidth);
      const visibleTitle = Math.min(100, width);
      const x = Math.max(0, Math.min(window.innerWidth - visibleTitle, drag.left + e.clientX - drag.x));
      const y = Math.max(0, Math.min(window.innerHeight - 60, drag.top + e.clientY - drag.y));
      win.style.left = x + "px"; win.style.top = y + "px";
    });
    const stop = () => { drag = null; };
    bar.addEventListener("pointerup", stop); bar.addEventListener("pointercancel", stop);
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){windows.forEach(w=>w.classList.add("hidden"));if(startMenu)startMenu.classList.add("hidden");if(startButton)startButton.setAttribute("aria-expanded","false");renderTaskbar();}
  });
  const taskbarObserver=new MutationObserver(renderTaskbar);
  windows.forEach(win=>taskbarObserver.observe(win,{attributes:true,attributeFilter:["class"]}));
  renderTaskbar();
  const taskbarClock=$("#taskbar-clock");
  function updateTaskbarClock(){if(taskbarClock)taskbarClock.textContent=new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit"}).format(new Date());}
  updateTaskbarClock();setInterval(updateTaskbarClock,30000);

  const memoryMessages = {
    cd:"Você gravou um CD em velocidade 48x, escreveu o nome com caneta e torceu para o aparelho conseguir ler.",
    phone:"Você abriu o Snake só para uma partida rápida. Quarenta minutos depois, ainda estava tentando bater o recorde.",
    lan:"Cheiro de computador quente, cadeira disputada e alguém gritando que o outro estava usando hack.",
    orkut:"Você recebeu um scrap com glitter, entrou numa comunidade absurda e achou isso uma descrição precisa da sua personalidade.",
    vhs:"A fita precisava ser rebobinada. A locadora precisava receber tudo no prazo. O videocassete não perdoava."
  };
  $$("[data-memory]").forEach(button => button.addEventListener("click", () => toast(memoryMessages[button.dataset.memory] || "Memória carregada.")));

  const culture = {
    "90":"Rádio e MTV: Spice Girls, Backstreet Boys, Britney Spears no fim da década, Nirvana, Oasis, R.E.M., pagode, axé e sertanejo nas rádios brasileiras.",
    "00":"Pop de arena, hip-hop, emo e rock de rádio: Beyoncé, Rihanna, Linkin Park, Evanescence, Avril Lavigne, Charlie Brown Jr. e CPM 22.",
    tv:"TV Globinho, Castelo Rá-Tim-Bum em reprises, Dragon Ball Z, Pokémon, Friends, Chaves, Malhação e desenhos que marcavam o horário de voltar da escola.",
    cinema:"Toy Story, Matrix, Jurassic Park, Harry Potter, O Senhor dos Anéis, Shrek e grandes franquias que dominaram o cinema e o DVD."
  };
  $$("[data-culture]").forEach(button => button.addEventListener("click", () => { $("#culture-detail").textContent = culture[button.dataset.culture]; }));

  let ring = 0;
  const ringSites = ["Nostalgia Digital","Arquivo dos Games","Mundo dos GIFs","Web Design Antigo","Clube do CD-R"];
  function renderRing() { $("#ring-label").textContent = "Site " + String(ring + 1).padStart(2,"0") + " de 05: " + ringSites[ring]; }
  $("#ring-prev").addEventListener("click", () => { ring = (ring + ringSites.length - 1) % ringSites.length; renderRing(); });
  $("#ring-next").addEventListener("click", () => { ring = (ring + 1) % ringSites.length; renderRing(); });

  let gameTimer = null, gameStart = 0, gameState = "idle";
  const game = $("#reaction-game"), result = $("#game-result"), start = $("#game-start");
  const bestKey = "webzone-reaction-best";
  const best = storage.get(bestKey, null);
  if (best) result.textContent = "Recorde pessoal: " + best + " ms.";
  start.addEventListener("click", () => {
    clearTimeout(gameTimer);
    gameState = "waiting"; game.className = "reaction-game waiting"; game.textContent = "AGUARDE... NÃO CLIQUE AINDA!";
    start.disabled = true;
    gameTimer = setTimeout(() => { gameState = "ready"; game.className = "reaction-game ready"; game.textContent = "CLIQUE AGORA!"; gameStart = performance.now(); start.disabled = false; }, 1200 + Math.random() * 2600);
  });
  game.addEventListener("click", () => {
    if (gameState === "waiting") { clearTimeout(gameTimer); gameState = "idle"; game.className = "reaction-game"; game.textContent = "Cedo demais! Que ansiedade."; start.disabled = false; return; }
    if (gameState === "ready") {
      const ms = Math.round(performance.now() - gameStart); gameState = "idle"; game.className = "reaction-game"; game.textContent = ms + " ms! Tente novamente.";
      const old = storage.get(bestKey, null);
      if (!old || ms < old) { storage.set(bestKey, ms); result.textContent = "Novo recorde pessoal: " + ms + " ms!"; } else result.textContent = "Seu tempo: " + ms + " ms. Recorde: " + old + " ms.";
    }
  });

  const browserPages = {
    home: {address:"http://www.webzone2000.com/",html:"<h2>Bem-vindo à Web Zone!</h2><p>Um portal nostálgico feito para explorar os anos 90 e 2000.</p><button data-page='history'>Abrir arquivo histórico</button><div class='fake-page-content'>Última atualização: hoje · Visitantes: muitos, na nossa imaginação.</div>"},
    chat: {address:"http://msn-messenger.net/",html:"<h2>MSN Messenger 7.5</h2><p>Você tem 4 contatos online e 1 pessoa acabou de entrar.</p><button data-page='home'>Voltar para a página inicial</button><div class='fake-page-content'>♫ agora ouvindo: música.mp3<br>Seu status: disponível</div>"},
    history: {address:"http://arquivo-historico.org/",html:"<h2>Arquivo histórico 1990–2009</h2><p>Explore os acontecimentos que mudaram a cultura, a tecnologia e o mundo.</p><button data-page='home'>Página inicial</button><div class='fake-page-content'>1991 · Web pública<br>1995 · Windows 95<br>2004 · Redes sociais<br>2007 · Smartphone moderno</div>"}
  };
  const savedBrowserHistory=storage.get("webzone-browser-history",["home"]);
  let browserHistory=Array.isArray(savedBrowserHistory)?savedBrowserHistory.filter(key=>browserPages[key]):["home"];
  if(!browserHistory.length)browserHistory=["home"];
  let browserIndex=browserHistory.length-1;
  let browserFavorites=storage.get("webzone-browser-favorites",[]);
  if(!Array.isArray(browserFavorites))browserFavorites=[];
  function renderBrowserLists(){
    const favoritesList=$("#browser-favorites-list"),historyList=$("#browser-history-list");
    if(!favoritesList||!historyList)return;
    favoritesList.replaceChildren();historyList.replaceChildren();
    const addLink=(container,key,label)=>{const page=browserPages[key];if(!page)return;const button=document.createElement("button");button.type="button";button.dataset.browserKey=key;button.textContent=label||page.address;container.append(button);};
    browserFavorites.forEach(key=>addLink(favoritesList,key,"★ "+browserPages[key].address));
    [...browserHistory].reverse().slice(0,10).forEach(key=>addLink(historyList,key,"🕒 "+browserPages[key].address));
    if(!favoritesList.children.length)favoritesList.textContent="Nenhum favorito salvo.";
    if(!historyList.children.length)historyList.textContent="O histórico está vazio.";
  }
  function showBrowserPage(key,push=true){
    const page=browserPages[key]||browserPages.home;
    if(push){browserHistory=browserHistory.slice(0,browserIndex+1);browserHistory.push(key);if(browserHistory.length>40)browserHistory=browserHistory.slice(-40);browserIndex=browserHistory.length-1;storage.set("webzone-browser-history",browserHistory);}
    $("#browser-address").value=page.address;$("#browser-page").innerHTML=page.html;renderBrowserLists();
  }
  $("#browser-page").addEventListener("click",e=>{const button=e.target.closest("[data-page]");if(button)showBrowserPage(button.dataset.page);});
  $("#browser-bookmarks-toggle").addEventListener("click",()=>{const panel=$("#browser-bookmarks");panel.hidden=!panel.hidden;$("#browser-bookmarks-toggle").setAttribute("aria-expanded",String(!panel.hidden));});
  $("#browser-favorite").addEventListener("click",()=>{
    const key=browserHistory[browserIndex]||"home";if(browserFavorites.includes(key)){toast("Esta página já está nos favoritos.");return;}
    browserFavorites=[...browserFavorites,key].slice(-20);storage.set("webzone-browser-favorites",browserFavorites);renderBrowserLists();toast("Página adicionada aos favoritos.");
  });
  $("#browser-bookmarks").addEventListener("click",e=>{const button=e.target.closest("[data-browser-key]");if(button)showBrowserPage(button.dataset.browserKey);});
  renderBrowserLists();showBrowserPage(browserHistory[browserIndex],false);
  $("#browser-go").addEventListener("click", () => {
    const value = $("#browser-address").value.toLowerCase();
    const key = value.includes("msn") ? "chat" : value.includes("historico") ? "history" : "home";
    showBrowserPage(key);
    toast("Navegação simulada: endereço externo não foi acessado.");
  });
  $("#browser-address").addEventListener("keydown", e => { if (e.key === "Enter") $("#browser-go").click(); });
  $("#browser-home").addEventListener("click", () => showBrowserPage("home"));
  $("#browser-back").addEventListener("click", () => { if (browserIndex > 0) { browserIndex--; showBrowserPage(browserHistory[browserIndex], false); } });
  $("#browser-forward").addEventListener("click", () => { if (browserIndex < browserHistory.length - 1) { browserIndex++; showBrowserPage(browserHistory[browserIndex], false); } });

  const chatLog = $("#chat-log");
  let activeContact = "Bia_xD";
  $$("[data-contact]").forEach(button => button.addEventListener("click", () => {
    activeContact = button.dataset.contact;
    const p = document.createElement("p"); p.innerHTML = "<b>Sistema:</b> Conversa iniciada com " + activeContact + ".";
    chatLog.append(p); chatLog.scrollTop = chatLog.scrollHeight;
  }));
  $("#chat-form").addEventListener("submit", e => {
    e.preventDefault();
    const input = $("#chat-input"), message = input.value.trim();
    if (!message) return;
    const own = document.createElement("p"); const b = document.createElement("b"); b.textContent = "Você: "; own.append(b, document.createTextNode(message)); chatLog.append(own); input.value = ""; chatLog.scrollTop = chatLog.scrollHeight;
  });

  const profileWindowKey="webzone-personal-profile";
  function applyProfileWindowData(data){
    const values={name:data.name||"visitante_2000",status:data.status||"online e feliz",music:data.music||"qualquer MP3 de 4 MB",quote:data.quote||"a vida é feita de pixels",avatar:data.avatar||"😎"};
    $("#profile-edit-name").value=values.name;$("#profile-edit-status").value=values.status;$("#profile-music-input").value=values.music;$("#profile-quote").value=values.quote;
    $("#profile-window-name").textContent=values.name;$("#profile-music").textContent=values.music;$("#profile-quote-preview").textContent="Frase: “"+values.quote+"”";$(".avatar").textContent=values.avatar;storage.set(profileWindowKey,values);
  }
  applyProfileWindowData(storage.get(profileWindowKey,{}));
  $("#profile-edit-form").addEventListener("submit",e=>{
    e.preventDefault();
    const data={...storage.get(profileWindowKey,{}),name:$("#profile-edit-name").value.trim().slice(0,24)||"visitante_2000",status:$("#profile-edit-status").value,music:$("#profile-music-input").value.trim().slice(0,80)||"nenhuma música selecionada",quote:$("#profile-quote").value.trim().slice(0,120)||"a vida é feita de pixels",avatar:$(".avatar").textContent};
    applyProfileWindowData(data);toast("Perfil salvo neste navegador.");
  });
  $$(".profile-friends [data-profile-friend]").forEach(button=>button.addEventListener("click",()=>{
    openWindow("messenger-window");const target=$$("#messenger-window [data-contact]").find(item=>item.dataset.contact===button.dataset.profileFriend);if(target)target.click();
  }));
  $("#change-avatar").addEventListener("click",()=>{
    const avatars=["😎","🦇","🐸","👽","🧙","🐱","💿","🤘"],current=$(".avatar").textContent,next=avatars[(avatars.indexOf(current)+1)%avatars.length];
    $(".avatar").textContent=next;const data=storage.get(profileWindowKey,{});data.avatar=next;storage.set(profileWindowKey,data);toast("Avatar atualizado. Perfil digno de 2004.");
  });

  const guestKey = "webzone_guests";
  const legacyGuestKey = "webzone-guestbook";
  function renderGuestbook() {
    const entries = storage.get(guestKey, storage.get(legacyGuestKey, []));
    const container = $("#guestbook-entries"); container.replaceChildren();
    entries.slice(-6).reverse().forEach(entry => {
      const div = document.createElement("div"); div.className = "guest-entry";
      const name = document.createElement("b"); name.textContent = entry.name + " escreveu:";
      const p = document.createElement("p"); p.textContent = entry.message;
      const date = document.createElement("small"); date.textContent = entry.date;
      div.append(name, p, date);
      if(entry.url){const link=document.createElement("a");link.href=entry.url;link.target="_blank";link.rel="noopener noreferrer";link.textContent=entry.url;link.className="guest-homepage";div.append(link);}
      container.append(div);
    });
  }
  $("#guestbook-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#guest-name").value.trim(), url = $("#guest-url").value.trim(), message = $("#guest-message").value.trim();
    if (!name || !message) return;
    const entries = storage.get(guestKey, storage.get(legacyGuestKey, []));
    entries.push({name:name.slice(0,30),url:url.slice(0,100),message:message.slice(0,300),date:new Date().toLocaleDateString("pt-BR")});
    storage.set(guestKey, entries.slice(-30)); $("#guestbook-form").reset(); renderGuestbook(); toast("Sua assinatura foi registrada neste navegador!");
  });
  renderGuestbook();

  $("#secret-confetti").addEventListener("click", () => {
    const emojis = ["✨","🎉","💿","🌈","⭐","🪩"];
    const layer = document.createElement("div");
    layer.style.cssText = "position:fixed;inset:0;z-index:90;pointer-events:none;overflow:hidden";
    for (let i=0;i<36;i++) {
      const item = document.createElement("span"); item.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      item.style.cssText = "position:absolute;left:"+Math.random()*100+"%;top:-30px;font-size:"+(18+Math.random()*22)+"px;animation:fall "+(1.8+Math.random()*2.2)+"s linear forwards";
      layer.append(item);
    }
    const style = document.createElement("style"); style.textContent = "@keyframes fall{to{transform:translateY(110vh) rotate(720deg);opacity:.2}}"; layer.append(style); document.body.append(layer); setTimeout(()=>layer.remove(),4500);
  });



  // Rádio real: streams ao vivo dentro da página, sem sintetizador e sem links para busca.
  const radioStations = {
    vapor:{label:"Yumi Co. Radio · Vaporwave / Future Funk",type:"audio",url:"https://yumicoradio.net/stream",fallback:"https://yumicoradio.net/stream_128",era:"VAPORWAVE · FUTURE FUNK · CITY POP"},
    nineties:{label:"Rádio Energia Dance · anos 90",type:"audio",url:"https://s05.w3bserver.com:20025/;",era:"EURODANCE · DANCE · ANOS 90"},
    "two-thousands":{label:"Rádio Studio Flashback · anos 2000",type:"audio",url:"https://stream-163.zeno.fm/6gv76f1xruquv",era:"HITS · POP · ROCK · ANOS 2000"},
    games:{label:"Yumi Co. Radio · stream alternativo",type:"audio",url:"https://yumicoradio.net/stream_aac64",fallback:"https://yumicoradio.net/stream_128",era:"FUTURE FUNK · VAPORWAVE · CITY POP"},
    br:{label:"Fita Cassete · flashback",type:"audio",url:"https://server01.ouvir.radio.br:8018/stream",era:"FLASHBACK · CLÁSSICOS DE VÁRIAS DÉCADAS"}
  };
  const radioStationSelect=$("#radio-station");
  const savedRadioGenre=storage.get("webzone-radio-station","vapor");
  if(radioStations[savedRadioGenre])radioStationSelect.value=savedRadioGenre;
  const radioVolumeInput=$("#radio-volume");
  const savedRadioVolume=Number(storage.get("webzone-radio-volume",42));
  const radioVolume=Math.max(0,Math.min(100,Number.isFinite(savedRadioVolume)?savedRadioVolume:42));
  radioVolumeInput.value=String(radioVolume);
  $("#radio-volume-value").textContent=radioVolume+"%";
  let radioGenre=radioStationSelect.value||"vapor",radioPlaying=false,radioStartedAt=0,radioElapsed=0,radioWantsPlayback=false;
  const radioAudio=$("#radio-audio"),radioEmbed=$("#radio-embed"),radioNote=$("#radio-player-note");
  function setRadioInfo(){
    const station=radioStations[radioGenre];
    $("#radio-track-title").textContent=station.label;
    $("#radio-track-era").textContent=station.era;
    $("#radio-status").textContent="READY · "+station.label.toUpperCase();
  }
  function setRadioPlaying(playing){
    radioPlaying=playing;$("#radio-live-state").textContent=playing?"LIVE":"STOP";
    $("#radio-play").textContent=playing?"Ⅱ":"▶";$(".winamp-shell").classList.toggle("is-playing",playing);
    $("#radio-status").textContent=(playing?"ON AIR · ":"READY · ")+radioStations[radioGenre].label.toUpperCase();
  }
  function tuneRadio(autoplay=false){
    const station=radioStations[radioGenre];radioWantsPlayback=autoplay;radioAudio.dataset.fallbackUsed="no";radioAudio.pause();radioAudio.removeAttribute("src");radioAudio.load();
    radioEmbed.hidden=true;radioEmbed.src="about:blank";radioAudio.hidden=station.type!=="audio";radioNote.hidden=false;
    setRadioInfo();
    if(station.type==="audio"){
      radioAudio.src=station.url;radioAudio.volume=Number($("#radio-volume").value)/100;radioAudio.load();
      radioNote.innerHTML="♫ TRANSMISSÃO AO VIVO<br><small>Faixas reais em sequência automática. Sem chiptune inventado.</small>";
      if(autoplay)radioAudio.play().then(()=>{radioStartedAt=Date.now();setRadioPlaying(true)}).catch(()=>toast("Clique em PLAY para liberar o áudio."));
      else setRadioPlaying(false);
    }else{
      radioEmbed.hidden=false;radioEmbed.src=station.url;radioNote.hidden=true;setRadioPlaying(false);
    }
  }
  radioStationSelect.addEventListener("change",()=>{
    const resume=radioWantsPlayback||radioPlaying||(!radioAudio.paused&&!radioAudio.ended);
    radioGenre=radioStationSelect.value;storage.set("webzone-radio-station",radioGenre);
    radioElapsed=0;radioStartedAt=Date.now();$("#radio-clock").textContent="00:00";$("#radio-progress").style.width="0%";
    tuneRadio(resume);blip(740,.08,.035);
  });
  $("#radio-play").addEventListener("click",()=>{
    const station=radioStations[radioGenre];
    if(station.type==="embed"){radioEmbed.hidden=false;radioEmbed.src=station.url;radioNote.hidden=true;toast("Use PLAY dentro do player da rádio incorporada.");return}
    if(radioPlaying){radioWantsPlayback=false;radioAudio.pause();radioElapsed+=Date.now()-radioStartedAt;setRadioPlaying(false)}
    else {radioWantsPlayback=true;radioAudio.play().then(()=>{radioStartedAt=Date.now();setRadioPlaying(true)}).catch(()=>toast("A transmissão não iniciou. Tente novamente."));}
  });
  $("#radio-stop").addEventListener("click",()=>{radioWantsPlayback=false;radioAudio.pause();radioElapsed=0;$("#radio-clock").textContent="00:00";$("#radio-progress").style.width="0%";setRadioPlaying(false);radioNote.hidden=false;radioNote.innerHTML="♫ TRANSMISSÃO PAUSADA<br><small>Escolha uma estação e aperte PLAY.</small>"});
  $("#radio-next").addEventListener("click",()=>{const s=$("#radio-station");s.selectedIndex=(s.selectedIndex+1)%s.options.length;s.dispatchEvent(new Event("change"))});
  $("#radio-prev").addEventListener("click",()=>{const s=$("#radio-station");s.selectedIndex=(s.selectedIndex+s.options.length-1)%s.options.length;s.dispatchEvent(new Event("change"))});
  radioVolumeInput.addEventListener("input",e=>{
    const v=Math.max(0,Math.min(100,Number(e.target.value)));
    $("#radio-volume-value").textContent=v+"%";radioAudio.volume=v/100;storage.set("webzone-radio-volume",v);
  });
  radioAudio.addEventListener("playing",()=>setRadioPlaying(true));
  radioAudio.addEventListener("pause",()=>{if(radioPlaying)setRadioPlaying(false)});
  radioAudio.addEventListener("error",()=>{
    if(radioAudio.hidden)return;
    const station=radioStations[radioGenre];
    if(station.fallback&&radioAudio.dataset.fallbackUsed!=="yes"){
      radioAudio.dataset.fallbackUsed="yes";radioAudio.src=station.fallback;radioAudio.load();
      if(radioWantsPlayback)radioAudio.play().then(()=>{radioStartedAt=Date.now();setRadioPlaying(true)}).catch(()=>{
        setRadioPlaying(false);$("#radio-status").textContent="ERROR · "+station.label.toUpperCase();toast("A estação e seu stream alternativo não responderam.");
      });
      return;
    }
    setRadioPlaying(false);$("#radio-status").textContent="ERROR · "+station.label.toUpperCase();
    toast("A transmissão não respondeu. Troque de estação para continuar.");
  });
  $("#radio-skin-toggle").addEventListener("click",()=>{const shell=$(".winamp-shell"),wmp=shell.classList.toggle("wmp-skin");$("#radio-skin-label").textContent=wmp?"▶ Windows Media Player 9 · WEB ZONE RADIO":"▣ Winamp 2.95 · WEB ZONE RADIO";$("#radio-skin-toggle").textContent=wmp?"Switch to Winamp":"Switch to WMP";blip(wmp?920:640,.09,.05)});
  $("#radio-sound-toggle").addEventListener("click",()=>{soundEnabled=!soundEnabled;$("#radio-sound-toggle").textContent=soundEnabled?"🔊 Efeitos: ligados":"🔇 Efeitos: desligados";blip(520,.07,.04)});
  if (soundVolumeInput) soundVolumeInput.addEventListener("input", e => {
    soundLevel = Math.max(0, Math.min(1, Number(e.target.value) / 100));
    if (soundVolumeValue) soundVolumeValue.textContent = Math.round(soundLevel * 100) + "%";
    storage.set("webzone-sound-level", soundLevel); applySoundLevel();
  });
  tuneRadio(true);
  // Se o navegador bloquear autoplay com som, tente novamente no primeiro gesto fora do player.
  document.addEventListener("pointerdown",e=>{
    if(e.target.closest("#radio")||radioPlaying||!radioWantsPlayback||!radioAudio.paused||!radioAudio.src)return;
    radioAudio.play().then(()=>{radioStartedAt=Date.now();setRadioPlaying(true)}).catch(()=>{});
  });
  setInterval(()=>{if(radioPlaying){const seconds=Math.floor((Date.now()-radioStartedAt+radioElapsed)/1000);$("#radio-clock").textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");$("#radio-progress").style.width=(seconds%60/60*100)+"%";$$("#radio-spectrum i").forEach(bar=>bar.style.setProperty("--bar",(10+Math.random()*90)+"%"))}},1000);


  // Sala flutuante no estilo original: mensagens locais sem bots nem respostas fabricadas.
  const windowRoomLog=$("#window-room-log");
  function appendWindowRoomMessage(nick,message,system=false){
    const p=document.createElement("p");if(system)p.className="room-system";
    const b=document.createElement("b");b.textContent=system?"*** ":nick+": ";
    p.append(b,document.createTextNode(message));windowRoomLog.append(p);windowRoomLog.scrollTop=windowRoomLog.scrollHeight;
  }
  $("#window-room-form").addEventListener("submit",e=>{
    e.preventDefault();const input=$("#window-room-input"),message=input.value.trim();if(!message)return;
    appendWindowRoomMessage(($("#window-room-nick").value.trim()||"visitante").slice(0,20),message);
    input.value="";blip(880,.07,.045);
  });
  $("#window-room-nudge").addEventListener("click",()=>{
    const win=$("#chat-room-window");win.classList.remove("nudge-shake");void win.offsetWidth;win.classList.add("nudge-shake");
    if(soundEnabled){blip(760,.08,.07);setTimeout(()=>blip(980,.09,.07),130);setTimeout(()=>blip(760,.12,.07),260);}
    appendWindowRoomMessage("Sistema","ZUMBIDO enviado!",true);toast("Bzzzt! Zumbido enviado na sala.");setTimeout(()=>win.classList.remove("nudge-shake"),650);
  });

  // Sala #nostalgia: chat demonstrativo local e zumbido estilo MSN.
  const roomLog=$("#room-log");
  function roomAppend(name,message,system=false){const p=document.createElement("p");if(system)p.className="room-system";const b=document.createElement("b");b.textContent=system?"*** ":name+": ";p.append(b,document.createTextNode(message));roomLog.append(p);roomLog.scrollTop=roomLog.scrollHeight}
  $("#room-form").addEventListener("submit",e=>{e.preventDefault();const input=$("#room-input"),message=input.value.trim();if(!message)return;const nick=($("#room-nick").value.trim()||"visitante_2000").slice(0,20);roomAppend(nick,message);input.value="";blip(880,.07,.045)});
  $("#room-nudge").addEventListener("click",()=>{roomLog.classList.remove("room-nudge");void roomLog.offsetWidth;roomLog.classList.add("room-nudge");if(soundEnabled){blip(760,.08,.07);setTimeout(()=>blip(980,.09,.07),130);setTimeout(()=>blip(760,.12,.07),260)}roomAppend("Sistema",($("#room-nick").value.trim()||"visitante_2000")+" mandou um ZUMBIDO!",true);toast("Bzzzt! Zumbido na sala de demonstração.");setTimeout(()=>roomLog.classList.remove("room-nudge"),650)});
  const moodKey="webzone-mood-original";
  const savedMood=storage.get(moodKey,{face:"ツ",label:"ツ"});
  $("#mood-select").value=savedMood.label;
  $("#mood-face").textContent=savedMood.face;
  $("#mood-save").addEventListener("click",()=>{
    const face=$("#mood-select").value;
    storage.set(moodKey,{face,label:face});
    $("#mood-face").textContent=face;
    toast("Seu humor foi atualizado na homepage!");
    blip(660,.08,.04);
  });
  $$("#messenger-window [data-contact]").forEach(button=>button.addEventListener("click",()=>blip(730,.07,.04)));
  $("#chat-form").addEventListener("submit",()=>blip(880,.07,.04));
  let icqContact="Neo_1999";
  const icqLog=$("#icq-chat-log");
  $(".icq-contact-list").addEventListener("click",e=>{const button=e.target.closest("[data-icq-contact]");if(!button)return;icqContact=button.dataset.icqContact;$("#icq-chat-title").textContent="Chat with "+icqContact;const p=document.createElement("p"),b=document.createElement("b");b.textContent="System: ";p.append(b,document.createTextNode("Conversation with "+icqContact+" selected."));icqLog.append(p);icqLog.scrollTop=icqLog.scrollHeight;blip(740,.08,.045);});
  $("#icq-chat-form").addEventListener("submit",e=>{
    e.preventDefault();const input=$("#icq-chat-input"),message=input.value.trim();if(!message)return;
    const p=document.createElement("p"),b=document.createElement("b");b.textContent="You: ";p.append(b,document.createTextNode(message));icqLog.append(p);input.value="";icqLog.scrollTop=icqLog.scrollHeight;blip(880,.07,.045);
  });
  $("#icq-status").addEventListener("click",e=>{const states=["🟢 Available","🌙 Away","⛔ Do not disturb","🔴 Invisible"];const current=states.indexOf(e.currentTarget.textContent);e.currentTarget.textContent=states[(current+1)%states.length];blip(600,.08,.04);});
  $("#icq-add-contact").addEventListener("click",()=>{const name=window.prompt("Nick do novo contato ICQ:");if(!name||!name.trim())return;const nick=name.trim().slice(0,24);if($$("[data-icq-contact]").some(button=>button.dataset.icqContact.toLowerCase()===nick.toLowerCase())){toast("Esse contato já está na lista.");return;}const button=document.createElement("button");button.dataset.icqContact=nick;button.textContent="🟢 "+nick;const small=document.createElement("small");small.textContent="added just now";button.append(small);$(".icq-contact-list").append(button);toast(nick+" foi adicionado à lista ICQ.");});
  $("#icq-sound-test").addEventListener("click",()=>{initAudio();if(soundEnabled){blip(1180,.09,.08);setTimeout(()=>blip(880,.13,.08),120);}else toast("Os efeitos sonoros estão desligados.");});
  $("#icq-nudge").addEventListener("click",()=>{const win=$("#icq-window");win.classList.remove("nudge-shake");void win.offsetWidth;win.classList.add("nudge-shake");if(soundEnabled){blip(760,.08,.07);setTimeout(()=>blip(980,.09,.07),130);setTimeout(()=>blip(760,.12,.07),260);}toast("📳 Zumbido enviado na janela ICQ.");setTimeout(()=>win.classList.remove("nudge-shake"),650);});
  $("#msn-nudge").addEventListener("click",()=>{
    const win=$("#messenger-window");win.classList.remove("nudge-shake");void win.offsetWidth;win.classList.add("nudge-shake");
    initAudio();if(soundEnabled){blip(760,.08,.07);setTimeout(()=>blip(980,.09,.07),130);setTimeout(()=>blip(760,.12,.07),260);}
    toast("Bzzzt! Você recebeu um chamar atenção estilo MSN.");
    setTimeout(()=>win.classList.remove("nudge-shake"),650);
  });
  const msnChatObserver=new MutationObserver(records=>{
    for(const record of records) for(const node of record.addedNodes){
      if(node.nodeType===1&&node.tagName==="P"&&!node.textContent.startsWith("Você:")&&!node.textContent.startsWith("Sistema:")&&soundEnabled){
        initAudio();blip(880,.1,.06);
      }
    }
  });
  msnChatObserver.observe($("#chat-log"),{childList:true});
  $$(".floating-title").forEach(bar=>{const win=bar.closest(".floating-window");if(!win)return;const button=bar.querySelector("[data-minimize]");if(button)button.addEventListener("click",e=>{e.stopPropagation();win.classList.toggle("minimized");renderTaskbar();});});

  // Popup nostálgico: uma vez por sessão, sem interromper a navegação repetidamente.
  const welcomePopup = $("#welcome-popup");
  function closeWelcomePopup() {
    welcomePopup.classList.add("hidden");
    try { sessionStorage.setItem("webzone-popup-seen","1"); } catch {}
  }
  $("#popup-close").addEventListener("click", closeWelcomePopup);
  $("#popup-close-x").addEventListener("click", closeWelcomePopup);
  $("#popup-open-radio").addEventListener("click", () => {
    closeWelcomePopup();
    $("#radio").scrollIntoView({behavior:"smooth",block:"start"});
    toast("WEB ZONE FM: escolha sua faixa e sintonize.");
  });
  welcomePopup.addEventListener("click", e => { if (e.target === welcomePopup) closeWelcomePopup(); });
  try {
    if (!sessionStorage.getItem("webzone-popup-seen")) {
      setTimeout(() => welcomePopup.classList.remove("hidden"), 7000);
    }
  } catch {}


  // Deliberately no automatic sound or unsolicited popup: nostalgia should be fun, not malware.
  console.info("WEB ZONE 2000 carregada. Modo nostalgia: ativado.");
})();