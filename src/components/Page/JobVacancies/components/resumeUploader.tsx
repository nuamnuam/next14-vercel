import { type FC, useRef } from 'react';
import clsx from 'classnames';

import { Icon, Button, IconButton } from '@/components/Common';
import { toPersianDigits } from '@/utils';
import { useBreakpoint } from '@/hooks';

interface Props {
  placeholder?: string;
  value: File | undefined;
  onChange: (val: File | undefined) => void;
  error?: boolean;
  caption?: string;
  label?: string;
  className?: string;
  icon?: string;
  iconClassName?: string;
  btnLabel?: string;
}

const ResumeUploader: FC<Props> = ({
  value,
  label = '',
  className,
  caption,
  error,
  icon,
  iconClassName,
  onChange,
  btnLabel,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isMobile } = useBreakpoint();

  return (
    <div className="border border-dark-100 rounded-md mb-6 md:mb-0">
      <div
        className={clsx(
          'flex flex-col w-full items-start justify-start px-4 pb-4 md:py-2',
          className,
        )}
      >
        <div className="flex gap-x-2 items-center md:justify-center py-4">
          {icon && <Icon icon={icon} className={iconClassName} size={16} />}
          <p className={clsx('text-sm text-dark-600 font-normal')}>{label}</p>
        </div>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e?.target?.files?.[0]);
          }}
          ref={(n) => (inputRef.current = n)}
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".png,.jpg,.zip,.jpeg"
        />
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
          disabled={!!value}
          fullWidth={isMobile}
        >
          {btnLabel}
        </Button>
        {caption ? (
          <div
            className={clsx(
              'mt-1.5 flex w-full items-center text-sm',
              error && 'text-danger-600',
            )}
          >
            <span>{caption}</span>
          </div>
        ) : null}
      </div>
      {value != null && (
        <div className="border-t-2 border-t-dark-50 py-4 px-4 flex flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center justify-between">
          <div className="flex justify-start items-center gap-x-2">
            <Icon
              icon={'PaperClip-OutLined'}
              className="[&>*]:fill-primary-600"
              size={15}
            />
            <p className="text-xs text-primary-600">{value.name}</p>
          </div>
          <div className="flex justify-end items-center gap-x-2 w-full md:w-auto">
            <Icon
              icon={'PaperClip  -OutLined'}
              className="[&>*]:fill-primary-600"
              size={15}
            />
            <p className="text-dark-300 text-xs ml-auto md:ml-0" dir="ltr">
              ({toPersianDigits(Math.floor(value.size / 1000))}) kb
            </p>
            <IconButton
              onClick={() => onChange(undefined)}
              size="sm"
              className="mr-2 border-dark-400 text-dark-400 rounded-md"
              icon={<Icon icon={'Trash-OutLined'} size={12} />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
