const { GoogleSpreadsheet } = require('google-spreadsheet')

async function getData(docID, sheetID, credentialsPath = '../cognitive-game-credentials') {
  const result = [];
  const doc = new GoogleSpreadsheet(docID);
  const creds = require(credentialsPath);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsById[sheetID];
  const rows = await sheet.getRows();
  for (row of rows) {
    result.push(row._rawData);
  }
  return result;
};

module.exports = {
  getData,
};