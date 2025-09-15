import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CreateUserButton } from '.'

const meta = {
  title: 'features/Users/CreateUserButton',
  component: CreateUserButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreateUserButton>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
