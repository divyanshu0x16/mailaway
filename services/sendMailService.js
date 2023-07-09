const { buildEmail } = require('../utils/helper');

async function sendReplyAndAddLabel(gmail, threadId, replyMessage, labelId) {
  try {
    const emailContent = buildEmail(replyMessage, threadId);

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        threadId: threadId,
        raw: emailContent,
      },
    });

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
      console.log('Added "Vacation" label to the thread.');
    } else {
      console.error(
        'Error sending reply. Response is null, undefined, or falsy.'
      );
    }
  } catch (error) {
    console.error('Error sending reply or adding label:', error);
  }
}

module.exports = {
  sendReplyAndAddLabel,
};
