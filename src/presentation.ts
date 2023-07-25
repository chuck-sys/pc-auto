import pptxgen from 'pptxgenjs';
import { flattenParts, Song } from './parts';
import type { PresentationConfig } from './store';

export function createPresentation(saveData: PresentationConfig): pptxgen {
  const presentation = new pptxgen();

  flattenParts(saveData.parts).forEach((part) => {
    switch (part.type) {
      case 'welcome':
        welcomeSlides(saveData, presentation);
        break;
      case 'song':
        songSlides(saveData, part, presentation);
        break;
      default:
        break;
    }
  });

  return presentation;
}

function welcomeSlides(saveData: PresentationConfig, presentation: pptxgen) {
  const slide = presentation.addSlide();
  slide.addText('Welcome!', { x: '50%', y: '50%', fontSize: saveData.fontSize });
}

function songSlides(saveData: PresentationConfig, song: Song, presentation: pptxgen) {
  const lyricsBySlide = saveData.songs[song.songId].parts[song.songPart].lyricsBySlide;
  lyricsBySlide.forEach((lyrics) => {
    const slide = presentation.addSlide();
    slide.addText(lyrics.join('\n'), {
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      fontSize: saveData.fontSize
    });
  });
}
