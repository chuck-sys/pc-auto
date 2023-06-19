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

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('formats lyrics with multiple blank lines separating', () => {
    const lyrics = `
    V:
    ABCDE


    FGHIJ




    C:
    e
    e





    eeeee
    `;
    const expectedParts = [
      {
        identifier: 'V',
        lyricsBySlide: [['ABCDE'], ['FGHIJ']]
      },
      {
        identifier: 'C',
        lyricsBySlide: [['e', 'e'], ['eeeee']]
      }
    ];

    expect(formattedLyricsToSongParts(lyrics)).toStrictEqual(expectedParts);
  });
  it('formats lyrics with multiple slides per part', () => {
    const lyrics = `
    V1:
    我唱出 神大愛

    神豈有難成的事

    人生路 常起跌

    你話語叫我永不動搖

    V2:
    在世間 能遇你
    迷了路有主引導

    常施恩 常看顧
    你杖扶持 你竿引領
    `;
    const expectedParts = [
      {
        identifier: 'V1',
        lyricsBySlide: [
          ['我唱出 神大愛'],
          ['神豈有難成的事'],
          ['人生路 常起跌'],
          ['你話語叫我永不動搖']
        ]
      },
      {
        identifier: 'V2',
        lyricsBySlide: [
          ['在世間 能遇你', '迷了路有主引導'],
          ['常施恩 常看顧', '你杖扶持 你竿引領']
        ]
      }
    ];

    expect(formattedLyricsToSongParts(lyrics)).toStrictEqual(expectedParts);
  });
  it('formats lyrics to song parts', () => {
    const lyrics = `
    V1:
    我唱出 神大愛
    神豈有難成的事
    人生路 常起跌
    你話語叫我永不動搖

    V2:
    在世間 能遇你
    迷了路有主引導
    常施恩 常看顧
    你杖扶持 你竿引領

    C:
    何時我跌倒 何時你扶持
    危難遇風雪 你必庇佑
    前途在祢手 牽我到白頭
    守護我 從今天起 直到永遠
    `;
    const expectedParts = [
      {
        identifier: 'V1',
        lyricsBySlide: [['我唱出 神大愛', '神豈有難成的事', '人生路 常起跌', '你話語叫我永不動搖']]
      },
      {
        identifier: 'V2',
        lyricsBySlide: [['在世間 能遇你', '迷了路有主引導', '常施恩 常看顧', '你杖扶持 你竿引領']]
      },
      {
        identifier: 'C',
        lyricsBySlide: [
          [
            '何時我跌倒 何時你扶持',
            '危難遇風雪 你必庇佑',
            '前途在祢手 牽我到白頭',
            '守護我 從今天起 直到永遠'
          ]
        ]
      }
    ];

    expect(formattedLyricsToSongParts(lyrics)).toStrictEqual(expectedParts);
  });
}
