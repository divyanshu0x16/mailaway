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

module.exports = {
  getLabelId,
};
