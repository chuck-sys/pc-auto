import { describe, it, expect } from 'vitest';
import { flattenParts } from '../src/parts';
import type { Part } from '../src/parts';

describe('flattenParts', () => {
  it('makes no changes to non-grouped parts', () => {
    const parts: Part[] = [
      {
        type: 'welcome'
      },
      {
        type: 'song',
        songId: 0,
        songPart: 1,
      },
    ];

    expect(flattenParts(parts)).toEqual(parts);
  });

  it('flattens groups', () => {
    const innerParts: Part[] = [
      {
        type: 'welcome'
      }
    ];
    const parts: Part[] = [
      {
        type: 'group',
        parts: innerParts
      }
    ];

    expect(flattenParts(parts)).toEqual(innerParts);
  });

  it('flattens multiple nested groups', () => {
    const parts: Part[] = [
      {
        type: 'group',
        parts: [
          {
            type: 'group',
            parts: [
              {
                type: 'welcome'
              }
            ]
          }
        ]
      },
      {
        type: 'group',
        parts: [
          {
            type: 'group',
            parts: [
              {
                type: 'group',
                parts: [
                  {
                    type: 'call-to-worship'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    expect(flattenParts(parts)).toEqual([
      {
        type: 'welcome'
      },
      {
        type: 'call-to-worship'
      }
    ]);
  });

  it('flattens a nested empty group', () => {
    const parts: Part[] = [
      {
        type: 'group',
        parts: [
          {
            type: 'group',
            parts: [
              {
                type: 'group',
                parts: []
              }
            ]
          }
        ]
      }
    ];

    expect(flattenParts(parts)).toEqual([]);
  });
});
