export default {
  name: 'example',
  description: 'Example',
  args: false,
  cooldown: 5,
  usage: '<test1> <test2>',
  guildOnly: true,
  execute(message, args) {
    message.channel.send(`Test!${args}`);
  },
};
