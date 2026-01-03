import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.css'
import '../src/styles/globals.css'
import { withReduxStore, withTheme } from '../src/storybook/decorators'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },
    backgrounds: {
      default: 'Dark',
      values: [
        { name: 'Dark', value: '#0b1116' },
        { name: 'Light', value: '#f2fbf8' }
      ]
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '360px', height: '780px' }
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' }
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '720px' }
        }
      }
    }
  },
  decorators: [withReduxStore(), withTheme()]
};

export default preview;
