import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/styles/globals.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { sourceSans, notoSans, lobster } from '../src/app/layout'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200..900&f ily=Noto+Sans:wght@100..900&family=Lobster&display=swap"
          rel="stylesheet"
        />
        <div className={`${sourceSans.variable} ${notoSans.variable} ${lobster.variable} antialiased w-full`}>
          <div className="font-source-sans font-noto-sans">
            <Story />
          </div>
        </div>
      </>
    ),
  ],
}

export default preview
