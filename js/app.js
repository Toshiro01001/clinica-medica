/* Clínica Alameda: comportamento do site. Tudo roda no navegador; nada é enviado para fora. */
(function () {
  "use strict";

  var D = window.CLINICA;
  if (!D) { return; }

  var CHAVE_LOCAL = "clinica-alameda-agendamentos";
  var DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var DIAS_LONGOS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  /* ---------- utilidades ---------- */
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  function el(tag, attrs, filhos) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") { n.textContent = attrs[k]; }
        else if (k === "class") { n.className = attrs[k]; }
        else if (k === "html") { n.innerHTML = attrs[k]; }
        else if (attrs[k] === false || attrs[k] === null || attrs[k] === undefined) { return; }
        else { n.setAttribute(k, attrs[k] === true ? "" : attrs[k]); }
      });
    }
    (filhos || []).forEach(function (f) {
      if (f === null || f === undefined) { return; }
      n.appendChild(typeof f === "string" ? document.createTextNode(f) : f);
    });
    return n;
  }

  function svgEl(tag, attrs) {
    var n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") { n.textContent = attrs[k]; } else { n.setAttribute(k, attrs[k]); }
    });
    return n;
  }

  function limpar(n) { while (n.firstChild) { n.removeChild(n.firstChild); } }

  function normalizar(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function porId(lista, id) {
    for (var i = 0; i < lista.length; i++) { if (lista[i].id === id) { return lista[i]; } }
    return null;
  }

  function nomeEsp(id) { var e = porId(D.especialidades, id); return e ? e.nome : id; }
  function nomeConv(id) { var c = porId(D.convenios, id); return c ? c.nome : id; }

  function dois(n) { return (n < 10 ? "0" : "") + n; }
  function dataISO(d) { return d.getFullYear() + "-" + dois(d.getMonth() + 1) + "-" + dois(d.getDate()); }
  function dataBR(d) { return dois(d.getDate()) + "/" + dois(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function diasTexto(dias) {
    return dias.map(function (d) { return DIAS_SEMANA[d]; }).join(", ");
  }

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }

  function formatarValor(v) {
    return String(v).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /* ---------- menu ---------- */
  (function menu() {
    var botao = $("#menu-botao");
    var menu = $("#menu");
    if (!botao || !menu) { return; }
    botao.addEventListener("click", function () {
      var aberto = menu.classList.toggle("esta-aberto");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("esta-aberto");
        botao.setAttribute("aria-expanded", "false");
      });
    });
  })();

  /* ---------- planta (seção de especialidades) ---------- */
  var planta = $("#planta");
  if (planta) {
    $$("a.planta-sala", planta).forEach(function (sala) {
      sala.addEventListener("click", function () {
        var esp = sala.getAttribute("data-esp");
        $$("a.planta-sala", planta).forEach(function (s) { s.classList.remove("esta-ativa"); });
        sala.classList.add("esta-ativa");
        selecionarEspBusca(esp);
      });
    });
  }

  /* ---------- busca de médicos ---------- */
  var buscaForm = $("#busca");
  var buscaTexto = $("#busca-texto");
  var buscaConv = $("#busca-convenio");
  var buscaChips = $("#busca-chips");
  var buscaResumo = $("#busca-resumo");
  var buscaLista = $("#busca-lista");

  function selecionarEspBusca(esp) {
    var radio = buscaChips && buscaChips.querySelector('input[value="' + esp + '"]');
    if (radio) { radio.checked = true; }
    if (buscaTexto) { buscaTexto.value = ""; }
    renderBusca();
  }

  if (buscaForm) {
    D.convenios.forEach(function (c) { buscaConv.appendChild(el("option", { value: c.id, text: c.nome })); });
    D.especialidades.forEach(function (e) {
      buscaChips.appendChild(el("label", { class: "chip" }, [
        el("input", { type: "radio", name: "esp", value: e.id }),
        el("span", { text: e.nome })
      ]));
    });
    buscaForm.addEventListener("submit", function (ev) { ev.preventDefault(); renderBusca(); });
    buscaForm.addEventListener("input", renderBusca);
    buscaForm.addEventListener("change", renderBusca);
    renderBusca();
  }

  function filtrarMedicos() {
    var texto = normalizar(buscaTexto.value.trim());
    var conv = buscaConv.value;
    var espSel = buscaChips.querySelector("input:checked");
    var esp = espSel ? espSel.value : "";
    return D.medicos.filter(function (m) {
      if (esp && m.esp !== esp) { return false; }
      if (conv && m.convenios.indexOf(conv) < 0) { return false; }
      if (texto) {
        var alvo = normalizar(m.nome + " " + nomeEsp(m.esp));
        if (alvo.indexOf(texto) < 0) { return false; }
      }
      return true;
    });
  }

  function renderBusca() {
    var lista = filtrarMedicos();
    var conv = buscaConv.value;
    limpar(buscaLista);
    if (lista.length === 0) {
      buscaResumo.textContent = "Nenhum médico encontrado com esses filtros.";
      buscaLista.appendChild(el("li", { class: "vazio" }, [
        el("p", { text: "Não encontramos ninguém com essa combinação. Tente outra especialidade, limpe o texto da busca ou escolha \"Todos os convênios\"." })
      ]));
      return;
    }
    buscaResumo.textContent = lista.length === 1
      ? "1 médico encontrado."
      : lista.length + " médicos encontrados" + (lista.length === D.medicos.length ? ", toda a equipe." : ".");
    lista.forEach(function (m) {
      var iniciais = m.nome.replace(/^Dr[a]?\.\s*/, "").split(" ").map(function (p) { return p[0]; }).slice(0, 2).join("");
      var botao = el("button", { type: "button", class: "botao botao-secundario", text: "Agendar consulta" });
      botao.addEventListener("click", function () { irParaAgenda(m); });
      buscaLista.appendChild(el("li", { class: "medico" }, [
        el("div", { class: "medico-topo" }, [
          el("span", { class: "medico-inicial", "aria-hidden": "true", text: iniciais }),
          el("div", null, [
            el("h3", { text: m.nome }),
            el("p", { class: "medico-esp", text: nomeEsp(m.esp) + " · " + m.registro })
          ])
        ]),
        el("ul", { class: "medico-lista", "aria-label": "Convênios aceitos" }, m.convenios.map(function (c) {
          return el("li", { class: c === conv ? "esta-marcado" : "", text: nomeConv(c) });
        })),
        el("p", { class: "medico-dias", text: "Atende " + diasTexto(m.dias) + ", das " + m.turno[0] + "h às " + m.turno[1] + "h." }),
        botao
      ]));
    });
  }

  /* ---------- agendamento ---------- */
  var agenda = $("#agenda");
  var agEsp = $("#ag-esp");
  var agMedicos = $("#ag-medicos");
  var agCal = $("#ag-cal");
  var agCalAjuda = $("#ag-cal-ajuda");
  var calMes = $("#cal-mes");
  var calGrade = $("#cal-grade");
  var agHorarios = $("#ag-horarios");
  var horariosLista = $("#horarios-lista");
  var agErro = $("#ag-erro");
  var agResumo = $("#ag-resumo");
  var agConvenio = $("#ag-convenio");

  var estado = { medico: null, mesVisto: null, dia: null, hora: null };
  var hoje = new Date(); hoje.setHours(0, 0, 0, 0);

  function passo(n, pronto) {
    var li = $("#passo-" + n);
    if (!li) { return; }
    li.classList.toggle("esta-bloqueado", !pronto);
  }
  function marcarPronto(n, pronto) {
    var li = $("#passo-" + n);
    if (li) { li.classList.toggle("esta-pronto", !!pronto); }
  }

  if (agenda) {
    D.especialidades.forEach(function (e) { agEsp.appendChild(el("option", { value: e.id, text: e.nome })); });
    agConvenio.appendChild(el("option", { value: "", text: "Escolha o convênio" }));
    D.convenios.forEach(function (c) { agConvenio.appendChild(el("option", { value: c.id, text: c.nome })); });

    agEsp.addEventListener("change", function () { escolherEsp(agEsp.value); });
    $("#cal-anterior").addEventListener("click", function () { mudarMes(-1); });
    $("#cal-proximo").addEventListener("click", function () { mudarMes(1); });
    agenda.addEventListener("submit", confirmarAgendamento);
    $("#meus-apagar").addEventListener("click", function () {
      try { localStorage.removeItem(CHAVE_LOCAL); } catch (e) { /* sem armazenamento */ }
      renderMeus();
    });
    renderMeus();
  }

  function irParaAgenda(m) {
    agEsp.value = m.esp;
    escolherEsp(m.esp, m.id);
    var alvo = $("#agendar");
    if (alvo) { alvo.scrollIntoView({ behavior: "smooth", block: "start" }); }
    var radio = agMedicos.querySelector('input[value="' + m.id + '"]');
    if (radio) { radio.focus({ preventScroll: true }); }
  }

  function escolherEsp(esp, medicoPre) {
    estado.medico = null; estado.dia = null; estado.hora = null;
    agResumo.hidden = true;
    marcarPronto(1, !!esp);
    limpar(agMedicos);
    agMedicos.appendChild(el("legend", { class: "campo-rotulo", text: "Com quem você quer consultar?" }));
    if (!esp) {
      agMedicos.appendChild(el("p", { class: "passo-ajuda", text: "Escolha a especialidade primeiro." }));
      passo(2, false); passo(3, false); passo(4, false);
      return;
    }
    var lista = D.medicos.filter(function (m) { return m.esp === esp; });
    lista.forEach(function (m) {
      var input = el("input", { type: "radio", name: "medico", value: m.id });
      input.addEventListener("change", function () { escolherMedico(m); });
      agMedicos.appendChild(el("label", { class: "opcao" }, [
        input,
        el("span", { class: "opcao-corpo" }, [
          el("span", { class: "opcao-marca", "aria-hidden": "true" }),
          el("span", null, [
            el("span", { class: "opcao-nome", text: m.nome }),
            el("br"),
            el("span", { class: "opcao-sub", text: "Atende " + diasTexto(m.dias) + ", " + m.turno[0] + "h às " + m.turno[1] + "h. Convênios: " + m.convenios.map(nomeConv).join(", ") + "." })
          ])
        ])
      ]));
    });
    passo(2, true); passo(3, false); passo(4, false);
    marcarPronto(2, false); marcarPronto(3, false);
    agCal.hidden = true; agHorarios.hidden = true; agCalAjuda.hidden = false;
    agCalAjuda.textContent = "Escolha o médico primeiro.";
    if (medicoPre) {
      var r = agMedicos.querySelector('input[value="' + medicoPre + '"]');
      if (r) { r.checked = true; escolherMedico(porId(D.medicos, medicoPre)); }
    }
  }

  function escolherMedico(m) {
    estado.medico = m; estado.dia = null; estado.hora = null;
    agResumo.hidden = true;
    marcarPronto(2, true); marcarPronto(3, false);
    estado.mesVisto = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    passo(3, true); passo(4, false);
    agCalAjuda.hidden = true;
    agCal.hidden = false;
    agHorarios.hidden = true;
    renderCalendario();
  }

  function mudarMes(delta) {
    var novo = new Date(estado.mesVisto.getFullYear(), estado.mesVisto.getMonth() + delta, 1);
    var limiteInf = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    var limiteSup = new Date(hoje.getFullYear(), hoje.getMonth() + 3, 1);
    if (novo < limiteInf || novo > limiteSup) { return; }
    estado.mesVisto = novo;
    renderCalendario();
  }

  function renderCalendario() {
    var m = estado.medico;
    var mes = estado.mesVisto;
    calMes.textContent = MESES[mes.getMonth()] + " de " + mes.getFullYear();
    $("#cal-anterior").disabled = mes.getMonth() === hoje.getMonth() && mes.getFullYear() === hoje.getFullYear();
    var limiteSup = new Date(hoje.getFullYear(), hoje.getMonth() + 3, 1);
    $("#cal-proximo").disabled = mes >= limiteSup;
    limpar(calGrade);
    ["D", "S", "T", "Q", "Q", "S", "S"].forEach(function (d, i) {
      calGrade.appendChild(el("span", { class: "cal-dia-semana", "aria-hidden": "true", text: d }));
    });

    var primeiro = new Date(mes.getFullYear(), mes.getMonth(), 1);
    var total = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    for (var v = 0; v < primeiro.getDay(); v++) { calGrade.appendChild(el("span", { class: "cal-vazio", "aria-hidden": "true" })); }
    for (var d = 1; d <= total; d++) {
      var data = new Date(mes.getFullYear(), mes.getMonth(), d);
      var atende = m.dias.indexOf(data.getDay()) >= 0 && data > hoje;
      var b = el("button", {
        type: "button",
        class: "cal-dia" + (atende ? " tem-vaga" : ""),
        disabled: !atende,
        "aria-pressed": estado.dia && dataISO(estado.dia) === dataISO(data) ? "true" : "false",
        "aria-label": d + " de " + MESES[mes.getMonth()] + ", " + DIAS_LONGOS[data.getDay()] + (atende ? ", com horários" : ", sem atendimento"),
        text: String(d)
      });
      if (atende) {
        (function (dt) { b.addEventListener("click", function () { escolherDia(dt); }); })(data);
      }
      calGrade.appendChild(b);
    }
  }

  function gerarHorarios(m, dia) {
    var lista = [];
    for (var h = m.turno[0]; h < m.turno[1]; h++) {
      ["00", "30"].forEach(function (min) {
        var hora = dois(h) + ":" + min;
        var ocupado = hash(m.id + dataISO(dia) + hora) % 3 === 0;
        lista.push({ hora: hora, ocupado: ocupado });
      });
    }
    return lista;
  }

  function escolherDia(dia) {
    estado.dia = dia; estado.hora = null;
    agResumo.hidden = true;
    $$(".cal-dia", calGrade).forEach(function (b) {
      b.setAttribute("aria-pressed", b.textContent === String(dia.getDate()) ? "true" : "false");
    });
    limpar(horariosLista);
    var horarios = gerarHorarios(estado.medico, dia);
    var livres = 0;
    horarios.forEach(function (h) {
      var b = el("button", {
        type: "button", class: "horario", role: "radio", "aria-checked": "false",
        disabled: h.ocupado, "aria-label": h.hora + (h.ocupado ? ", ocupado" : ""), text: h.hora
      });
      if (!h.ocupado) {
        livres++;
        b.addEventListener("click", function () { escolherHora(h.hora, b); });
      }
      horariosLista.appendChild(b);
    });
    $("#horarios-rotulo").textContent = "Horários em " + dataBR(dia) + " (" + livres + " livres)";
    agHorarios.hidden = false;
    passo(4, false); marcarPronto(3, false);
  }

  function escolherHora(hora, botao) {
    estado.hora = hora;
    $$(".horario", horariosLista).forEach(function (b) { b.setAttribute("aria-checked", "false"); });
    botao.setAttribute("aria-checked", "true");
    marcarPronto(3, true);
    passo(4, true);
  }

  function confirmarAgendamento(ev) {
    ev.preventDefault();
    var nome = $("#ag-nome").value.trim();
    var fone = $("#ag-fone").value.replace(/\D/g, "");
    var conv = agConvenio.value;
    var problemas = [];
    if (!estado.medico || !estado.dia || !estado.hora) { problemas.push("escolha médico, dia e horário"); }
    if (nome.length < 3) { problemas.push("escreva seu nome completo"); }
    if (fone.length < 10 || fone.length > 11) { problemas.push("informe um telefone com DDD (10 ou 11 números)"); }
    if (!conv) { problemas.push("escolha o convênio"); }
    else if (estado.medico && estado.medico.convenios.indexOf(conv) < 0) { problemas.push(estado.medico.nome + " não atende pelo " + nomeConv(conv) + "; escolha outro convênio ou outro médico"); }
    if (problemas.length) {
      agErro.textContent = "Falta pouco: " + problemas.join("; ") + ".";
      agErro.hidden = false;
      agErro.setAttribute("tabindex", "-1");
      agErro.focus();
      return;
    }
    agErro.hidden = true;
    var codigo = "ALM-" + hash(nome + dataISO(estado.dia) + estado.hora).toString(36).toUpperCase().slice(0, 6);
    var registro = {
      codigo: codigo, medico: estado.medico.nome, esp: nomeEsp(estado.medico.esp),
      data: dataBR(estado.dia), diaSemana: DIAS_LONGOS[estado.dia.getDay()], hora: estado.hora,
      nome: nome, convenio: nomeConv(conv)
    };
    limpar(agResumo);
    agResumo.appendChild(el("h3", { text: "Consulta simulada marcada, " + nome.split(" ")[0] + "." }));
    agResumo.appendChild(el("dl", null, [
      el("dt", { text: "Código" }), el("dd", { text: registro.codigo }),
      el("dt", { text: "Especialidade" }), el("dd", { text: registro.esp }),
      el("dt", { text: "Médico" }), el("dd", { text: registro.medico }),
      el("dt", { text: "Quando" }), el("dd", { text: registro.diaSemana + ", " + registro.data + " às " + registro.hora }),
      el("dt", { text: "Convênio" }), el("dd", { text: registro.convenio }),
      el("dt", { text: "Telefone" }), el("dd", { text: "(" + fone.slice(0, 2) + ") " + fone.slice(2, fone.length - 4) + "-" + fone.slice(-4) })
    ]));
    agResumo.appendChild(el("p", { class: "legenda", text: "Isto é uma demonstração: nenhuma consulta foi marcada de verdade e nenhum dado saiu do seu navegador. Em um site real, você receberia a confirmação por mensagem." }));
    agResumo.hidden = false;
    agResumo.setAttribute("tabindex", "-1");
    agResumo.focus();

    if ($("#ag-guardar").checked) {
      var guardados = lerMeus();
      guardados.push(registro);
      try { localStorage.setItem(CHAVE_LOCAL, JSON.stringify(guardados)); } catch (e) { /* sem armazenamento */ }
      renderMeus();
    }
  }

  function lerMeus() {
    try {
      var bruto = localStorage.getItem(CHAVE_LOCAL);
      var lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (e) { return []; }
  }

  function renderMeus() {
    var caixa = $("#meus");
    var ul = $("#meus-lista");
    if (!caixa) { return; }
    var lista = lerMeus();
    limpar(ul);
    caixa.hidden = lista.length === 0;
    lista.forEach(function (r, i) {
      var cancelar = el("button", { type: "button", text: "Cancelar", "aria-label": "Cancelar agendamento " + r.codigo });
      cancelar.addEventListener("click", function () {
        var atual = lerMeus(); atual.splice(i, 1);
        try { localStorage.setItem(CHAVE_LOCAL, JSON.stringify(atual)); } catch (e) { /* sem armazenamento */ }
        renderMeus();
      });
      ul.appendChild(el("li", null, [
        el("span", { text: r.codigo + " · " + r.esp + " com " + r.medico + ", " + r.data + " às " + r.hora }),
        cancelar
      ]));
    });
  }

  /* ---------- área do paciente ---------- */
  var login = $("#login");
  if (login) {
    login.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = $("#login-usuario").value.trim();
      var s = $("#login-senha").value;
      var erro = $("#login-erro");
      if (u !== D.acesso.usuario || s !== D.acesso.senha) {
        erro.textContent = "Usuário ou senha não conferem. Use os dados de demonstração ao lado.";
        erro.hidden = false;
        return;
      }
      erro.hidden = true;
      $("#login-senha").value = "";
      entrarPainel();
    });
    $("#sair").addEventListener("click", function () {
      $("#painel").hidden = true;
      $("#paciente-entrada").hidden = false;
      $("#login-usuario").value = "";
      $("#login-usuario").focus();
    });
  }

  function entrarPainel() {
    var p = D.acesso.paciente;
    $("#painel-nome").textContent = p.nome;
    $("#painel-info").textContent = "Nascimento " + p.nascimento + " · " + p.convenio + " · carteirinha " + p.carteirinha;
    var lista = $("#exames-lista");
    limpar(lista);
    D.exames.forEach(function (ex) {
      var corpo = el("div", { class: "exame-corpo" }, [
        el("p", { class: "exame-data", text: "Coletado em " + ex.data + " · pedido de " + ex.solicitante })
      ]);
      if (ex.itens.length) {
        var tabela = el("table", { class: "tabela" }, [
          el("thead", null, [el("tr", null, [el("th", { text: "Item" }), el("th", { text: "Resultado" }), el("th", { text: "Referência" })])]),
          el("tbody", null, ex.itens.map(function (it) {
            var fora = it.valor < it.min || it.valor > it.max;
            var ref = it.max >= 999 ? "acima de " + formatarValor(it.min) : (it.min === 0 ? "até " + formatarValor(it.max) : formatarValor(it.min) + " a " + formatarValor(it.max));
            return el("tr", null, [
              el("th", { scope: "row", text: it.nome }),
              el("td", { class: fora ? "fora" : "", text: formatarValor(it.valor) + " " + it.unidade }),
              el("td", { text: ref + " " + it.unidade })
            ]);
          }))
        ]);
        corpo.appendChild(tabela);
      }
      corpo.appendChild(el("p", { class: "exame-nota", text: ex.nota }));
      lista.appendChild(el("details", { class: "exame" }, [
        el("summary", null, [
          el("span", { text: ex.nome }),
          el("span", { class: "exame-estado" + (ex.estado === "pendente" ? " esta-pendente" : ""), text: ex.estado === "pendente" ? "Em análise" : "Disponível" })
        ]),
        corpo
      ]));
    });
    desenharGrafico();
    $("#paciente-entrada").hidden = true;
    $("#painel").hidden = false;
    $("#painel").setAttribute("tabindex", "-1");
    $("#painel").focus();
  }

  function desenharGrafico() {
    var svg = $("#grafico");
    var g = D.glicemia;
    $$("*:not(title)", svg).forEach(function (n) { if (n.parentNode === svg) { svg.removeChild(n); } });
    var L = 520, A = 260, mx = 40, my = 24, mb = 40;
    var larg = L - mx - 16, alt = A - my - mb;
    var valores = g.pontos.map(function (p) { return p.valor; });
    var vMin = Math.min(g.min, Math.min.apply(null, valores)) - 10;
    var vMax = Math.max(g.max, Math.max.apply(null, valores)) + 10;
    function y(v) { return my + alt - ((v - vMin) / (vMax - vMin)) * alt; }
    function x(i) { return mx + (larg / (g.pontos.length - 1)) * i; }

    svg.appendChild(svgEl("rect", { class: "grafico-faixa", x: mx, y: y(g.max), width: larg, height: y(g.min) - y(g.max), rx: 4 }));
    [g.min, g.max].forEach(function (v) {
      svg.appendChild(svgEl("line", { class: "grafico-eixo", x1: mx, x2: mx + larg, y1: y(v), y2: y(v) }));
      svg.appendChild(svgEl("text", { class: "grafico-texto", x: mx - 8, y: y(v) + 4, "text-anchor": "end", text: String(v) }));
    });
    var pontos = g.pontos.map(function (p, i) { return x(i) + "," + y(p.valor); }).join(" ");
    svg.appendChild(svgEl("polyline", { class: "grafico-linha", points: pontos }));
    g.pontos.forEach(function (p, i) {
      var fora = p.valor < g.min || p.valor > g.max;
      svg.appendChild(svgEl("circle", { class: "grafico-ponto" + (fora ? " fora" : ""), cx: x(i), cy: y(p.valor), r: 6 }));
      svg.appendChild(svgEl("text", { class: "grafico-valor", x: x(i), y: y(p.valor) - 12, text: String(p.valor) }));
      svg.appendChild(svgEl("text", { class: "grafico-texto", x: x(i), y: A - 12, "text-anchor": "middle", text: p.rotulo }));
    });

    var tabela = $("#grafico-tabela");
    $$("tr", tabela).forEach(function (tr) { tr.remove(); });
    tabela.appendChild(el("tr", null, g.pontos.map(function (p) { return el("th", { scope: "col", text: p.rotulo }); })));
    tabela.appendChild(el("tr", null, g.pontos.map(function (p) { return el("td", { text: p.valor + " mg/dL" }); })));
  }

  /* ---------- como chegar ---------- */
  var modos = $$(".modo");
  if (modos.length) {
    modos.forEach(function (b) {
      b.addEventListener("click", function () { mostrarRota(b.getAttribute("data-modo")); });
    });
    mostrarRota("carro");
  }

  function mostrarRota(modo) {
    modos.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-modo") === modo ? "true" : "false"); });
    $$(".rota").forEach(function (r) { r.classList.toggle("esta-ativa", r.getAttribute("data-rota") === modo); });
    var ol = $("#chegar-passos");
    limpar(ol);
    var rota = D.rotas[modo];
    rota.passos.forEach(function (p) { ol.appendChild(el("li", { text: p })); });
    var tempo = $(".chegar-tempo");
    if (!tempo) { tempo = el("p", { class: "chegar-tempo" }); ol.parentNode.insertBefore(tempo, ol.nextSibling); }
    tempo.textContent = rota.tempo;
  }
})();
