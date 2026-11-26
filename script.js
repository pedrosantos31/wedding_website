(function () {
  const cfg = window.SITE_CONFIG || {};

  // Valores de configuração no texto da página
  document.querySelectorAll("[data-config]").forEach((el) => {
    const v = cfg[el.dataset.config];
    if (v) el.textContent = v;
  });

  // Menu móvel
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

  // Botões "Copiar" (ex.: IBAN)
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = document.getElementById(btn.dataset.copy).textContent.replace(/\s+/g, "");
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copiado ✓";
      } catch {
        btn.textContent = "Seleciona e copia";
      }
      setTimeout(() => (btn.textContent = "Copiar"), 2000);
    });
  });

  // Contagem decrescente
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

  // RSVP
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

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "form-status " + (kind || "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

    const name = form.elements.name.value.trim();
    const attending = form.elements.attending.value;
    if (!name) form.elements.name.classList.add("invalid");
    if (!name || !attending) {
      setStatus("Por favor indica o teu nome e se vais estar presente.", "err");
      return;
    }

    // Bot preencheu o campo-armadilha: finge sucesso e não envia.
    if (form.elements.website.value) {
      setStatus("Obrigado! A tua resposta foi registada.", "ok");
      form.reset();
      return;
    }

    if (!cfg.rsvpEndpoint) {
      setStatus("O formulário ainda não está ligado (falta o rsvpEndpoint em config.js).", "err");
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
    };

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    setStatus("A enviar…");

    try {
      // Sem cabeçalho Content-Type personalizado (text/plain) para evitar o preflight CORS,
      // que o Google Apps Script não suporta.
      const res = await fetch(cfg.rsvpEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Erro desconhecido");
      setStatus(
        going ? "Obrigado! Mal podemos esperar por te ver. 🎉" : "Obrigado por nos avisares. Vamos sentir a tua falta!",
        "ok"
      );
      form.reset();
      attendingBlock.hidden = true;
    } catch (err) {
      console.error(err);
      setStatus("Não foi possível enviar. Tenta novamente ou fala connosco diretamente.", "err");
    } finally {
      btn.disabled = false;
    }
  });
})();
