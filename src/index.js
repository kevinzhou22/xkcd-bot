import fs from 'fs';
import dotenv from 'dotenv';
import Discord from 'discord.js';

import settings from './settings.js';

const { prefix } = settings;

dotenv.config();

const client = new Discord.Client();

// get commands based on files in ./commands
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

const commandLoadPromises = commandFiles.map((file) => import(`./commands/${file}`).then((module) => {
  const command = module.default;
  client.commands.set(command.name, command);
}));

// execute the appropriate command, if any
client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  // validate arguments length
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    message.channel.send(reply);
    return;
  }

  // validate if command is for Discord servers only
  if (command.guildOnly && message.channel.type === 'dm') {
    message.reply('I can\'t execute that command inside DMs!');
    return;
  }
  const { cooldowns } = client;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  // prevent spamming of commands
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      return;
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // execute the commands
  try {
    command.execute(message, args);
  } catch (error) {
    message.reply('Something went wrong trying to execute that command!');
  }
});

Promise.all(commandLoadPromises).then(() => {
  client.login(process.env.DISCORD_TOKEN);
});
