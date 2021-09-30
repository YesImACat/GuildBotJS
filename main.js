const { Client, Intents, Collection } = require('discord.js');
const myIntents = new Intents()
  .add(Intents.FLAGS.DIRECT_MESSAGES)
  .add(Intents.FLAGS.GUILDS)
  .add(Intents.FLAGS.GUILD_MEMBERS)
  .add(Intents.FLAGS.GUILD_BANS)
  .add(Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({ intents: myIntents, partials: ['CHANNEL'] });
client.commands = new Collection();

const fs = require('fs');
const Discord = require('./handlers/DiscordHandler');

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
const config = require('./config.json');
const prefix = config.prefix;
const token = config.discordBotToken;
const HypixelHandler = require('./handlers/api/HypixelHandler');

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  HypixelHandler.setPresence(client);
  setInterval(function () {
    HypixelHandler.setPresence(client);
  }, 600000);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  Discord.receiveMessageUpdate(oldMessage, newMessage, client);
});

client.on('messageDelete', (message) => {
  console.log('Saw a message get deleted');
  Discord.receiveMessageDeletion(message, client);
});

client.on('messageCreate', (message) => {
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (message.author.bot || !message.member) return;

  Discord.receiveMessage(message, client);

  if (!message.content.startsWith(prefix)) return;
  if (!client.commands.get(command)) return;

  console.log(`Executing command by ${message.author.tag}`);
  client.commands
    .get(command)
    .execute(message, args, client)
    .catch((e) => {
      console.log(e);
    });
  return;
});

client.login(token);
