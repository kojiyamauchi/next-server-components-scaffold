import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { PageLoading } from '.'

const meta = {
  title: 'components/PageLoading',
  component: PageLoading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageLoading>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
