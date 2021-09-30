const Discord = require('discord.js');

module.exports = {
  name: 'discordmember',
  async execute(message) {
    if (!message.mentions.users.first()) return message.reply('\n You must mention a user.');
    else {
      const mention = message.mentions.members.first();
      if (!mention) return;

      const userEmbed = new Discord.MessageEmbed()
        .setDescription(`Information for ${mention}`)
        .setTimestamp()
        .setFooter(`ID: ${message.author.id}`)
        .setThumbnail(mention.user.avatarURL())
        .addField('Member Since', mention.joinedAt.toDateString())
        .addField('Discord Tag', mention.user.tag)
        .addField('Discord ID', mention.id)
        .addField('Roles', mention.roles.cache.map((role) => role).join(', '));
      message.channel.send({ embeds: [userEmbed] });
    }
  },
};
