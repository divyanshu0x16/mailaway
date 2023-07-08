const { authorize } = require('./authentication/auth');
const { getRandomInterval } = require('./utils/helper');
const { google } = require('googleapis');

async function listLabels(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log('Labels:');
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}

async function intervalFunction(auth) {
  await listLabels(auth);
  setTimeout(() => intervalFunction(auth), getRandomInterval());
}

authorize()
  .then((client) => {
    // If authorization is successful, start calling logic function every X seconds
    intervalFunction(client);
  })
  .catch(console.error);
