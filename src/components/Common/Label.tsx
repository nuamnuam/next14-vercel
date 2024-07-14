import React from 'react';
import { Icon } from '@/components/Common';

type LabelProps = {
  text: string;
  leftIcon: string;
  rightIcon: string;
  color: string;
  size: number;
  className?: string;
  iconClassName?: string;
  iconSize?: number;
};

const Label: React.FC<LabelProps> = ({
  text,
  leftIcon,
  rightIcon,
  className,
  iconClassName,
  iconSize,
}) => {
  return (
    <div className={className}>
      {leftIcon && (
        <Icon icon={leftIcon} className={iconClassName} size={iconSize} />
      )}
      {text}
      {rightIcon && (
        <Icon icon={rightIcon} className={iconClassName} size={iconSize} />
      )}
    </div>
  );
};

export default Label;
