import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Navigation } from '.'

const meta = {
  title: 'components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
