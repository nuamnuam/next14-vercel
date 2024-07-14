import { Accordion } from '@/components/Common';
import { type Meta, type StoryObj } from '@storybook/react';

const meta: Meta<typeof Accordion> = {
  title: 'Example/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;
type Accordion = StoryObj<typeof Accordion>;

export const Default: Accordion = {
  args: {
    title: 'PLACE TITLE HERE',
    description:
      'Lorem ipsum dolor sit amet consectetur. Et elementum sed ultricies hendrerit nibh malesuada metus. Ullamcorper aenean in scelerisque non nullam pellentesque sit aenean molestie.',
  },
};

export const Expanded: Accordion = {
  args: {
    isExpanded: true,
    title: 'PLACE TITLE HERE',
    description:
      'Lorem ipsum dolor sit amet consectetur. Et elementum sed ultricies hendrerit nibh malesuada metus. Ullamcorper aenean in scelerisque non nullam pellentesque sit aenean molestie.',
  },
};
