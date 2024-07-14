import { forwardRef, useContext, useEffect, useRef } from 'react';
import { FormGroupContext } from './FormGroup';
import classNames from 'classnames';
import { toPersianDigits } from '@/utils';

interface Props
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled'> {
  value?: string | number;
  counter?: boolean;
  maxHeight?: number;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, Props>(
  function FormTextarea(
    { value, onChange = () => {}, id, counter, maxHeight, ...props },
    ref,
  ) {
    const context = useContext(FormGroupContext);
    const internalRef = useRef<HTMLTextAreaElement>(null);

    const inputId = () => {
      if (id && context.id) {
        return `${id}-${context.id}`;
      } else if (!id) {
        return context.id;
      } else {
        return '';
      }
    };

    const resizeTextarea = () => {
      if (!internalRef.current || !maxHeight) return;
      internalRef.current.style.height = 'auto';
      const inputScrollHeight = internalRef.current.scrollHeight;
      internalRef.current.style.height =
        (inputScrollHeight > maxHeight ? maxHeight : inputScrollHeight + 1) +
        'px';
    };

    useEffect(() => {
      if (typeof ref === 'function') {
        ref(internalRef.current);
      } else if (ref) {
        ref.current = internalRef.current;
      }
    }, [ref]);

    useEffect(() => {
      resizeTextarea();
    }, [value]);

    return (
      <div className="relative">
        <textarea
          rows={6}
          ref={internalRef}
          {...props}
          id={inputId()}
          disabled={context.disabled}
          value={value}
          onChange={onChange}
          className={classNames(
            'border-1 form-textarea z-0 h-full w-full resize-none rounded-lg border-medium-grey px-6 py-5 text-sm placeholder-medium-grey transition   focus:border-primary-500 focus:outline-none focus:ring-0 disabled:bg-light-grey disabled:hover:border-medium-grey',
            props.className,
            context.color(),
          )}
        />
        {counter && props.maxLength && (
          <div className="absolute left-0 bottom-0 px-2 py-1 text-xxs text-dark-300">
            {toPersianDigits(
              `${String(value ?? '').length}/${props.maxLength}`,
            )}
          </div>
        )}
      </div>
    );
  },
);

export default FormTextarea;
