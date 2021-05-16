import searchExplainXkcd from '../explain_xkcd_api.js';
import getXkcdComic from '../xkcd_api.js';

export default {
  name: 'xkcd',
  description: 'Retrieves an XCKD comic based on the keywords provided.',
  args: true,
  cooldown: 5,
  usage: '<keyword1> <keyword2> ...',
  guildOnly: true,
  async execute(message, args) {
    const searchQuery = args.join(' ');
    let comicNumber = await searchExplainXkcd(searchQuery, 'title');
    if (comicNumber === -1) {
      comicNumber = await searchExplainXkcd(searchQuery, 'keyword');
    }
    const imageUrl = await getXkcdComic(comicNumber);
    message.channel.send(`${imageUrl}`);
  },
};
