const RSVP_SHEET_NAME = 'Confirmaciones';

function getRsvpSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(RSVP_SHEET_NAME);
    sheet.appendRow(['Fecha', 'ID', 'Nombre']);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function doPost(event) {
  const name = String(event.parameter.nombre || '').trim();
  const requestId = String(event.parameter.id || '').trim();

  if (!name || !requestId) {
    return jsonResponse_({ ok: false, error: 'Datos incompletos' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getRsvpSheet_();
    const existingId = sheet
      .getRange('B:B')
      .createTextFinder(requestId)
      .matchEntireCell(true)
      .findNext();

    if (!existingId) {
      sheet.appendRow([new Date(), requestId, name]);
    }

    return jsonResponse_({ ok: true, id: requestId });
  } finally {
    lock.releaseLock();
  }
}

function doGet(event) {
  const requestId = String(event.parameter.id || '').trim();
  const callback = String(event.parameter.callback || '').trim();
  const validCallback = /^[A-Za-z_$][\w$]*$/.test(callback);
  let registered = false;

  if (requestId) {
    registered = Boolean(
      getRsvpSheet_()
        .getRange('B:B')
        .createTextFinder(requestId)
        .matchEntireCell(true)
        .findNext()
    );
  }

  const payload = JSON.stringify({ ok: true, registered: registered });

  if (validCallback) {
    return ContentService
      .createTextOutput(callback + '(' + payload + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
