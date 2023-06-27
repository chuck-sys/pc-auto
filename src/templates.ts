import type { Part } from './parts';

export interface Template {
  name: string;
  description: string;
  parts: Part[];
}

const installedTemplates: Template[] = [
  {
    name: 'Default',
    description: 'A default template.',
    parts: [
      {
        type: 'welcome'
      },
      {
        type: 'call-to-worship'
      }
    ]
  },
  {
    name: 'Communion',
    description: 'The default template but with added communion slides.',
    parts: [
      {
        type: 'welcome'
      },
      {
        type: 'call-to-worship'
      }
    ]
  }
];

export {
  installedTemplates
};
