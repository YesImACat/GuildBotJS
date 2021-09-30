const Discord = require('discord.js');
const HypixelHandler = require('../handlers/api/HypixelHandler');

module.exports = {
  name: 'watchdog',
  async execute(message) {
    const stats = await HypixelHandler.ReturnWatchdogStats();
    if (stats.success) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`🚨 Watchdog Statistics`)
        .addField('Watchdog actions in the last minute', `${stats.watchdog_lastMinute.toLocaleString()}`, true)
        .addField('Watchdog actions taken last 24 hours', `${stats.watchdog_rollingDaily.toLocaleString()}`, true)
        .addField('Watchdog actions taken total', `${stats.watchdog_total.toLocaleString()}`, true)
        .addField('Staff actions taken last 24 hours', `${stats.staff_rollingDaily.toLocaleString()}`, true)
        .addField('Staff actions taken total', `${stats.staff_total.toLocaleString()}`, true);

      message.reply({ content: ' ', embeds: [embed] });
    } else {
      message.reply("Got an invalid response from Hypixel API, it's probably down.");
    }
  },
};
