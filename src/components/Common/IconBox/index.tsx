import { Icon } from '@/components/Common';
import React from 'react';

interface Props {
  title: string;
  desc: string;
  icon: string;
}

const IconBox: React.FC<Props> = ({ title, desc, icon }) => {
  return (
    <div className="flex items-center">
      <div className="ml-4">
        <Icon icon={icon} size={32} className="[&>*]:fill-primary-200" />
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-xs leading-5 text-dark-500">{title}</span>
        <span className="font-bold leading-6 text-dark-600">{desc}</span>
      </div>
    </div>
  );
};

export default IconBox;
