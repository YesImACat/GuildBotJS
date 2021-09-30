const config = require('../config.json');
const loggingChannelID = config.loggingChannelID;
const Discord = require('discord.js');

class DiscordHandler {
  async receiveMessage(message, client) {
    if (message.author.bot) return;
    if (message.channel.id == loggingChannelID) return;
    if (!message.content) return;

    const messageLogEmbed = new Discord.MessageEmbed()
      .setDescription(message.member.toString())
      .setTimestamp()
      .setFooter(`ID: ${message.author.id}`)
      .setURL(message.url)
      .setThumbnail(message.author.avatarURL())
      .setTitle('Logged Message')
      .addField('Channel', message.channel.toString())
      .addField('Message Content', message.content.toString());
    await client.channels.cache.get(loggingChannelID).send({ embeds: [messageLogEmbed] });
  }

  async receiveMessageUpdate(oldMessage, newMessage, client) {
    if (oldMessage.author.bot) return;
    if (oldMessage.channel.id == loggingChannelID) return;
    if (oldMessage.content === newMessage.content) return;

    const messageLogEmbed = new Discord.MessageEmbed()
      .setDescription(oldMessage.member.toString())
      .setTimestamp()
      .setFooter(`ID: ${oldMessage.author.id}`)
      .setURL(oldMessage.url)
      .setThumbnail(oldMessage.author.avatarURL())
      .setTitle('Logged Message Edit')
      .addField('Channel', oldMessage.channel.toString())
      .addField('Old Message Content', oldMessage.content.toString())
      .addField('New Message Content', newMessage.content.toString());
    await client.channels.cache.get(loggingChannelID).send({ embeds: [messageLogEmbed] });
  }

  async receiveMessageDeletion(message, client) {
    if (message.author.bot) return;
    if (message.channel.id == loggingChannelID) return;

    const messageLogEmbed = new Discord.MessageEmbed()
      .setDescription(message.member.toString())
      .setTimestamp()
      .setFooter(`ID: ${message.author.id}`)
      .setURL(message.url)
      .setThumbnail(message.author.avatarURL())
      .setTitle('Logged Message Deletion')
      .addField('Channel', message.channel.toString())
      .addField('Deleted Message', message.content.toString())
      .addField(
        '**Important note for officers**',
        'This only displays the deleted message.\nThe Discord API does not display who deleted it.\nCheck the audit logs (right click server) for that.'
      );
    await client.channels.cache.get(loggingChannelID).send({ embeds: [messageLogEmbed] });
  }

  /*
  async handleDM(message, client) {
    const dmChannel = client.channels.cache.get(config.dmChannel);

    if (message.content.includes('OFFICER APPLICATION:')) {
      const officerRole = `<@&${config.officerRoleID}>`;
      dmChannel.send(`${officerRole}\n${message.author} sent an officer application:\n\n\`\`\`${message.content}\`\`\``).then((app) => {
        app.react('👍');
        app.react('👎');
        message.reply('Your officer application has been sent.\nReminder: You will usually only receive a reply if you are accepted.');
      });
      return;
    }

    dmChannel
      .send(`${message.author} sent the following help request:\n\n${message.content}`)
      .then(message.reply('Your help request has been sent, an officer will contact you soon if necessary.\nIf this was a mistake, feel free to DM the bot again and say so.'));
  }*/
}

module.exports = new DiscordHandler();
