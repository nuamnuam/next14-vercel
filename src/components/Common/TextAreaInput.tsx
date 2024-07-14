import React, { type ChangeEvent, type ReactNode } from 'react';
import classNames from 'classnames';

type TextAreaInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  error?: boolean;
  caption?: string;
  disabled?: boolean;
  captionIcon?: ReactNode;
  success?: boolean;
};

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  value,
  onChange,
  id,
  name,
  label,
  placeholder,
  error,
  caption,
  disabled,
  captionIcon,
  success,
}) => {
  return (
    <div>
      <label
        className={classNames('mb-2 block text-sm font-medium text-dark-600')}
        htmlFor={name}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        placeholder={placeholder}
        className={classNames(
          'w-full resize-y rounded-md border border-dark-200 px-3 py-2 text-sm font-normal hover:border-primary-200 focus:!border-primary-200 focus:outline-none ',
          error && '!border-danger-200',
        )}
        disabled={disabled}
      />
      {caption ? (
        <div
          className={classNames(
            'mt-1.5 flex items-center text-sm',
            error && 'text-danger-600',
            success && 'text-primary-600',
            !error && !success && 'text-dark-200 ',
          )}
        >
          {captionIcon && !!caption ? captionIcon : null}
          <span className={classNames({ 'mr-1.5': !!captionIcon })}>
            {caption}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default TextAreaInput;
