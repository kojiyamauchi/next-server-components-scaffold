import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { InputText } from '.'

const meta = {
  title: 'components/InputText',
  component: InputText,
  parameters: {
    layout: 'centered',
  },
  args: {
    name: 'example',
    label: 'Example Text',
    defaultValue: 'foobarbaz',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputText>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const ValidateError: Story = {
  args: {
    errors: ['Validate Error1.', 'Validate Error2.', 'Validate Error3.', 'Validate Error4.', 'Validate Error5.'],
  },
}
