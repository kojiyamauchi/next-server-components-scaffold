import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Label } from '.'

const meta = {
  title: 'features/Users/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
