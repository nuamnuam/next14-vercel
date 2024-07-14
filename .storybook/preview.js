import '../src/styles/global.css';
import '../src/styles/badge.css';
import '../src/styles/tab.css';
import '../src/styles/buttons.css';
import '../src/styles/inputs.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
