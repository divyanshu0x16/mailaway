function getRandomInterval() {
  return Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000; // Convert to milliseconds
}

function buildEmail(message) {
  const headers = [
    `To: ${message.to}`,
    'Content-Type: text/plain; charset=utf-8',
    `Subject: ${message.subject}`,
  ];

  const body = message.body;

  const emailContent = headers.join('\r\n') + '\r\n\r\n' + body;
  const encodedEmailContent = Buffer.from(emailContent).toString('base64');

  return encodedEmailContent;
}

function checkIfAlreadyReplied(threadMessages, userEmailAddress) {
  let sentByYou = false;
  for (const message of threadMessages) {
    for (const header of message.payload.headers) {
      if (header.name === 'From' && header.value.includes(userEmailAddress)) {
        sentByYou = true;
        break;
      }
    }
    if (sentByYou) {
      break;
    }
  }

  return sentByYou;
}

module.exports = {
  getRandomInterval,
  checkIfAlreadyReplied,
  buildEmail,
};
