import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Timestamp } from '.'

const meta = {
  title: 'features/Users/Timestamp',
  component: Timestamp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Timestamp>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    createAt: '2025-09-05 17:06:22',
    updateAt: '2025-09-05 17:06:22',
  },
}
