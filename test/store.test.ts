import { describe, it, expect } from 'vitest';
import { formattedLyricsToSongParts } from '../src/store';
import type { SongPart } from '../src/store';

describe('formattedLyricsToSongParts', () => {
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
    const expectedParts: SongPart[] = [
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
    const expectedParts: SongPart[] = [
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
    const expectedParts: SongPart[] = [
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
});
