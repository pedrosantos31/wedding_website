// Traduções do site.
//
// O texto em PORTUGUÊS está diretamente no index.html (é o idioma por omissão).
// Aqui fica o texto em INGLÊS, com a mesma chave que o atributo data-i18n no HTML.
// Se uma chave faltar aqui, o site mostra o texto em português.
//
// `messages` são textos usados pelo JavaScript (formulário), por isso têm as duas línguas.
window.TRANSLATIONS = {
  en: {
    "meta.description": "Our wedding — information, schedule and RSVP.",

    "nav.story": "Our story",
    "nav.schedule": "Schedule",
    "nav.venue": "Venue",
    "nav.stay": "Accommodation",
    "nav.gifts": "Gifts",
    "nav.faq": "FAQ",
    "nav.contacts": "Contacts",
    "nav.rsvp": "RSVP",
    "nav.open": "Open menu",

    "hero.solarAlt": "Drawing of Solar de Pancas",
    "hero.eyebrow": "We're getting married!",
    "hero.date": "4 July 2027 · Solar de Pancas, Alenquer",

    "countdown.days": "days",
    "countdown.hours": "hours",
    "countdown.minutes": "minutes",

    "story.title": "Our story",
    "story.text":
      "A few words about how we met, the proposal, and why we want to share this day with all of you. Replace this paragraph with your story.",

    "schedule.title": "The day",
    "schedule.ceremony": "Ceremony",
    "schedule.cocktail": "Cocktails",
    "schedule.cocktailWhere": "Solar gardens",
    "schedule.dinner": "Dinner",
    "schedule.dinnerWhere": "Main hall",
    "schedule.party": "Party",
    "schedule.partyWhere": "Until the last song",

    "venue.title": "Venue",
    "venue.both": "Ceremony & reception",
    "venue.map": "Open in maps →",
    "venue.parking": "Parking: information about parking or organised transport.",

    "stay.title": "Accommodation",
    "stay.lead": "For those travelling from afar, a few suggestions near the venue:",
    "stay.a": "5 min from the venue · discount code <code>CASAMENTO</code>",
    "stay.b": "10 min from the venue",
    "stay.cName": "Guesthouse C",
    "stay.c": "15 min from the venue",

    "gifts.title": "Gifts",
    "gifts.lead":
      "Your presence is the best gift. For those who would like to contribute, we have set up a honeymoon fund.",
    "gifts.holder": "Account holder",
    "gifts.holderName": "Carolina and Pedro",
    "gifts.copy": "Copy",
    "gifts.bank": "Bank",

    "rsvp.title": "RSVP",
    "rsvp.lead": 'Please let us know by <strong data-config="rsvpDeadline">–</strong>.',
    "rsvp.name": "Full name *",
    "rsvp.contact": "Email or phone",
    "rsvp.attending": "Will you join us? *",
    "rsvp.yes": "Yes, I'll be there!",
    "rsvp.no": "Sadly, I can't make it",
    "rsvp.guests": "How many people in total (including you)?",
    "rsvp.guestNames": "Names of your guests",
    "rsvp.guestNamesPh": "e.g. Jane Smith, John Smith",
    "rsvp.diet": "Dietary requirements or allergies",
    "rsvp.dietPh": "Vegetarian, gluten-free, allergic to…",
    "rsvp.message": "A message for the couple",
    "rsvp.submit": "Send reply",

    "faq.title": "FAQ",
    "faq.q1": "What is the dress code?",
    "faq.a1": "Formal / cocktail. Replace with your guidance.",
    "faq.q2": "Can I bring children?",
    "faq.a2": "Answer about children.",
    "faq.q3": "Is there transport between the ceremony and the reception?",
    "faq.a3": "Answer about transport.",
    "faq.q4": "When should I RSVP by?",
    "faq.a4": 'By <span data-config="rsvpDeadline">–</span>, using the form above.',

    "contacts.title": "Contacts",
    "contacts.lead": "Any questions? Get in touch.",

    "footer.help": 'Questions? <a href="#contactos">Get in touch</a>',
  },

  messages: {
    pt: {
      missing: "Por favor indica o teu nome e se vais estar presente.",
      notConfigured: "O formulário ainda não está ligado (falta o rsvpEndpoint em config.js).",
      sending: "A enviar…",
      thanks: "Obrigado! A tua resposta foi registada.",
      thanksYes: "Obrigado! Mal podemos esperar por te ver. 🎉",
      thanksNo: "Obrigado por nos avisares. Vamos sentir a tua falta!",
      error: "Não foi possível enviar. Tenta novamente ou fala connosco diretamente.",
      copied: "Copiado ✓",
      copyFallback: "Seleciona e copia",
    },
    en: {
      missing: "Please tell us your name and whether you can come.",
      notConfigured: "The form isn't connected yet (rsvpEndpoint missing in config.js).",
      sending: "Sending…",
      thanks: "Thank you! Your reply has been recorded.",
      thanksYes: "Thank you! We can't wait to see you. 🎉",
      thanksNo: "Thank you for letting us know. We'll miss you!",
      error: "Something went wrong. Please try again or contact us directly.",
      copied: "Copied ✓",
      copyFallback: "Select and copy",
    },
  },
};
