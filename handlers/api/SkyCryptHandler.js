const fetch = require('node-fetch');

class SkyCryptHandler {
  async ReturnSkycryptResults(userName, botMessage) {
    try {
      const shiiyuResults = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${userName}`);
      const shiiyuResultsJson = await shiiyuResults.json();
      return shiiyuResultsJson;
    } catch (e) {
      botMessage.edit('🛑 There was an error fetching data from SkyCrypt. 🛑');
    }
  }
}

module.exports = new SkyCryptHandler();
