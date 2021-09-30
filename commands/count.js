const Discord = require('discord.js');
const HypixelHandler = require('../handlers/api/HypixelHandler');

module.exports = {
  name: 'count',
  async execute(message) {
    const count = await HypixelHandler.ReturnPlayerCount();

    if (count.success) {
      const queue = count.games.QUEUE.players.toLocaleString();
      const skyblockPlayers = count.games.SKYBLOCK.players.toLocaleString();
      const bedwarsPlayers = count.games.BEDWARS.players.toLocaleString();
      const totalPlayers = count.playerCount.toLocaleString();

      if (queue > 0) {
        message.reply(
          `There are currently **${skyblockPlayers}** players in Skyblock.\n**${bedwarsPlayers}** on Bedwars.\n**${totalPlayers}** total players on the Hypixel network.\nThere is a current queue of **${queue}** players.`
        );
      } else {
        message.reply(
          `There are currently **${skyblockPlayers}** players in Skyblock.\n**${bedwarsPlayers}** on Bedwars.\n**${totalPlayers}** total players on the Hypixel network.`
        );
      }

      /* Outputs ALL stats
			const output = [];
			for (const item in count.games) {
				const toPush = `${
					item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
				}: ${count.games[item].players.toLocaleString()}`;
				output.push(toPush);
			}
			message.reply(output.join(' \n'));
			*/
    } else {
      message.reply("Got an invalid response from Hypixel API, it's probably down.");
    }
  },
};
