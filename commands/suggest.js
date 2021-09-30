const SuggestionHandler = require('../handlers/SuggestionHandler');
const config = require('../config.json');
const suggestionsChannelID = config.suggestionsChannelID;

module.exports = {
  name: 'suggest',
  async execute(message, args, client, Discord) {
    if (!suggestionsChannelID) return message.reply('\nSuggestions are currently disabled.');
    if (!args[0]) return message.reply('\nYour suggestion must be at least 20 characters. Make sure to be as detailed as possible.');

    const suggestion = args.slice(0).join(' ');
    if (suggestion.length >= 20) {
      SuggestionHandler.handleSuggestion(message, suggestion, client, Discord);
    } else {
      message.reply('\nYour suggestion must be at least 20 characters. Make sure to be as detailed as possible.');
    }
  },
};
