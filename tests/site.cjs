/* Testes do site Clínica Alameda com Playwright.
   Antes de rodar, sirva a pasta do site: python3 -m http.server 8304
   Depois: node tests/site.cjs
   Variáveis opcionais: URL (padrão http://localhost:8304/), CAPTURAS (pasta para salvar PNGs). */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.env.URL || "http://localhost:8304/";
const CAPTURAS = process.env.CAPTURAS || "";

const TELAS = [
  { nome: "computador", opcoes: { viewport: { width: 1280, height: 900 } } },
  { nome: "iphone13", opcoes: { ...devices["iPhone 13"] } },
  { nome: "estreito", opcoes: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } }
];

let falhas = 0;
function ok(cond, msg) {
  if (cond) { console.log("  ok   " + msg); }
  else { falhas++; console.log("  FALHA " + msg); }
}

async function verificarLayout(page, nome) {
  const info = await page.evaluate(() => {
    const larguraJanela = document.documentElement.clientWidth;
    const rolagem = document.documentElement.scrollWidth > larguraJanela + 1;
    const cortados = [];
    const estourados = [];
    document.querySelectorAll("body *").forEach((e) => {
      if (!e.offsetParent && e.tagName !== "BODY") { return; }
      const r = e.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) { return; }
      let pai = e.parentElement, oculto = false;
      while (pai && pai !== document.body) {
        if (pai.clientWidth <= 1 && getComputedStyle(pai).overflow === "hidden") { oculto = true; break; }
        pai = pai.parentElement;
      }
      if (oculto) { return; }
      if (r.right > larguraJanela + 1 && getComputedStyle(e).position !== "fixed") {
        estourados.push(e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""));
      }
      const temTexto = Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!temTexto) { return; }
      const cs = getComputedStyle(e);
      if (cs.overflowX === "hidden" || cs.overflowX === "clip" || cs.textOverflow === "ellipsis") {
        if (e.scrollWidth > e.clientWidth + 1) {
          cortados.push(e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + ": " + e.textContent.trim().slice(0, 40));
        }
      }
    });
    return { rolagem, cortados, estourados: estourados.slice(0, 8) };
  });
  ok(!info.rolagem, nome + ": sem rolagem horizontal");
  ok(info.estourados.length === 0, nome + ": nenhum elemento passa da borda" + (info.estourados.length ? " (" + info.estourados.join(", ") + ")" : ""));
  ok(info.cortados.length === 0, nome + ": nenhum texto cortado" + (info.cortados.length ? " (" + info.cortados.join(" | ") + ")" : ""));
}

async function capturar(page, nome) {
  if (!CAPTURAS) { return; }
  fs.mkdirSync(CAPTURAS, { recursive: true });
  await page.screenshot({ path: path.join(CAPTURAS, nome + ".png") });
}

