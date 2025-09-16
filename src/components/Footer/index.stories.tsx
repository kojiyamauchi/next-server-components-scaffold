import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Footer } from '.'

const meta = {
  title: 'components/Footer',
  component: Footer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
