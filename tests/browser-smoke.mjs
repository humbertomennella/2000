import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { chromium } from "playwright";
import assert from "node:assert/strict";

const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml"};
const server=createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
  const relative=pathname==="/"?"index.html":pathname.replace(/^\/+/, "");
  const file=resolve(root,relative);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end("Forbidden");return;}
  if(!existsSync(file)){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"content-type":mime[extname(file)]||"application/octet-stream"});
  res.end(readFileSync(file));
});
await new Promise(resolveListen=>server.listen(4173,"127.0.0.1",resolveListen));
let browser;
try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const pageErrors=[];
  page.on("pageerror",error=>pageErrors.push(error.message));
  await page.route("**/*",route=>{
    const url=new URL(route.request().url());
    if(url.origin==="http://127.0.0.1:4173")route.continue();
    else route.abort();
  });
  await page.goto("http://127.0.0.1:4173",{waitUntil:"domcontentloaded"});
  await page.waitForSelector("#news-grid .news-card");

  assert.ok(await page.locator("#taskbar-clock").textContent(),"taskbar clock should render");
  await page.locator("#start-button").click();
  assert.equal(await page.locator("#start-menu").evaluate(el=>!el.classList.contains("hidden")),true,"Start menu should open");
  await page.locator("#start-menu [data-open='messenger-window']").click();
  assert.equal(await page.locator("#messenger-window").evaluate(el=>!el.classList.contains("hidden")),true,"MSN window should open");
  await page.locator("#messenger-window [data-contact='Bia_xD']").click();
  await page.locator("#chat-input").fill("smoke test MSN");
  await page.locator("#chat-form button").click();
  assert.ok((await page.locator("#chat-log").innerText()).includes("smoke test MSN"),"MSN should append sent messages");
  await page.locator("#msn-nudge").click();
  assert.equal(await page.locator("#messenger-window").evaluate(el=>el.classList.contains("nudge-shake")),true,"MSN attention should animate");

  await page.locator(".quick-links [data-open='icq-window']").click();
  page.once("dialog",dialog=>dialog.accept("smoke_contact"));
  await page.locator("#icq-add-contact").click();
  assert.equal(await page.locator("[data-icq-contact='smoke_contact']").count(),1,"ICQ should add contacts");
  await page.locator("#icq-chat-input").fill("smoke test ICQ");
  await page.locator("#icq-chat-form button").click();
  assert.ok((await page.locator("#icq-chat-log").innerText()).includes("smoke test ICQ"),"ICQ should append sent messages");
  await page.locator("#icq-nudge").click();

  await page.locator(".quick-links [data-open='chat-room-window']").click();
  await page.locator("#window-room-input").fill("smoke test sala");
  await page.locator("#window-room-form button[type='submit']").click();
  assert.ok((await page.locator("#window-room-log").innerText()).includes("smoke test sala"),"floating chat should append sent messages");
  await page.locator("#window-room-nudge").click();

  const initialMood=await page.locator("#mood-face").innerText();
  await page.locator("#mood-select").selectOption("ಠ_ಠ");
  assert.equal(await page.locator("#mood-face").innerText(),initialMood,"mood should not update before saving");
  await page.locator("#mood-save").click();
  assert.equal(await page.locator("#mood-face").innerText(),"ಠ_ಠ","mood should update on save");
  await page.locator("#guest-name").fill("browser_test");
  await page.locator("#guest-url").fill("https://example.com");
  await page.locator("#guest-message").fill("guestbook smoke test");
  await page.locator("#guestbook-form button").click();
  assert.ok((await page.locator("#guestbook-entries").innerText()).includes("guestbook smoke test"),"guestbook should render submitted entries");

  await page.locator(".quick-links [data-open='browser-window']").click();
  await page.locator("#browser-favorite").click();
  await page.locator("#browser-bookmarks-toggle").click();
  assert.ok((await page.locator("#browser-favorites-list").innerText()).includes("webzone2000.com"),"browser favorites should show saved page");
  await page.locator("#browser-page [data-page='history']").click();
  assert.ok((await page.locator("#browser-address").inputValue()).includes("arquivo-historico.org"),"browser internal navigation should work");
  await page.locator("#browser-back").click();
  assert.ok((await page.locator("#browser-address").inputValue()).includes("webzone2000.com"),"browser back should restore previous page");

  await page.locator("#global-sound-volume").evaluate(el=>{el.value="35";el.dispatchEvent(new Event("input",{bubbles:true}));});
  assert.equal(await page.evaluate(()=>localStorage.getItem("webzone-sound-level")),"0.35","global sound volume should persist");
  await page.locator(".quick-links [data-open='profile-window']").click();
  await page.locator("#profile-edit-name").fill("perfil_teste");
  await page.locator("#profile-quote").fill("frase de teste");
  await page.locator("#profile-edit-form button[type='submit']").click();
  assert.equal(await page.locator("#profile-window-name").innerText(),"perfil_teste","profile changes should render");
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem("webzone-personal-profile")).quote),"frase de teste","profile changes should persist");

  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.locator("#desktop-taskbar").isVisible(),"taskbar should remain visible on mobile");
  assert.ok(await page.locator("#museu-web").isVisible(),"museum section should render on mobile");
  assert.deepEqual(pageErrors,[],"no uncaught JavaScript errors should occur");
  console.log("WEB ZONE browser smoke tests passed (MSN, ICQ, chat room, mood, guestbook, browser, sound, profile, mobile).");
}finally{
  if(browser)await browser.close();
  await new Promise(resolveClose=>server.close(resolveClose));
}
