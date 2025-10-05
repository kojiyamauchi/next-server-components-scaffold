import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { JSX } from 'react'

import { LoadingUserForm } from '.'

const meta = {
  title: 'features/Users/LoadingUserForm',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  render: (): JSX.Element => {
    return (
      <div className="flex items-center justify-center pt-[30px]">
        <LoadingUserForm />
      </div>
    )
  },
} satisfies Meta<typeof LoadingUserForm>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
