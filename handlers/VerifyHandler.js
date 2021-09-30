const config = require('../config.json');
const MojangHandler = require('./api/MojangHandler');
const HypixelHandler = require('./api/HypixelHandler');
const guild = config.guild;

class VerifyHandler {
  async VerifyRequest(message, name) {
    let foundMember = false;
    const uuid = await MojangHandler.ReturnUUID(name);
    if (!uuid) return message.reply('Unable to find that Minecraft name, did you type it wrong?');

    const hypixelMember = await HypixelHandler.ReturnHypixelMember(uuid);
    if (!hypixelMember) return message.reply('Something went wrong, DM Rina or try again later.');

    if (hypixelMember.player.socialMedia) {
      if (hypixelMember.player.socialMedia.links.DISCORD === message.member.user.tag) {
        const checkedGuild = await HypixelHandler.ReturnFullGuildInfo(message);

        for (const guildMember of checkedGuild.guild.members) {
          const memberRole = message.guild.roles.cache.find((r) => r.name === 'Member');
          if (guildMember.uuid === uuid) {
            message.member.setNickname(hypixelMember.player.displayname, uuid).catch((e) => {
              console.log(e);
            });
            message.member.roles.add(memberRole).catch((e) => console.log(e));
            foundMember = true;
          }
        }
      } else {
        message.reply('The Discord you set in-game does not match your current Discord tag.');
        return;
      }

      if (foundMember) {
        message.reply('Your permissions & name have been updated!');
      } else {
        message.reply('I was unable to find you in our guild.\nNote that only __current guild members__ need to verify.');
      }
    } else {
      message.reply('You have not set your Discord in-game. Please read the instructions.');
    }
  }
}

module.exports = new VerifyHandler();
