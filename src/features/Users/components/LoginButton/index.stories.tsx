import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LoginButton } from '.'

const meta = {
  title: 'features/Users/LoginButton',
  component: LoginButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginButton>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
