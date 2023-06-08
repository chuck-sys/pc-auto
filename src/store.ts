import { Part } from './parts';

interface SongPart {
  identifier: string;
  lyricsBySlide: Array<Array<string>>;
}

interface Song {
  title: string;
  artist: string;
  lyricist: string;
  parts: Array<SongPart>;
}

interface Scripture {
  identifier: string;
  verses: Array<string>;
}

export interface PresentationConfig {
  presentationDate: Date;
  songs: Array<Song>;
  scriptures: Array<Scripture>;
  parts: Array<Part>;

  fontSize: number;
}
