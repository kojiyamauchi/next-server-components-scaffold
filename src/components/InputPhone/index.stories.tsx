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
    errorsPhone1: ['Validate Error1.', 'Validate Error2.', 'Validate Error3.', 'Validate Error4.', 'Validate Error5.'],
    errorsPhone2: ['Validate Error1.', 'Validate Error2.', 'Validate Error3.', 'Validate Error4.', 'Validate Error5.'],
    errorsPhone3: ['Validate Error1.', 'Validate Error2.', 'Validate Error3.', 'Validate Error4.', 'Validate Error5.'],
  },
}
