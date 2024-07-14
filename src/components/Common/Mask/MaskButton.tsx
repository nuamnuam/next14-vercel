import React from 'react';
import { useGlobalStore } from '@/store';
import IconButton from '@/components/Common/IconButton';
import Icon from '@/components/Common/Icon';
import clsx from 'classnames';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  classNames?: string;
}

const MaskButton: React.FC<Props> = ({ size = 'md', classNames }) => {
  const { isMaskedValue, setIsMaskedValue } = useGlobalStore((state) => ({
    isMaskedValue: state.isMaskedValue,
    setIsMaskedValue: state.setIsMaskedValue,
  }));

  return (
    <IconButton
      className={clsx('border border-dark-200 bg-white', classNames)}
      onClick={setIsMaskedValue}
      size={size}
      icon={
        <Icon
          icon={isMaskedValue ? 'EyeInvisible-OutLined' : 'Eye-OutLined'}
          className="text-dark-500"
          size={size === 'lg' ? 20 : 16}
        />
      }
    />
  );
};

export default MaskButton;
