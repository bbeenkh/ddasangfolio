import type { Preview } from '@storybook/react';
import React from 'react';
import '../lib/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f0f0f0',
        },
      ],
    },
  },
};

export const decorators = [
  (Story) => (
    <Story />
  ),
];

export default preview;
