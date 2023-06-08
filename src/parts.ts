/// TODO add the remaining different types of parts
export enum PartType {
  Welcome,
  Song,
  CallToWorship,
  VerseByVerseResponse,
  OldTestamentReading,
  NewTestamentReading
}

interface Welcome {
  type: PartType.Welcome;
}

interface Song {
  type: PartType.Song;
  songId: number;
  songPart: number;
  displayMetadata: boolean;
}

interface CallToWorship {
  type: PartType.CallToWorship;
}

interface VerseByVerseResponse {
  type: PartType.VerseByVerseResponse;
  scriptureId: number;
  isLastVerseSaidTogether: boolean;
}

interface OldTestamentReading {
  type: PartType.OldTestamentReading;
  scriptureId: number;
}

interface NewTestamentReading {
  type: PartType.NewTestamentReading;
  scriptureId: number;
}

export type Part =
  | Welcome
  | CallToWorship
  | Song
  | VerseByVerseResponse
  | OldTestamentReading
  | NewTestamentReading;
