import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { List } from '.'

const meta = {
  title: 'features/Users/List',
  component: List,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof List>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    id: 9999999,
    name: 'ながーーーーーーーい苗字 ながーーーーーーーい名前',
    url: 'https://example.com',
    phone: '000-0000-0000',
    email: 'foo@example.com',
    createAt: '2025-09-05 17:06:22',
    updateAt: '2025-09-05 17:06:22',
  },
}
