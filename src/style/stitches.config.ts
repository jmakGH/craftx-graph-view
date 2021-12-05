import { createStitches } from '@stitches/react';

export const {
  config,
  theme,
  createTheme,
  css,
  getCssText,
  globalCss,
  keyframes,
  styled,
} = createStitches({
  theme: {
    fontSizes: {
      small: '11pt',
      body: '13pt',
      heading: '15pt',
    },
  },
});
