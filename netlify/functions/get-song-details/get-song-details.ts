import { Handler } from '@netlify/functions';

const CantohymnBaseApiUri: string = 'https://cantonhymn.net/api';

export const handler: Handler = async event => {
  if (!event.queryStringParameters.slug) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Missing song slug from query string parameters.'
      }),
    };
  }

  const slug = event.queryStringParameters.slug;
  const songHierarchyType = event.queryStringParameters.songHierarchyType || 'child';
  const uri = new URL(CantohymnBaseApiUri + '/song-detail.php');
  uri.searchParams.append('slug', slug);
  uri.searchParams.append('songHierarchyType', songHierarchyType);

  const resp = await fetch(uri);
  const json = await resp.json();
  if (json.success && json.data.currentSong !== null) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json.data.currentSong),
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Could not find song with slug "${slug}"`,
        originalResponse: json,
      }),
    };
  }
};
