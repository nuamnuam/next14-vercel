import React from 'react';
import BitcoinIcon from '@/components/Icons/BitcoinIcon';
import clsx from 'classnames';
import Icon from '../Icon';

interface Props {
  label?: string | React.ReactNode;
  value?: string | React.ReactElement;
  placeholder?: string | React.ReactElement;
  onClick: () => void;
  disabled?: boolean;
  align?: 'right' | 'left';
  alignPlaceholder?: 'right' | 'left';
}

const ModalInput: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onClick = () => {},
  disabled = false,
  align = 'right',
  alignPlaceholder = 'right',
}) => {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <div className="w-full">
      {label && (
        <span className="mb-2 mr-1 block text-sm font-medium text-dark-600">
          {label}
        </span>
      )}
      <div
        onClick={handleClick}
        className={clsx(
          'flex h-12 w-full items-center justify-between overflow-hidden rounded-lg border border-dark-200 bg-white px-3 ',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          disabled &&
            'relative after:absolute after:right-0 after:h-full after:w-full after:bg-dark-50 after:opacity-30',
        )}
      >
        {value ? (
          <div
            className={clsx(
              'flex flex-auto items-center',
              align === 'left' ? 'justify-end' : 'justify-start',
            )}
          >
            {value}
          </div>
        ) : (
          <div
            className={clsx(
              'flex flex-auto items-center',
              alignPlaceholder === 'left' ? 'justify-end' : 'justify-start',
            )}
          >
            {<span className="text-sm text-dark-200">{placeholder}</span>}
          </div>
        )}
        <Icon icon="Down-OutLined" size={16} className="mr-4 text-dark-400" />
      </div>
    </div>
  );
};

export default ModalInput;
