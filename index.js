const { google } = require('googleapis');
const { authorize } = require('./authentication/auth');
const { getLabelId } = require('./services/labelService');
const { sendReplyAndAddLabel } = require('./services/sendMailService');

const { getRandomInterval, checkIfAlreadyReplied } = require('./utils/helper');

async function mailAway(gmail) {
  const userProfile = await gmail.users.getProfile({
    userId: 'me',
  });
  const userEmailAddress = userProfile.data.emailAddress;

  const labelId = await getLabelId(gmail); //Get the ID of the Label with name 'Vacation'

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:inbox is:unread', //We use is:inbox to avoid spam/promotion mails which are unread
  });
  const emails = res.data.messages;

  if (!emails || emails.length === 0) {
    console.log('No new emails found.');
    return;
  }

  for (const email of emails) {
    const emailData = await gmail.users.messages.get({
      userId: 'me',
      id: email.id,
    });

    const threadId = emailData.data.threadId;
    const headers = emailData.data.payload.headers;
    const fromHeader = headers.find((header) => header.name === 'From');
    const subjectHeader = headers.find((header) => header.name === 'Subject'); //Needed for sending a response and keeping the thread same

    console.log(`Email from: ${fromHeader.value}`);
    console.log(`Subject: ${subjectHeader.value}`);

    const replyMessage = {
      to: fromHeader.value,
      subject: subjectHeader.value,
      body: 'The person you are trying to reach is currently on a vacation. Please wait for some time for response.',
    };

    const threadRes = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
    });
    const threadMessages = threadRes.data.messages;

    if (checkIfAlreadyReplied(threadMessages, userEmailAddress) === false) {
      console.log('Sending Reply!!');
      sendReplyAndAddLabel(gmail, threadId, replyMessage, labelId);
    } else {
      console.log(`Already sent a reply.`);
    }
  }
}

async function intervalFunction(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  await mailAway(gmail, auth);
  setTimeout(() => intervalFunction(auth), getRandomInterval());
}

authorize()
  .then((client) => {
    intervalFunction(client);
  })
  .catch(console.error);
