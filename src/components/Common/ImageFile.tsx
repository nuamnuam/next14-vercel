import { type FC, useRef } from 'react';
import clsx from 'classnames';

import { Icon } from '@/components/Common';
import { useLang } from '@/hooks';

interface Props {
  placeholder?: string;
  value: File | undefined;
  onChange: (val: File | undefined) => void;
  error?: boolean;
  caption?: string | React.ReactNode;
  label?: string;
  className?: string;
}

const RenderPreview = ({ file }: { file: Blob | MediaSource }) => {
  let imagePreview: any;
  try {
    imagePreview = URL.createObjectURL(file);
  } catch (e) {
    imagePreview = file;
  }
  return (
    <img
      src={imagePreview}
      className="rounded-lg w-full h-full object-contain"
      alt="preview"
    />
  );
};

const ImageFile: FC<Props> = ({
  value,
  label = '',
  className,
  caption,
  error,
  onChange,
}) => {
  const [kyc] = useLang(['kyc']);

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={clsx(' w-full items-center justify-center', className)}>
      <label
        htmlFor="dropzone-file"
        className={clsx(
          'overflow-hidden m-0 !h-[212px] !w-full cursor-pointer rounded-lg border-2 bg-dark-50 hover:bg-gray-100 block',
          !!value && !error && 'pointer-events-none',
          error && '!border-danger-200',
        )}
      >
        <div className="flex items-center justify-center h-full w-full p-2">
          {value != null && !error ? (
            <RenderPreview file={value} />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Icon
                icon={'AddPicture-OutLined'}
                className={clsx(
                  error ? '[&>*]:fill-danger-500' : '[&>*]:fill-dark-400',
                )}
                size={32}
              />
              <p
                className={clsx(
                  'mt-6 text-sm font-medium',
                  error ? 'text-danger-600' : 'text-dark-500',
                )}
              >
                {label}
              </p>
            </div>
          )}
        </div>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (!e.target.files?.[0]) return;
            onChange(e?.target?.files?.[0]);
          }}
          ref={inputRef}
          accept="image/*"
          id="dropzone-file"
          type="file"
          className="hidden"
        />
      </label>
      {caption && (
        <div
          className={clsx(
            'mt-1.5 flex w-full items-center text-sm',
            error && 'text-danger-600',
          )}
        >
          <span>{caption}</span>
        </div>
      )}
      {value != null && !error ? (
        <div
          className="mt-6 flex cursor-pointer items-center justify-center gap-x-2"
          onClick={() => inputRef.current?.click()}
        >
          <Icon
            icon={'Reload-OutLined'}
            className="[&>*]:fill-primary-600"
            size={18}
          />
          <p className="text-sm font-medium text-primary-600">
            {kyc.selectAgain}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ImageFile;
