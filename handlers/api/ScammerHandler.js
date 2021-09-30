const fetch = require('node-fetch');
class ScammerHandler {
  async ReturnScammerList(message) {
    try {
      const data = await fetch('https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json');
      const ScammerHandler = await data.json();
      return ScammerHandler;
    } catch (e) {
      message.reply('\nThere was an error fetching the scammer list.');
    }
  }
}

module.exports = new ScammerHandler();
