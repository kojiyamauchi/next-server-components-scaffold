import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LoadingForm } from '.'

const meta = {
  title: 'components/LoadingForm',
  component: LoadingForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingForm>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Example Loading Form',
  },
  render: ({ ...arg }) => {
    return (
      <div className="w-[400px]">
        <LoadingForm {...arg} />
      </div>
    )
  },
}
