/// TODO add the remaining different types of parts
/// Using strings as types isn't optimal, but we work with what we are given because Typescript enums are
/// essentially incompatible with Vue stuffs

export interface Welcome {
  type: 'welcome';
}

export interface Song {
  type: 'song';
  songId: number;
  songPart: number;
}

export interface CallToWorship {
  type: 'call-to-worship';
}

export interface PsalmResponse {
  type: 'psalm-response';
  scriptureId: number;
}

export interface Reading {
  type: 'reading';
  scriptureId: number;
}

export interface PartGroup {
  type: 'group';
  name?: string;
  parts: Part[];
}

export type Part = Welcome | CallToWorship | Song | PsalmResponse | Reading | PartGroup;

/**
 * Flatten all PartGroups within a list of Parts, recursively.
 *
 * Does not make a copy of any of the parts.
 *
 * Update this function when recursion no longer cuts it. Which is basically never. Even though this is
 * inefficient, it only runs once every time the presentation has to be exported to `.pptx`.
 */
export function flattenParts(parts: Part[]): Part[] {
  let flattenedParts: Part[] = [];

  parts.forEach((part) => {
    if (part.type !== 'group') {
      flattenedParts.push(part);
    } else {
      flattenedParts = flattenedParts.concat(flattenParts(part.parts));
    }
  });

  return flattenedParts;
}