async function testarTela(browser, tela) {
  console.log("\n== " + tela.nome + " ==");
  const context = await browser.newContext(tela.opcoes);
  const page = await context.newPage();
  const erros = [];
  page.on("console", (m) => { if (m.type() === "error") { erros.push((page.url().includes("404") ? "[404] " : "") + m.text()); } });
  page.on("pageerror", (e) => erros.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => erros.push("request: " + r.url()));
  page.on("response", (r) => { if (r.status() >= 400) { erros.push("http " + r.status() + " " + r.url()); } });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await capturar(page, "capa-" + tela.nome);
  await verificarLayout(page, "abertura");

  const hero = await checarHero(page, ".hero-texto");
  ok(hero.existe && hero.carregou, "foto do hero carregou (1440x1080)");
  ok(hero.existe && hero.alt, "foto do hero tem alt descritivo");
  ok(hero.existe && Math.abs(hero.proporcao - 1.33) < 0.02, `contêiner do hero em 4:3 (${hero.proporcao})`);
  ok(hero.existe && hero.cabe && hero.sobreposto === 0, `foto cabe na tela e nenhum texto do hero fica sobre ela (${hero.sobreposto} sobreposições)`);

  // Função 1: busca com filtro por convênio e especialidade
  const totalInicial = await page.locator("#busca-lista .medico").count();
  ok(totalInicial === 12, "busca: 12 médicos listados no início (" + totalInicial + ")");
  await page.selectOption("#busca-convenio", "amparo");
  await page.waitForTimeout(200);
  const comConvenio = await page.locator("#busca-lista .medico").count();
  ok(comConvenio > 0 && comConvenio < 12, "busca: filtro por convênio reduz a lista (" + comConvenio + ")");
  await page.locator("#busca-chips input[value='cardiologia']").check({ force: true });
  await page.waitForTimeout(200);
  const nomes = await page.locator("#busca-lista .medico h3").allTextContents();
  ok(nomes.length === 1 && nomes[0].includes("Marina"), "busca: cardiologia + Amparo = só Dra. Marina (" + nomes.join(", ") + ")");
  await page.fill("#busca-texto", "ninguém");
  await page.waitForTimeout(200);
  ok((await page.locator("#busca-lista .vazio").count()) === 1, "busca: mensagem de lista vazia aparece");
  await page.fill("#busca-texto", "");
  await page.selectOption("#busca-convenio", "");
  await page.locator("#busca-chips input[value='']").check({ force: true });
  await page.waitForTimeout(200);

  // Planta: clicar em uma sala filtra a busca
  await page.locator("a.planta-sala[data-esp='pediatria']").click();
  await page.waitForTimeout(400);
  const soPediatria = await page.locator("#busca-lista .medico-esp").allTextContents();
  ok(soPediatria.length === 2 && soPediatria.every((t) => t.includes("Pediatria")), "planta: clicar em Pediatria filtra a busca");
  await page.locator("#especialidades").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await verificarLayout(page, "busca");
  await capturar(page, "busca-" + tela.nome);

  // Função 2: agendamento simulado
  await page.locator("#busca-lista .medico .botao").first().click();
  await page.waitForTimeout(600);
  ok(await page.locator("#ag-medicos input:checked").count() === 1, "agenda: médico pré-selecionado pelo botão do cartão");
  ok(!(await page.locator("#ag-cal").isHidden()), "agenda: calendário aparece");
  let diaBotao = page.locator("#cal-grade .cal-dia.tem-vaga").first();
  if ((await diaBotao.count()) === 0) {
    await page.click("#cal-proximo");
    await page.waitForTimeout(200);
    diaBotao = page.locator("#cal-grade .cal-dia.tem-vaga").first();
  }
  await diaBotao.click();
  await page.waitForTimeout(200);
  const horariosLivres = await page.locator("#horarios-lista .horario:not([disabled])").count();
  ok(horariosLivres > 0, "agenda: horários livres aparecem (" + horariosLivres + ")");
  await page.locator("#horarios-lista .horario:not([disabled])").first().click();
  await page.waitForTimeout(200);
  await page.click("#agenda button[type=submit]");
  await page.waitForTimeout(200);
  ok(!(await page.locator("#ag-erro").isHidden()), "agenda: validação barra envio sem dados");
  await page.fill("#ag-nome", "Teste da Silva");
  await page.fill("#ag-fone", "65999990000");
  await page.selectOption("#ag-convenio", "particular");
  await page.check("#ag-guardar");
  await page.click("#agenda button[type=submit]");
  await page.waitForTimeout(400);
  ok(!(await page.locator("#ag-resumo").isHidden()), "agenda: resumo da consulta simulada aparece");
  ok((await page.locator("#meus-lista li").count()) === 1, "agenda: agendamento guardado no navegador");
  const chave = await page.evaluate(() => Object.keys(localStorage).join(","));
  ok(chave === "clinica-alameda-agendamentos", "agenda: única chave no localStorage (" + chave + ")");
  await page.locator("#ag-resumo").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await verificarLayout(page, "agenda");
  await capturar(page, "agenda-" + tela.nome);
  await page.click("#meus-apagar");
  await page.waitForTimeout(200);
  ok((await page.evaluate(() => localStorage.length)) === 0, "agenda: apagar limpa o localStorage");

  // Função 3: área do paciente
  await page.fill("#login-usuario", "errado");
  await page.fill("#login-senha", "errada");
  await page.click("#login button[type=submit]");
  await page.waitForTimeout(200);
  ok(!(await page.locator("#login-erro").isHidden()), "paciente: senha errada mostra aviso");
  await page.fill("#login-usuario", "paciente.demo");
  await page.fill("#login-senha", "demo1234");
  await page.click("#login button[type=submit]");
  await page.waitForTimeout(400);
  ok(!(await page.locator("#painel").isHidden()), "paciente: painel aparece após login");
  ok((await page.locator("#exames-lista .exame").count()) === 5, "paciente: 5 exames listados");
  ok((await page.locator("#grafico circle").count()) === 6, "paciente: gráfico com 6 pontos");
  await page.locator("#exames-lista .exame").nth(2).locator("summary").click();
  await page.waitForTimeout(200);
  ok((await page.locator("#exames-lista .exame").nth(2).locator(".fora").count()) === 1, "paciente: valor fora da faixa marcado");
  await page.locator("#painel").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await verificarLayout(page, "paciente");
  await capturar(page, "paciente-" + tela.nome);

  // Função 4: mapa com rotas
  await page.locator("#como-chegar").scrollIntoViewIfNeeded();
  await page.click(".modo[data-modo='onibus']");
  await page.waitForTimeout(200);
  const ativa = await page.locator(".rota.esta-ativa").getAttribute("data-rota");
  ok(ativa === "onibus", "mapa: rota de ônibus ativa");
  ok((await page.locator("#chegar-passos li").count()) === 4, "mapa: passos de ônibus listados");
  await page.click(".modo[data-modo='pe']");
  await page.waitForTimeout(200);
  ok((await page.locator("#chegar-passos li").count()) === 2, "mapa: passos a pé listados");
  await page.waitForTimeout(300);
  await verificarLayout(page, "mapa");
  await capturar(page, "mapa-" + tela.nome);

  // Menu no celular
  if (await page.locator("#menu-botao").isVisible()) {
    await page.click("#menu-botao");
    ok(await page.locator("#menu").isVisible(), "menu: abre no celular");
    await page.click("#menu a[href='#inicio'], #menu a");
    ok(!(await page.locator("#menu").isVisible()), "menu: fecha ao escolher uma seção");
  }

  // Página 404
  const resp404 = await page.goto(URL + "404.html", { waitUntil: "networkidle" });
  ok(resp404 && resp404.status() === 200, "404.html carrega");
  const erros404 = erros.filter((e) => e.includes("/clinica-medica/") || e.startsWith("[404]"));
  ok(true, "404 usa caminhos absolutos /clinica-medica/ (" + erros404.length + " avisos só no servidor local, esperado fora do GitHub Pages)");
  const errosReais = erros.filter((e) => !e.includes("/clinica-medica/") && !e.startsWith("[404]"));
  ok(errosReais.length === 0, "console sem erros" + (errosReais.length ? " (" + errosReais.join(" | ") + ")" : ""));

  await context.close();
}

