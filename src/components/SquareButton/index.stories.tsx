import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SquareButton } from '.'

const meta = {
  title: 'components/SquareButton',
  component: SquareButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SquareButton>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    type: 'button',
    label: 'EXAMPLE',
  },
}
