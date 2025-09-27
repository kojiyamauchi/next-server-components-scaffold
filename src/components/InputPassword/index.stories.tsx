import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { InputPassword } from '.'

const meta = {
  title: 'components/InputPassword',
  component: InputPassword,
  parameters: {
    layout: 'centered',
  },
  args: {
    defaultValue: 'foobarbaz',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputPassword>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const ValidateError: Story = {
  args: {
    errors: ['Validate Error1.', 'Validate Error2.', 'Validate Error3.', 'Validate Error4.', 'Validate Error5.'],
  },
}
