const config = require('../config.json');
const suggestionsChannelID = config.suggestionsChannelID;
const Discord = require('discord.js');

class SuggestionHandler {
  async handleSuggestion(message, suggestion, client) {
    const suggestionEmbed = await new Discord.MessageEmbed()
      .setTimestamp()
      .setAuthor(`Suggestion by ${message.author.tag}`, message.author.displayAvatarURL())
      .setFooter(`ID: ${message.author.id}`)
      .setTitle('Community Suggestion')
      .setDescription(suggestion);

    const sentMessage = await client.channels.cache.get(suggestionsChannelID).send({ embeds: [suggestionEmbed] });
    await sentMessage.react('👍');
    await sentMessage.react('👎');
    await sentMessage.react('🤷');
  }
}

module.exports = new SuggestionHandler();
