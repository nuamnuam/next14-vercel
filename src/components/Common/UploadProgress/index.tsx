import React, { useMemo } from 'react';
import clsx from 'classnames';
import Icon from '../Icon';
import IconButton from '../IconButton';
import { toPersianDigits } from '@/utils';

interface Props {
  size?: 'sm' | 'lg';
  loaded: number;
  total: number;
  name: string;
  success?: boolean;
  classNames?: string;
}

const UploadProgress: React.FC<Props> = ({
  size = 'lg',
  loaded = 0,
  total = 0,
  name,
  success = false,
  classNames,
}) => {
  const percent = useMemo(() => {
    if (!total) return 0;
    return Number(((loaded * 100) / total).toFixed(0));
  }, [loaded, total]);

  return (
    <div
      className={clsx(
        'flex gap-2',
        size === 'lg' ? 'justify-between items-center' : 'flex-col items-start',
        classNames,
      )}
    >
      <div className={clsx('flex gap-2 items-center ml-auto')}>
        <Icon
          icon="PaperClip-OutLined"
          className={clsx(success ? 'text-primary-600' : 'text-dark-300')}
          size={12}
        />
        <span
          className={clsx(
            'text-xs',
            success ? 'text-primary-600' : 'text-dark-700',
          )}
        >
          {name}
        </span>
      </div>
      <div
        className={clsx(
          'flex gap-4 items-center lg:w-full',
          size === 'sm' ? 'justify-between' : 'justify-end',
        )}
      >
        <span className="text-dark-300 text-xs">
          ({toPersianDigits(total)} kb)
        </span>
        <div className="flex gap-4 items-center">
          {!success && (
            <div className=" w-[104px] h-[5px] rounded-lg bg-dark-50 relative overflow-hidden">
              <div
                className="absolute h-[5px] left-0 top-0 rounded-lg bg-primary-600"
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
          {success && (
            <IconButton
              size="sm"
              className="!rounded-md"
              icon={
                <Icon
                  icon="Trash-OutLined"
                  size={12}
                  className="PaperClip-OutLined text-dark-400"
                />
              }
            />
          )}
          {!success && (
            <span className="text-primary-600 text-xs">
              ٪{toPersianDigits(percent)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
