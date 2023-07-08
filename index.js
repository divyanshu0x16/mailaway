const { authorize } = require('./authentication/auth');
const { getRandomInterval, checkIfAlreadyReplied } = require('./utils/helper');
const { google } = require('googleapis');
/*
API Documentation:- https://developers.google.com/gmail/api/reference/rest
 */

async function createLabel(gmail) {
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  const hasVacation = labels.some((label) => label.name.includes('Vacation'));
  if (!hasVacation) {
    await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
        name: 'Vacation',
      },
    });

    console.log("Created label with name 'Vacation'");
  } else {
    console.log("Label with name 'Vacation' already existed");
  }
}

//TODO: Customize your reply message
async function sendReplyAndModifyLabel(gmail, threadId, threadRes) {
  try {
    console.log(threadRes.data);

    const messageContent =
      'The user is on vacation and may take some time to respond. Please wait for the response.';
    const encodedMessageContent =
      Buffer.from(messageContent).toString('base64');

    dsafaf;

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessageContent,
      },
    });

    console.log(response, '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    if (response) {
      console.log('Reply sent!');
      // Move the email to the "Vacation" label
      await gmail.users.threads.modify({
        userId: 'me',
        id: threadId,
        requestBody: {
          addLabelIds: ['Vacation'],
        },
      });
      console.log('Email thread moved to the "Vacation" label.');
    } else {
      console.error(
        'Error sending reply. Response is null, undefined, or falsy.'
      );
    }
  } catch (error) {
    console.error('Error sending reply or adding label:', error);
  }
}

async function mailAway(gmail) {
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:inbox is:unread', //We use is:inbox to avoid spam/promotion mails which are unread
  });
  const emails = res.data.messages;

  for (const email of emails) {
    const emailData = await gmail.users.messages.get({
      userId: 'me',
      id: email.id,
    });

    const threadId = emailData.data.threadId;
    const headers = emailData.data.payload.headers;
    const fromHeader = headers.find((header) => header.name === 'From');
    const subjectHeader = headers.find((header) => header.name === 'Subject');

    console.log(`Email from: ${fromHeader.value}`);
    console.log(`Subject: ${subjectHeader.value}`);
    console.log(`Thread ID: ${threadId}`);

    const threadRes = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
    });
    const threadMessages = threadRes.data.messages;

    if (checkIfAlreadyReplied(threadMessages) === false) {
      console.log('Send a reply!');
      //sendReplyAndModifyLabel(gmail, threadId, threadRes);
    }
  }
}

async function intervalFunction(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  await createLabel(gmail, auth);
  await mailAway(gmail, auth);
  /** 
  TODO: Change this to @getRandomInterval
  */
  setTimeout(() => intervalFunction(auth), 5000);
}

authorize()
  .then((client) => {
    intervalFunction(client);
  })
  .catch(console.error);