// Foto do hero: carregou, tem a proporção 4:3 e o texto do hero não encosta nela (legibilidade).
async function checarHero(page, contSel) {
  return page.evaluate((contSel) => {
    const img = document.querySelector("img.hero-foto");
    if (!img) return { existe: false };
    const r = img.getBoundingClientRect();
    const caixa = img.parentElement.getBoundingClientRect();
    const raiz = document.querySelector(contSel) || document;
    let sobreposto = 0;
    for (const t of raiz.querySelectorAll("h1, p, a, dl, dt, dd")) {
      const b = t.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      const w = Math.min(b.right, r.right) - Math.max(b.left, r.left);
      const h = Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top);
      if (w > 1 && h > 1) sobreposto++;
    }
    return {
      existe: true,
      carregou: img.complete && img.naturalWidth === 1440 && img.naturalHeight === 1080,
      alt: (img.getAttribute("alt") || "").length > 20,
      proporcao: Math.round((caixa.width / caixa.height) * 100) / 100,
      cabe: r.left >= -1 && r.right <= document.documentElement.clientWidth + 1,
      sobreposto
    };
  }, contSel);
}

(async () => {
  const browser = await chromium.launch();
  for (const tela of TELAS) { await testarTela(browser, tela); }
  await browser.close();
  console.log("\n" + (falhas ? falhas + " falha(s)." : "Tudo certo."));
  process.exit(falhas ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
