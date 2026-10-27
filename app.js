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
  $$("[data-decade]").forEach(button => button.addEventListener("click", () => {
    $$("[data-decade]").forEach(b => b.classList.toggle("active", b === button));
    renderTimeline(button.dataset.decade);
  }));

  $("#fact-btn").addEventListener("click", () => {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    $("#random-fact").textContent = fact;
  });
  $("#connect-btn").addEventListener("click", () => {
    const status = $("#connection-status");
    const button = $("#connect-btn");
    if (status.textContent === "conectado") {
      status.textContent = "desconectado"; $(".led").style.background = "#f00"; button.textContent = "Conectar à internet"; toast("Conexão encerrada. Pode liberar a linha telefônica.");
    } else {
      status.textContent = "discando..."; button.disabled = true;
      setTimeout(() => { status.textContent = "conectado"; $(".led").style.background = "#0a0"; button.disabled = false; button.textContent = "Desconectar"; toast("Conectado a 56 kbps. Não atenda o telefone!"); }, 1800);
    }
  });

  const profileKey = "webzone-profile";
  const savedProfile = storage.get(profileKey, null);
  if (savedProfile) { $("#nickname").value = savedProfile.name; $("#mood-select").value = savedProfile.mood; }
  function updateProfile() {
    const name = $("#nickname").value.trim().slice(0, 20) || "visitante_2000";
    const mood = $("#mood-select").value;
    $("#nickname").value = name;
    $("#profile-preview").textContent = name + " está " + mood;
    storage.set(profileKey, {name, mood});
  }
  $("#save-profile").addEventListener("click", () => { updateProfile(); toast("Status atualizado. Seus amigos podem fingir que viram."); });
  $("#nickname").addEventListener("keydown", e => { if (e.key === "Enter") updateProfile(); });
  updateProfile();

  const windows = $$(".floating-window");
  function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    windows.forEach(w => { if (w !== win) w.style.zIndex = "20"; });
    win.classList.remove("hidden"); win.style.zIndex = String(Date.now() % 100000 + 30);
    const input = $("input", win); if (input) setTimeout(() => input.focus(), 50);
  }
  function closeWindow(id) { const win = document.getElementById(id); if (win) win.classList.add("hidden"); }
  $$("[data-open]").forEach(button => button.addEventListener("click", () => openWindow(button.dataset.open)));
  $$("[data-close]").forEach(button => button.addEventListener("click", () => closeWindow(button.dataset.close)));
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
      const x = Math.max(0, Math.min(window.innerWidth - 100, drag.left + e.clientX - drag.x));
      const y = Math.max(0, Math.min(window.innerHeight - 60, drag.top + e.clientY - drag.y));
      win.style.left = x + "px"; win.style.top = y + "px";
    });
    const stop = () => { drag = null; };
    bar.addEventListener("pointerup", stop); bar.addEventListener("pointercancel", stop);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") windows.forEach(w => w.classList.add("hidden")); });

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
  let browserHistory = ["home"], browserIndex = 0;
  function showBrowserPage(key, push = true) {
    const page = browserPages[key] || browserPages.home;
    if (push) { browserHistory = browserHistory.slice(0, browserIndex + 1); browserHistory.push(key); browserIndex = browserHistory.length - 1; }
    $("#browser-address").value = page.address;
    $("#browser-page").innerHTML = page.html;
    $$("[data-page]", $("#browser-page")).forEach(button => button.addEventListener("click", () => showBrowserPage(button.dataset.page)));
  }
  $$("[data-page]", $("#browser-page")).forEach(button => button.addEventListener("click", () => showBrowserPage(button.dataset.page)));
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
  const replies = ["kkkkkkkk", "lembra daquela música?", "peraí que vou mandar no subnick", "to aqui sim, minha internet caiu antes 😂", "entra no Orkut depois", "me chama quando acabar o download"];
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
    setTimeout(() => {
      const reply = document.createElement("p"); const bold = document.createElement("b"); bold.textContent = activeContact + ": "; reply.append(bold, document.createTextNode(replies[Math.floor(Math.random() * replies.length)])); chatLog.append(reply); chatLog.scrollTop = chatLog.scrollHeight;
    }, 600 + Math.random() * 900);
  });

  $("#change-avatar").addEventListener("click", () => {
    const avatars = ["😎","🦇","🐸","👽","🧙","🐱","💿","🤘"];
    const current = $(".avatar").textContent;
    const next = avatars[(avatars.indexOf(current) + 1) % avatars.length];
    $(".avatar").textContent = next; toast("Avatar atualizado. Perfil digno de 2004.");
  });

  const guestKey = "webzone-guestbook";
  function renderGuestbook() {
    const entries = storage.get(guestKey, []);
    const container = $("#guestbook-entries"); container.replaceChildren();
    entries.slice(-6).reverse().forEach(entry => {
      const div = document.createElement("div"); div.className = "guest-entry";
      const name = document.createElement("b"); name.textContent = entry.name + " escreveu:";
      const p = document.createElement("p"); p.textContent = entry.message;
      const date = document.createElement("small"); date.textContent = entry.date;
      div.append(name, p, date); container.append(div);
    });
  }
  $("#guestbook-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#guest-name").value.trim(), message = $("#guest-message").value.trim();
    if (!name || !message) return;
    const entries = storage.get(guestKey, []);
    entries.push({name:name.slice(0,28),message:message.slice(0,220),date:new Date().toLocaleString("pt-BR")});
    storage.set(guestKey, entries.slice(-30)); $("#guest-message").value = ""; renderGuestbook(); toast("Recado salvo neste navegador!");
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



  // Rádio local contínua: Web Audio, sem depender de vídeos externos.
  const radioGenres = {
    vapor:{label:"VAPORWAVE FM · 1987 AFTER HOURS",tempo:76,scale:[0,3,5,7,10],wave:"triangle",filter:1050,delay:.34},
    nineties:{label:"90s ALT / DANCE · NIGHT DRIVE",tempo:112,scale:[0,2,4,7,9],wave:"sawtooth",filter:1800,delay:.16},
    "two-thousands":{label:"2000s POP / EMO / ROCK",tempo:124,scale:[0,3,5,7,10],wave:"square",filter:2200,delay:.12},
    games:{label:"8-BIT / PS1 / N64 / PC",tempo:138,scale:[0,2,5,7,9],wave:"square",filter:2600,delay:.08},
    br:{label:"BRASIL · MTV / LAN HOUSE / MP3",tempo:108,scale:[0,2,4,7,9],wave:"triangle",filter:1500,delay:.2}
  };
  let audioContext=null, masterGain=null, radioPlaying=false, soundEnabled=true, radioTimer=null, radioStep=0, radioStart=0, radioElapsed=0, radioGenre="vapor";
  let activeNodes=[];
  const classicSearches = [
    ["Everybody (Backstreet's Back)","Backstreet Boys"],["...Baby One More Time","Britney Spears"],["Blue (Da Ba Dee)","Eiffel 65"],["In the End","Linkin Park"],["Complicated","Avril Lavigne"],["Clint Eastwood","Gorillaz"],["Anna Júlia","Los Hermanos"],["Dias Atrás","CPM 22"],["Around the World","Daft Punk"],["Resonance","HOME vaporwave"]
  ];
  function initAudio(){
    if(audioContext) return;
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx){toast("Este navegador não oferece Web Audio.");return;}
    audioContext=new Ctx(); masterGain=audioContext.createGain(); masterGain.gain.value=Number($("#radio-volume").value)/100*.24; masterGain.connect(audioContext.destination);
  }
  function note(freq,duration,when,opts={}){
    if(!audioContext||!masterGain) return;
    const osc=audioContext.createOscillator(), gain=audioContext.createGain(), filter=audioContext.createBiquadFilter();
    osc.type=opts.wave||"triangle"; osc.frequency.setValueAtTime(freq,when);
    filter.type="lowpass"; filter.frequency.setValueAtTime(opts.filter||1300,when);
    gain.gain.setValueAtTime(.0001,when); gain.gain.exponentialRampToValueAtTime(opts.volume||.075,when+.025); gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
    osc.connect(filter); filter.connect(gain); gain.connect(masterGain); osc.start(when); osc.stop(when+duration+.04);
    activeNodes.push(osc);
  }
  function blip(freq=880,duration=.09,volume=.08){
    initAudio(); if(!audioContext||!soundEnabled) return; audioContext.resume();
    const now=audioContext.currentTime; note(freq,duration,now,{wave:"sine",volume,filter:3500});
  }
  function noiseBurst(duration=.24,volume=.05,when=null){
    if(!audioContext||!masterGain) return;
    const length=Math.max(1,Math.floor(audioContext.sampleRate*duration)), buffer=audioContext.createBuffer(1,length,audioContext.sampleRate), data=buffer.getChannelData(0);
    for(let i=0;i<length;i++) data[i]=(Math.random()*2-1)*(1-i/length);
    const src=audioContext.createBufferSource(), gain=audioContext.createGain(), filter=audioContext.createBiquadFilter(), startAt=when??audioContext.currentTime;
    src.buffer=buffer; filter.type="bandpass"; filter.frequency.value=1500; filter.Q.value=.7; gain.gain.value=volume;
    src.connect(filter);filter.connect(gain);gain.connect(masterGain);src.start(startAt);
  }
  function dialupSound(){
    initAudio(); if(!audioContext||!soundEnabled) return; audioContext.resume();
    const start=audioContext.currentTime;
    note(425,.35,start,{wave:"sine",volume:.12,filter:1800});
    [697,770,697,770,697,770].forEach((f,i)=>note(f,.075,start+.45+i*.105,{wave:"sine",volume:.055,filter:2200}));
    note(425,.5,start+1.25,{wave:"sine",volume:.1,filter:1800});
    for(let i=0;i<13;i++){
      const t=start+1.9+i*.16;
      note(430+Math.random()*1700,.14,t,{wave:i%3===0?"sawtooth":"sine",volume:.035+Math.random()*.025,filter:1200+Math.random()*2200});
      if(i%2===0) note(900+Math.random()*1300,.1,t+.05,{wave:"triangle",volume:.025,filter:2500});
      noiseBurst(.1,.018,t);
    }
    note(880,.12,start+4.1,{wave:"sine",volume:.06,filter:3000});
  }
  function radioStepFn(){
    if(!radioPlaying||!audioContext) return;
    const g=radioGenres[radioGenre], now=audioContext.currentTime, beat=60/g.tempo;
    const root=radioGenre==="vapor"?110:radioGenre==="games"?164.81:130.81;
    const scale=g.scale;
    const step=radioStep++;
    const chordRoot=root*(step%16<8?1:Math.pow(2,2/12));
    if(step%4===0){
      note(chordRoot,beat*3.5,now,{wave:"sine",volume:.035,filter:g.filter});
      note(chordRoot*1.5,beat*3.1,now,{wave:g.wave,volume:.019,filter:g.filter});
    }
    const degree=scale[(step*3+Math.floor(step/7))%scale.length], octave=(step%8===6?2:1);
    note(root*Math.pow(2,degree/12)*octave,beat*.72,now,{wave:g.wave,volume:radioGenre==="vapor"?.035:.025,filter:g.filter});
    if(step%2===0) note(root*.5,beat*.6,now,{wave:"sine",volume:.06,filter:500});
    if(step%4===2){noiseBurst(.07,.012,now);note(root*4,.035,now,{wave:"square",volume:.012,filter:4000});}
    if(radioGenre==="vapor"&&step%8===0){
      note(root*2,beat*7,now,{wave:"sine",volume:.014,filter:700});
      note(root*2.01,beat*7,now,{wave:"triangle",volume:.012,filter:850});
    }
    const bars=$$("#radio-spectrum i");
    bars.forEach((bar,i)=>bar.style.setProperty("--bar",(10+Math.random()*90)+"%"));
    $("#radio-live-state").textContent="PLAY";
    $("#radio-status").textContent="PLAYING · "+g.label;
    $("#radio-track-title").textContent=g.label;
    $("#radio-track-era").textContent="GENERATIVE MIX · SEM FIM · FAIXA "+String(Math.floor(step/32)+1).padStart(2,"0");
    radioTimer=setTimeout(radioStepFn,beat*1000);
  }
  function startRadio(){
    initAudio(); if(!audioContext)return; audioContext.resume();
    radioPlaying=true;radioStart=Date.now()-radioElapsed;$("#radio-play").textContent="Ⅱ";$("#radio-player").classList.add("is-playing");
    if(radioTimer)clearTimeout(radioTimer);radioStepFn();blip(660,.1,.045);
  }
  function pauseRadio(){
    radioPlaying=false;if(radioTimer)clearTimeout(radioTimer);radioElapsed=Date.now()-radioStart;
    $("#radio-live-state").textContent="PAUSE";$("#radio-play").textContent="▶";$("#radio-status").textContent="PAUSED · RETRO MIX";$("#radio-player").classList.remove("is-playing");
  }
  function stopRadio(){
    pauseRadio();radioElapsed=0;radioStep=0;$("#radio-live-state").textContent="STOP";$("#radio-track-title").textContent="WEB ZONE RADIO";$("#radio-track-era").textContent="Escolha sua estação e aperte PLAY";$("#radio-status").textContent="STOPPED · 56K FRIENDLY";$("#radio-player").classList.remove("is-playing");blip(260,.11,.04);
  }
  function renderRadioPlaylist(){
    const list=$("#radio-playlist");list.replaceChildren();
    const tracks={
      vapor:[["Mallsoft / shopping mall","Vaporwave"],["Late night Windows 98","Vaporwave"],["Aqua blue dream","Synthwave"]],
      nineties:[["Nirvana · Smells Like Teen Spirit","1991"],["The Prodigy · Firestarter","1996"],["Eiffel 65 · Blue","1998"]],
      "two-thousands":[["Linkin Park · In the End","2000"],["Avril Lavigne · Complicated","2002"],["Gorillaz · Feel Good Inc.","2005"]],
      games:[["Super Mario 64","Nintendo 64"],["The Sims Build Mode","PC"],["Need for Speed: Underground","PS2 / PC"]],
      br:[["Los Hermanos · Anna Júlia","1999"],["CPM 22 · Dias Atrás","2000"],["Charlie Brown Jr. · Só por uma Noite","2001"]]
    }[radioGenre]||[];
    tracks.forEach(([title,meta])=>{
      const a=document.createElement("a");a.className="radio-track";a.href="https://www.youtube.com/results?search_query="+encodeURIComponent(title+" "+meta+" official audio");a.target="_blank";a.rel="noopener noreferrer";
      const strong=document.createElement("strong");strong.textContent=title;const span=document.createElement("span");span.textContent=meta+" · buscar faixa original ↗";a.append(strong,span);list.append(a);
    });
  }
  $("#radio-station").addEventListener("change",()=>{
    radioGenre=$("#radio-station").value;radioStep=0;
    const g=radioGenres[radioGenre];$("#radio-track-title").textContent=g.label;$("#radio-track-era").textContent="STATION READY · ORIGINAL CONTINUOUS MIX";
    $("#radio-status").textContent="TUNED · "+g.label;renderRadioPlaylist();blip(740,.08,.035);
    if(radioPlaying){pauseRadio();startRadio();}
  });
  $("#radio-play").addEventListener("click",()=>radioPlaying?pauseRadio():startRadio());
  $("#radio-stop").addEventListener("click",stopRadio);
  $("#radio-next").addEventListener("click",()=>{$("#radio-station").selectedIndex=($("#radio-station").selectedIndex+1)%$("#radio-station").options.length;$("#radio-station").dispatchEvent(new Event("change"));});
  $("#radio-prev").addEventListener("click",()=>{$("#radio-station").selectedIndex=($("#radio-station").selectedIndex+$("#radio-station").options.length-1)%$("#radio-station").options.length;$("#radio-station").dispatchEvent(new Event("change"));});
  $("#radio-volume").addEventListener("input",e=>{const value=Number(e.target.value);$("#radio-volume-value").textContent=value+"%";if(masterGain)masterGain.gain.setTargetAtTime(value/100*.24,audioContext.currentTime,.04);});
  $("#radio-sound-toggle").addEventListener("click",()=>{soundEnabled=!soundEnabled;$("#radio-sound-toggle").textContent=soundEnabled?"🔊 Efeitos: ligados":"🔇 Efeitos: desligados";blip(520,.07,.04);});
  $("#radio-classics").addEventListener("click",()=>{const query=classicSearches.map(([song,artist])=>song+" "+artist+" official audio").join(" OR ");window.open("https://www.youtube.com/results?search_query="+encodeURIComponent(query),"webzone-classics","noopener");toast("Busca de músicas clássicas aberta em outra aba.");});
  renderRadioPlaylist();

  // Som de modem no botão conectar, além dos alertas de mensageiro.
  const originalConnect=$("#connect-btn");
  originalConnect.addEventListener("click",()=>{if($("#connection-status").textContent==="discando...")return;dialupSound();});
  document.addEventListener("click",e=>{if(e.target.closest(".retro-button,.quick-links button,.memory-card button,.culture-list button,.decade-switch button"))blip(520+Math.random()*260,.045,.025);});

  // MSN sounds, distinct ICQ client and local simulated chat.
  const msnSkinButtons=$$("[data-messenger-skin]");
  msnSkinButtons.forEach(button=>button.addEventListener("click",()=>{
    const skin=button.dataset.messengerSkin;
    msnSkinButtons.forEach(b=>b.classList.toggle("active",b===button));
    $("#messenger-window").classList.toggle("icq-mode",skin==="icq");
    $(".floating-title span",$("#messenger-window")).textContent=skin==="icq"?"🌼 ICQ-style chat":"💬 MSN Messenger 7.5";
    blip(skin==="icq"?1040:660,.12,.055);
  }));
  $$("#messenger-window [data-contact]").forEach(button=>button.addEventListener("click",()=>blip(730,.07,.04)));
  $("#chat-form").addEventListener("submit",()=>blip(880,.07,.04));
  let icqContact="Neo_1999";
  const icqLog=$("#icq-chat-log");
  const icqReplies=["Uh-oh! You are online!","BRB, my download is at 93%.","Have you seen the new Winamp skin?","Meet me in the IRC channel later.","My connection just dropped. Again.","lol :D"];
  $$("[data-icq-contact]").forEach(button=>button.addEventListener("click",()=>{
    icqContact=button.dataset.icqContact;$("#icq-chat-title").textContent="Chat with "+icqContact;
    const p=document.createElement("p"),b=document.createElement("b");b.textContent="System: ";p.append(b,document.createTextNode("Conversation with "+icqContact+" started."));icqLog.append(p);icqLog.scrollTop=icqLog.scrollHeight;blip(740,.08,.045);
  }));
  $("#icq-chat-form").addEventListener("submit",e=>{
    e.preventDefault();const input=$("#icq-chat-input"),message=input.value.trim();if(!message)return;
    const p=document.createElement("p"),b=document.createElement("b");b.textContent="You: ";p.append(b,document.createTextNode(message));icqLog.append(p);input.value="";icqLog.scrollTop=icqLog.scrollHeight;blip(880,.07,.045);
    setTimeout(()=>{const reply=document.createElement("p"),bold=document.createElement("b");bold.textContent=icqContact+": ";reply.append(bold,document.createTextNode(icqReplies[Math.floor(Math.random()*icqReplies.length)]));icqLog.append(reply);icqLog.scrollTop=icqLog.scrollHeight;blip(1040,.11,.055);toast("💬 "+icqContact+" enviou uma mensagem.");},700+Math.random()*1100);
  });
  $("#icq-status").addEventListener("click",e=>{const states=["🟢 Available","🌙 Away","⛔ Do not disturb","🔴 Invisible"];const current=states.indexOf(e.currentTarget.textContent);e.currentTarget.textContent=states[(current+1)%states.length];blip(600,.08,.04);});
  $("#icq-add-contact").addEventListener("click",()=>toast("UIN de exemplo: 1042000. Esta lista é uma simulação local."));
  $("#icq-sound-test").addEventListener("click",()=>{initAudio();if(soundEnabled){blip(1180,.09,.08);setTimeout(()=>blip(880,.13,.08),120);}});
  $$(".floating-title").forEach(bar=>{const win=bar.closest(".floating-window");if(!win)return;const id=win.id;const button=bar.querySelector("[data-minimize]");if(button)button.addEventListener("click",e=>{e.stopPropagation();win.classList.toggle("minimized");});});

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