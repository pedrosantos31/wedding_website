// Configuração do site — edita aqui os valores principais.
window.SITE_CONFIG = {
  // Data e hora da cerimónia (formato ISO, hora de Lisboa).
  weddingDate: "2027-07-04T16:30:00+01:00",

  // Data limite para confirmar presença (aparece no formulário), em cada idioma.
  rsvpDeadline: { pt: "4 de maio de 2027", en: "4 May 2027" },

  // URL da Web App do Google Apps Script (ver README, secção "RSVP").
  // Enquanto estiver vazio, o formulário mostra um aviso em vez de enviar.
  rsvpEndpoint: "",

  // Número máximo de acompanhantes que um convidado pode indicar.
  maxGuests: 4,
};
