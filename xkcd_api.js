import axios from 'axios';

// returns URL of the XKCD comic associated with a given number
const getXkcdComic = async function getXkcdComic(comicNumber) {
  const parameters = {
    method: 'get',
    url: `http://xkcd.com/${comicNumber}/info.0.json `,
  };

  let response;
  try {
    response = await axios(parameters);
  } catch (error) {
    console.log(`Error when fetching from XKCD: ${error}`);
    throw error;
  }

  return response.data.img;
};

export default getXkcdComic;
