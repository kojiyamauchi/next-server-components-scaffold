import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LogoutButton } from '.'

const meta = {
  title: 'features/Users/LogoutButton',
  component: LogoutButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LogoutButton>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    onClick: () => console.info('On Click.'),
  },
}
