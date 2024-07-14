import { Button } from '@/components/Common';
import { type Meta, type StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'Button Title',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    variant: 'primary',
    children: 'Button Title',
    onClick: () => {
      console.log('click on FullWidth');
    },
  },
};

export const Outlined: Story = {
  args: {
    variant: 'primary',
    children: 'Button Title',
    onClick: () => {
      console.log('click on Outlined');
    },
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Button Title',
    onClick: () => {
      console.log('click on Link');
    },
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    onClick: () => {
      console.log('click on WithIcon');
    },
    disabled: false,
    children: 'Button Title',
  },
};

export const IsBusy: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    onClick: () => {
      console.log('click on IsBusy');
    },
    disabled: false,
    isBusy: true,
    children: 'Button Title',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    onClick: () => {
      console.log('click on Disabled');
    },
    disabled: true,
    children: 'Button Title',
  },
};
