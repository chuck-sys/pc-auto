/// TODO add the remaining different types of parts

interface Welcome {
  type: 'welcome';
}

interface Song {
  type: 'song';
  songId: number;
  songPart: number;
  displayMetadata: boolean;
}

interface CallToWorship {
  type: 'call-to-worship';
}

interface PsalmResponse {
  type: 'psalm-response';
  scriptureId: number;
  isLastVerseSaidTogether: boolean;
}

interface OldTestamentReading {
  type: 'ot-reading';
  scriptureId: number;
}

interface NewTestamentReading {
  type: 'nt-reading';
  scriptureId: number;
}

interface PartGroup {
  type: 'group';
  parts: Part[];
}

export type Part =
  | Welcome
  | CallToWorship
  | Song
  | PsalmResponse
  | OldTestamentReading
  | NewTestamentReading
  | PartGroup;
