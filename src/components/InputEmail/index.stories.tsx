import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { InputEmail } from '.'

const meta = {
  title: 'components/InputEmail',
  component: InputEmail,
  parameters: {
    layout: 'centered',
  },
  args: {
    defaultValue: 'foo@example.com',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputEmail>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const ValidateError: Story = {
  args: {
    error: 'Validate Error',
  },
}
