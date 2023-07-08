function getRandomInterval() {
  return Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000; // Convert to milliseconds
}

module.exports = {
  getRandomInterval,
};
