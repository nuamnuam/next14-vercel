'use client';

import React from 'react';
import clsx from 'classnames';

import Icon from '@/components/Common/Icon';
import { showToast } from '@/components/ToastProvider';
import { useLang } from '@/hooks';

import IconButton from '../IconButton';
interface Props {
  className?: string;
  text?: string;
  variant?: 'light' | 'success';
  size?: 'sm' | 'lg';
  type?: 'copy' | 'paste';
  pasteCallback?: (val: string) => void;
  children?: React.ReactNode;
}

const Clipboard: React.FC<Props> = ({
  className,
  text,
  variant,
  size = 'lg',
  type = 'copy',
  pasteCallback = () => {},
  children,
}) => {
  const [global] = useLang(['global']);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    showToast.success(global.copied);
  };

  const paste = async () => {
    try {
      if (navigator.clipboard?.readText) {
        navigator.clipboard
          .readText()
          .then((res) => {
            pasteCallback(res);
          })
          .catch((err) => {
            console.error('Failed to read clipboard contents: ', err);
            showToast.warning(global.optError);
          });
      } else {
        // const textarea = document.createElement('textarea');
        // document.body.appendChild(textarea);
        // textarea.focus();
        // document.execCommand('paste');
        // const pastedText = textarea.value;
        // document.body.removeChild(textarea);
        // pasteCallback(pastedText);
      }
    } catch (exp) {
      showToast.warning(global.optError);
    }
  };

  if (children) {
    return <div onClick={copy}>{children}</div>;
  }

  if (type === 'paste') {
    return (
      <IconButton
        onClick={paste}
        icon={<Icon icon="Paste" size={24} className="text-primary-600" />}
        className={clsx('!w-auto !h-auto rounded-[4px] p-0', className)}
      />
    );
  }

  if (size === 'sm') {
    return (
      <span className={clsx('-mt-1 cursor-pointer', className)} onClick={copy}>
        <Icon icon="CopyLine-Filled" size={12} className="text-dark-200" />
      </span>
    );
  }

  if (variant === 'light')
    return (
      <span className={clsx('-mt-1 cursor-pointer', className)} onClick={copy}>
        <Icon icon="Copy" size={12} className="text-dark-200" />
      </span>
    );

  return (
    <IconButton
      onClick={copy}
      icon={<Icon icon="Copy" size={24} className="text-primary-600" />}
      className={clsx('!w-auto !h-auto rounded-[4px] p-0', className)}
    />
  );
};

export default Clipboard;
