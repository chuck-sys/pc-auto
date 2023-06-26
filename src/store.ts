import type { Part } from './parts';

export type SlideLyrics = Array<string>;

export interface SongPart {
  identifier: string;
  lyricsBySlide: Array<SlideLyrics>;
}

/**
 * Also used to cache any songs.
 */
export interface Song {
  title: string;
  artist: string;
  lyricist: string;
  parts: Array<SongPart>;
}

export interface Scripture {
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

/**
 * Convert formatted lyrics into parts of a song.
 *
 * Doesn't remove chords if any exist.
 */
export function formattedLyricsToSongParts(lyrics: string): Array<SongPart> {
  const parts: Array<SongPart> = [];

  let isPreviousLineEmpty = true;
  const songPart: SongPart = {
    identifier: '',
    lyricsBySlide: []
  };
  let slideLyrics: SlideLyrics = [];

  lyrics
    .trim()
    .split('\n')
    .forEach((line) => {
      line = line.trim();
      if (line.endsWith(':') && isPreviousLineEmpty) {
        if (songPart.lyricsBySlide.length > 0) {
          parts.push({ ...songPart });
        }

        songPart.identifier = line.substring(0, line.length - 1);
        songPart.lyricsBySlide = [];
        isPreviousLineEmpty = false;
      } else if (line.length === 0 && !isPreviousLineEmpty) {
        if (slideLyrics.length > 0) {
          songPart.lyricsBySlide.push([...slideLyrics]);
        }

        slideLyrics = [];
        isPreviousLineEmpty = true;
      } else if (line.length > 0) {
        slideLyrics.push(line);

        isPreviousLineEmpty = false;
      }
    });

  if (slideLyrics.length > 0) {
    songPart.lyricsBySlide.push(slideLyrics);
  }
  if (songPart.lyricsBySlide.length > 0) {
    parts.push(songPart);
  }

  return parts;
}
