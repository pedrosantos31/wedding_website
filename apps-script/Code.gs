/**
 * RSVP do casamento → Google Sheet.
 *
 * Como instalar (ver README):
 * 1. Cria uma Google Sheet nova.
 * 2. Extensões → Apps Script, apaga o conteúdo e cola este ficheiro.
 * 3. Implementar → Nova implementação → Tipo "Aplicação Web"
 *    - Executar como: Eu
 *    - Quem tem acesso: Qualquer pessoa
 * 4. Copia o URL da aplicação web para `rsvpEndpoint` em config.js.
 */

// Email para receber um aviso a cada resposta. Deixa vazio para desligar.
const NOTIFY_EMAIL = "";

const SHEET_NAME = "RSVP";
const HEADERS = [
  "Data",
  "Nome",
  "Contacto",
  "Vem?",
  "Nº pessoas",
  "Acompanhantes",
  "Restrições alimentares",
  "Mensagem",
  "Idioma",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const name = clean(data.name, 120);
    if (!name) return json({ ok: false, error: "Nome em falta" });

    const sheet = getSheet();
    const row = [
      new Date(),
      name,
      clean(data.contact, 120),
      clean(data.attending, 10),
      Number(data.guests) || 0,
      clean(data.guestNames, 300),
      clean(data.diet, 300),
      clean(data.message, 1000),
      clean(data.lang, 5),
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "RSVP: " + name + " (" + row[3] + ")",
        HEADERS.map(function (h, i) { return h + ": " + row[i]; }).join("\n")
      );
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Permite testar o URL no browser.
function doGet() {
  return json({ ok: true, info: "RSVP endpoint ativo" });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

// Limita o tamanho e impede que um valor seja interpretado como fórmula na Sheet.
function clean(value, max) {
  let s = String(value == null ? "" : value).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
