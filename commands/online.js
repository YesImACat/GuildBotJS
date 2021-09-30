const HypixelHandler = require('../handlers/api/HypixelHandler');

module.exports = {
  name: 'online',
  async execute(message, args) {
    const member = args[0];
    if (!member) return message.reply('You must input a name to check for.');
    else {
      const status = await HypixelHandler.ReturnStatus(member);

      if (status.session.online) {
        const game = status.session.gameType;
        const output = game.charAt(0).toUpperCase() + game.slice(1).toLowerCase();

        message.reply(`${member} is online playing ${output}.`);
      } else {
        message.reply('That user is not online.');
      }
    }
  },
};
