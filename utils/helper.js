function getRandomInterval() {
  return Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000; // Convert to milliseconds
}

function checkIfAlreadyReplied(threadMessages) {
  let sentByYou = false;
  for (const message of threadMessages) {
    for (const header of message.payload.headers) {
      if (
        header.name === 'From' &&
        header.value.includes('divyanshu22.dm@gmail.com') //TODO: Remove this hard code
      ) {
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
};
