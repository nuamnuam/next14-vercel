import { toPersianDigits } from '@/utils';
import React from 'react';

interface Props {
  index: number;
  title: string;
  description: string;
}

const DescItem: React.FC<Props> = ({ index, title, description }) => {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="ml-2 flex h-[21px] w-[21px] items-center justify-center rounded-full bg-primary-500 pt-[2px] font-bold text-white">
          {toPersianDigits(index)}
        </div>
        <span className="text-sm font-medium text-dark-600">{title}</span>
      </div>
      <span className="mt-4 block text-xs leading-5 text-dark-400">
        {description}
      </span>
    </div>
  );
};

export default DescItem;
