import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Heading } from '.'

const meta = {
  title: 'components/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Heading>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    heading: 'This is Storybook',
  },
}
