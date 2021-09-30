module.exports = {
  name: 'pic',
  async execute(message) {
    if (!message.mentions.users.first()) return message.reply('\n You must mention a user.');
    else {
      const mention = message.mentions.users.first();
      if (!mention) return;
      message.channel.send(mention.displayAvatarURL({ dynamic: true, size: 4096 }));
    }
  },
};
