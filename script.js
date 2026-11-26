(function () {
  const cfg = window.SITE_CONFIG || {};
  const T = window.TRANSLATIONS || { messages: {} };
  const LANGS = ["pt", "en"];

  // ---------- Idioma ----------
  // O português vem do próprio HTML: guardamos o texto original de cada elemento
  // para podermos voltar a ele depois de mudar para inglês.
  const ATTRS = ["placeholder", "alt", "aria-label", "content"];
  const nodes = [...document.querySelectorAll("[data-i18n]")].map((el) => ({
    el,
    key: el.dataset.i18n,
    pt: el.innerHTML,
  }));
  const attrNodes = [];
  ATTRS.forEach((attr) => {
    document.querySelectorAll(`[data-i18n-${attr}]`).forEach((el) => {
      attrNodes.push({ el, attr, key: el.getAttribute(`data-i18n-${attr}`), pt: el.getAttribute(attr) });
    });
  });
  const ptTitle = document.title;

  function pickLang() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem("lang");
      if (LANGS.includes(saved)) return saved;
    } catch {}
    const nav = (navigator.languages || [navigator.language || "pt"]).join(",").toLowerCase();
    return nav.startsWith("pt") ? "pt" : "en";
  }

  let lang = pickLang();

  function msg(key) {
    const m = T.messages || {};
    return (m[lang] && m[lang][key]) || (m.pt && m.pt[key]) || key;
  }

  function fillConfig() {
    document.querySelectorAll("[data-config]").forEach((el) => {
      let v = cfg[el.dataset.config];
      if (v && typeof v === "object") v = v[lang] || v.pt;
      if (v) el.textContent = v;
    });
  }

  function applyLang(next, save) {
    lang = next;
    const dict = (lang !== "pt" && T[lang]) || {};
    nodes.forEach((n) => (n.el.innerHTML = dict[n.key] != null ? dict[n.key] : n.pt));
    attrNodes.forEach((n) => n.el.setAttribute(n.attr, dict[n.key] != null ? dict[n.key] : n.pt));
    document.documentElement.lang = lang;
    document.title = ptTitle;
    document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    fillConfig();
    status.textContent = "";
    if (save) {
      try { localStorage.setItem("lang", lang); } catch {}
      const url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    }
  }

  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => applyLang(b.dataset.lang, true))
  );

  // ---------- Menu móvel ----------
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // ---------- Botões "Copiar" (ex.: IBAN) ----------
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const original = btn.innerHTML;
      const text = document.getElementById(btn.dataset.copy).textContent.replace(/\s+/g, "");
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = msg("copied");
      } catch {
        btn.textContent = msg("copyFallback");
      }
      setTimeout(() => (btn.innerHTML = original), 2000);
    });
  });

  // ---------- Contagem decrescente ----------
  const target = new Date(cfg.weddingDate).getTime();
  const units = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
  };
  function tick() {
    const diff = Math.max(0, target - Date.now());
    units.days.textContent = Math.floor(diff / 86400000);
    units.hours.textContent = Math.floor((diff % 86400000) / 3600000);
    units.minutes.textContent = Math.floor((diff % 3600000) / 60000);
  }
  if (!isNaN(target)) {
    tick();
    setInterval(tick, 30000);
  }

  // ---------- RSVP ----------
  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("form-status");
  const attendingBlock = form.querySelector(".if-attending");
  const guests = form.querySelector("#guests");

  for (let i = 1; i <= (cfg.maxGuests || 4); i++) {
    guests.add(new Option(String(i), String(i)));
  }

  attendingBlock.hidden = true;
  form.querySelectorAll('input[name="attending"]').forEach((r) =>
    r.addEventListener("change", () => {
      attendingBlock.hidden = form.elements.attending.value !== "sim";
    })
  );

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = "form-status " + (kind || "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

    const name = form.elements.name.value.trim();
    const attending = form.elements.attending.value;
    if (!name) form.elements.name.classList.add("invalid");
    if (!name || !attending) {
      setStatus(msg("missing"), "err");
      return;
    }

    // Bot preencheu o campo-armadilha: finge sucesso e não envia.
    if (form.elements.website.value) {
      setStatus(msg("thanks"), "ok");
      form.reset();
      return;
    }

    if (!cfg.rsvpEndpoint) {
      setStatus(msg("notConfigured"), "err");
      return;
    }

    const going = attending === "sim";
    const payload = {
      name,
      contact: form.elements.contact.value.trim(),
      attending: going ? "Sim" : "Não",
      guests: going ? guests.value : "0",
      guestNames: going ? form.elements.guestNames.value.trim() : "",
      diet: going ? form.elements.diet.value.trim() : "",
      message: form.elements.message.value.trim(),
      lang: lang.toUpperCase(),
    };

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    setStatus(msg("sending"));

    try {
      // Sem cabeçalho Content-Type personalizado (text/plain) para evitar o preflight CORS,
      // que o Google Apps Script não suporta.
      const res = await fetch(cfg.rsvpEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Erro desconhecido");
      setStatus(going ? msg("thanksYes") : msg("thanksNo"), "ok");
      form.reset();
      attendingBlock.hidden = true;
    } catch (err) {
      console.error(err);
      setStatus(msg("error"), "err");
    } finally {
      btn.disabled = false;
    }
  });

  applyLang(lang, false);
})();
