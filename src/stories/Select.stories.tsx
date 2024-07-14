import { Select } from '@/components/Common';
import { type Meta, type StoryObj } from '@storybook/react';

const meta: Meta<typeof Select> = {
  title: 'Example/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Select = StoryObj<typeof Select>;

export const Default: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
  },
};

export const Large: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
    size: 'lg',
  },
};

export const WithCheckBox: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
    type: 'withCheckBox',
  },
};

export const Multiple: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
    multiple: true,
  },
};

export const Label: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
    label: 'label',
  },
};

export const Disabled: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
    label: 'label',
    isDisabled: true,
  },
};

export const Status: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
    status: 'succuss',
  },
};

export const HelperText: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
    helperText: 'helperText',
  },
};

export const Placeholder: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
    placeholder: 'custom placeholder',
  },
};

export const Icon: Select = {
  args: {
    options: [
      'option option1',
      'option option2',
      'option option3',
      'option option4',
      'option option5',
    ],
  },
};
