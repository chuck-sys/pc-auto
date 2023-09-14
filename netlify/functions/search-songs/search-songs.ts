import { Handler } from '@netlify/functions';

const CantohymnBaseApiUri: string = 'https://cantonhymn.net/api';

export const handler: Handler = async event => {
  if (!event.queryStringParameters.q) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Missing query string from parameters.'
      }),
    };
  }

  const q = event.queryStringParameters.q;
  const uri = new URL(CantohymnBaseApiUri + '/advanced-search-songs.php');
  uri.searchParams.append('filter1_val', q);
  uri.searchParams.append('generalType', 'all');
  uri.searchParams.append('recommendType', 'latest');
  uri.searchParams.append('filter1_target', 'any');
  uri.searchParams.append('filter1_type', 'contain_all_words');
  uri.searchParams.append('as_page', '1');

  const resp = await fetch(uri);
  const json = await resp.json();

  if (json.success) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json.data.songs),
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Could not query the site.',
        originalResponse: resp.text(),
      })
    };
  }
};
