import axios from 'axios';

/*
 Searches the explain XKCD wiki and returns the first valid comic's title number as a string.
 Returns -1 if the search does not find anything
*/
const searchExplainXkcd = async function searchExplainXkcd(keywords) {
  const urlEncodedKeywords = encodeURIComponent(keywords);
  const parameters = {
    method: 'get',
    url: `https://www.explainxkcd.com/wiki/api.php?action=query&list=search&srwhat=text&format=json&srsearch=${urlEncodedKeywords}`,
  };

  let response;

  try {
    response = await axios(parameters);
  } catch (error) {
    console.log(`Error when searching Explain XKCD: ${error}`);
    throw error;
  }

  const { search } = response.data.query;

  if (search.length === 0) {
    return -1;
  }

  let resultTitleNumber = null;

  for (let i = 0; i < search.length; i += 1) {
    const searchEntry = search[i].title;
    const hasNoRedirect = !searchEntry.includes('#REDIRECT');

    const colonSearch = searchEntry.search(':');

    const startsWithNumber = colonSearch !== -1
      && (!(Number.isNaN(Number(searchEntry.slice(0, colonSearch)))));

    if (hasNoRedirect && startsWithNumber) {
      resultTitleNumber = searchEntry.slice(0, colonSearch);
      break;
    }
  }

  if (resultTitleNumber === null) {
    return -1;
  }

  return resultTitleNumber;
};

export default searchExplainXkcd;
