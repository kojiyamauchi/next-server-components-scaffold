import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { InputPhone } from '.'

const meta = {
  title: 'components/InputPhone',
  component: InputPhone,
  parameters: {
    layout: 'centered',
  },
  args: {
    defaultValue1: '000',
    defaultValue2: '0000',
    defaultValue3: '0000',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputPhone>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const ValidateError: Story = {
  args: {
    errorPhone1: 'Validate Error 1',
    errorPhone2: 'Validate Error 2',
    errorPhone3: 'Validate Error 3',
  },
}
