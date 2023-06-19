const CantohymnBaseApiUri: string = 'https://cantonhymn.net/api';
const RCUVBaseApiUri: string = 'http://rcuv.hkbs.org.hk/bb/RCUV1';

/**
 * A Cantohymn song, according to their API.
 */
export interface CantohymnSong {
  songId: number;
  slug: string;
  parentSlug: string | null;
  title: string;
  person: string;
  source: string;
  lyrics: string;
  featuredVideoLink: string;
  thumbnail: string;
  hasChordPattern: boolean;
  songType: number;
  songIconType: number;
  create_datetime: string;
  create_date: string;
  update_datetime: string;
  update_date: string;
  author: string;
}

/**
 * Search external song database for songs with the given keywords.
 *
 * May require some tweaking if it starts to not work.
 */
export async function searchSongsWithFilter(words: string): Promise<CantohymnSong[]> {
  const uri = new URL(CantohymnBaseApiUri + '/advanced-search-songs.php');
  uri.searchParams.append('generalType', 'all');
  uri.searchParams.append('recommendType', 'latest');
  uri.searchParams.append('filter1_target', 'any');
  uri.searchParams.append('filter1_type', 'contain_all_words');
  uri.searchParams.append('filter1_val', words);
  uri.searchParams.append('as_page', '1');

  const resp = await fetch(uri);
  const json = await resp.json();
  if (json.success) {
    return json.data.songs;
  } else {
    throw new Error('Invalid JSON');
  }
}

/**
 * Get song details based on given slug.
 *
 * Must match the slug exactly. Slug doesn't need to be URL-encoded.
 */
export async function getSongDetails(slug: string): Promise<CantohymnSong> {
  const uri = new URL(CantohymnBaseApiUri + '/song-detail.php');
  uri.searchParams.append('slug', slug);

  const resp = await fetch(uri);
  const json = await resp.json();
  if (json.success) {
    return json.data.currentSong;
  } else {
    throw new Error('Invalid JSON');
  }
}

/**
 * Get an entire chapter of the bible.
 *
 * **NOTE**: Everything is hard-coded. The end-point uses RCUV; if you want to change it, you could. This
 * should do the trick for our MVP.
 */
export async function getBibleChapterAsString(
  bookShorthand: string,
  chapter: number
): Promise<string> {
  const uri = new URL(RCUVBaseApiUri + '/' + bookShorthand + '/' + chapter);
  const resp = await fetch(uri);
  return resp.text();
}
