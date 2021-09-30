const fetch = require('node-fetch');

class MojangHandler {
  async ReturnName(uuid, message) {
    try {
      const mojangResponse = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`);
      const mojangResponseJson = await mojangResponse.json();
      const name = await mojangResponseJson.pop().name;
      return name;
    } catch (e) {
      message.reply('\nThere was an error fetching that name, perhaps it has been changed or you typed it wrong?');
    }
  }

  async ReturnUUID(userName, message) {
    try {
      const mojangResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${userName}`);
      const mojangReponseJson = await mojangResponse.json();
      const returnValue = mojangReponseJson.id;
      return returnValue;
    } catch (e) {
      if (!message) return;
      message.reply('\nThere was an error fetching that name, perhaps it has been changed or you typed it wrong?');
    }
  }
}

module.exports = new MojangHandler();
