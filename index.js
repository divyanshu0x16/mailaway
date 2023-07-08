const { authorize } = require('./authentication/auth');
const {
  getRandomInterval,
  checkIfAlreadyReplied,
  buildEmail,
} = require('./utils/helper');
const { google } = require('googleapis');
/*
API Documentation:- https://developers.google.com/gmail/api/reference/rest
 */

async function getLabelId(gmail) {
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  const vacationLabel = labels.find((label) => label.name === 'Vacation');
  if (vacationLabel) {
    return vacationLabel.id;
  } else {
    const createdLabel = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
        name: 'Vacation',
      },
    });

    console.log("Created label with name 'Vacation'");
    return createdLabel.data.id;
  }
}

//TODO: Customize your reply message
async function sendReplyAndModifyLabel(gmail, threadId, replyMessage, labelId) {
  try {
    const emailContent = buildEmail(replyMessage);

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        threadId: threadId,
        raw: emailContent,
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
          addLabelIds: [labelId],
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

    const replyMessage = {
      to: fromHeader.value,
      subject: subjectHeader.value,
      body: 'The person you are trying to reach is currently on a vacation. Please wait for some time for response.',
    };

    const labelId = await getLabelId(gmail); //Get the ID of the Label with name 'Vacation'

    const threadRes = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
    });
    const threadMessages = threadRes.data.messages;

    if (checkIfAlreadyReplied(threadMessages) === false) {
      sendReplyAndModifyLabel(gmail, threadId, replyMessage, labelId);
    }
  }
}

async function intervalFunction(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
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
