import { forwardRef, useContext, useRef } from 'react';
import classNames from 'classnames';
import { Icon } from '@/components/Common';
import {
  maxDecimal,
  removeCommas,
  toEnglishDigits,
  toPersianDigits,
  toPrice,
} from '@/utils';
import { FormGroupContext } from './FormGroup';
import { maskCardNumber } from '@/utils/card-number';

export interface FormInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'disabled' | 'size'
  > {
  value?: string | number;
  rightIcon?: string | React.ReactNode;
  leftIcon?: string | React.ReactNode;
  type?: string;
  inputType?: string;
  success?: boolean;
  ltr?: boolean;
  fullWidth?: boolean;
  ltrPlaceholder?: boolean;
  error?: boolean;
  caption?: any;
  captionIcon?: any;
  containerClassName?: string;
  onlyNumber?: boolean;
  twin?: boolean;
  onChange?: (val: any) => void;
  disabled?: boolean;
  disabledMode?: 'success';
  seprator?: boolean;
  maxLength?: number;
  decimal?: number;
  searchInput?: boolean;
  size?: 'sm' | 'lg';
  hasClear?: boolean;
  mask?: boolean;
  checkZero?: boolean;
  leftIconClassname?: string;
}
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    {
      value,
      id,
      name,
      className,
      rightIcon,
      leftIcon,
      type = '',
      ltr = false,
      fullWidth = false,
      ltrPlaceholder = false,
      inputType = 'text',
      error = false,
      success = false,
      caption = null,
      captionIcon = null,
      containerClassName,
      onlyNumber = false,
      twin = false,
      onChange = () => {},
      disabled,
      disabledMode = 'success',
      seprator = false,
      maxLength,
      decimal,
      searchInput = false,
      size = 'lg',
      hasClear = false,
      mask = false,
      checkZero = true,
      leftIconClassname = '',
      ...props
    },
    ref,
  ) {
    const context = useContext(FormGroupContext);

    const inputId = () => {
      if (id && context.id) {
        return `${id}-${context.id}`;
      } else if (!id) {
        return context.id;
      } else {
        return '';
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      // Check maxLength of characters
      if (maxLength && value.length > maxLength) return;

      // Number logic
      if (onlyNumber) {
        // - Straight number (string)
        let straightNumber = removeCommas(toEnglishDigits(value));
        // - Is number?
        if (isNaN(+straightNumber)) return;
        // - Check multi zero in first
        if (checkZero && straightNumber.startsWith('00')) straightNumber = '0';
        // - Check no decimal character '.'
        if (!decimal && straightNumber.includes('.')) return;
        // - Max decimal
        if (decimal) {
          straightNumber = maxDecimal(straightNumber, decimal).toString();
        }
        onChange(toEnglishDigits(straightNumber));
        return;
      }

      if (mask) {
        const joinedValue = toEnglishDigits(value.split(' ').join(''));
        if (isNaN(Number(joinedValue))) return;
        onChange(joinedValue);
        return;
      }
      onChange(value);
    };

    const inputValue = () => {
      if (mask) {
        return toPersianDigits(maskCardNumber(value?.toString() ?? ''));
      }
      if (!onlyNumber) {
        return value;
      }
      //  Has seprator?
      if (seprator && value) return toPersianDigits(toPrice(value));
      return toPersianDigits(value);
    };

    const clearInput = () => {
      onChange('');
    };

    return (
      <div className={containerClassName}>
        <div
          className={classNames(
            'inputWrapper flex flex-row-reverse items-center border-dark-200',
            error && '!border-danger-200',
            success && '!border-success-50 !bg-success-50',
            className,
            context.color(),
            disabled && '!border-dark-50 !bg-dark-50',
            size === 'lg' ? 'h-12' : 'h-10',
          )}
        >
          <div
            className={classNames(
              'flex w-full items-center',
              twin && 'w-5/12',
              'px-3 md:px-4 py-3',
              rightIcon && '!pr-2.5',
              leftIcon && '!pl-2.5',
              'text-dark-grey',
            )}
          >
            {rightIcon && !twin && (
              <div className="flex items-center text-medium-grey peer-focus:text-dark-grey  peer-disabled:text-medium-grey ml-2">
                {rightIcon}
              </div>
            )}
            <input
              ref={ref}
              {...props}
              disabled={context.disabled || disabled}
              id={inputId()}
              name={name}
              value={inputValue() || ''}
              onChange={handleChange}
              type={inputType}
              className={classNames(
                fullWidth && 'w-full',
                success && 'bg-success-50 text-primary-700',
                disabled && '!text-dark-200',
                (ltr || onlyNumber) && 'input-ltr',
                ltrPlaceholder && 'input-ltr-placeholder',
              )}
            />
            {hasClear && inputValue() && (
              <Icon
                icon="Close-OutLined"
                size={12}
                className="cursor-pointer text-dark-500"
                onClick={() => {
                  onChange('');
                }}
              />
            )}
            {leftIcon && (
              <span
                className={classNames(
                  'flex items-center text-medium-grey peer-focus:text-dark-grey  peer-disabled:text-medium-grey mr-2',
                )}
              >
                {leftIcon}
              </span>
            )}
          </div>
          {rightIcon && twin && (
            <div
              className={classNames(
                'flex items-center justify-center p-3 w-7/12 max-w-[15rem] pr-0',
              )}
            >
              {rightIcon}
            </div>
          )}
          {searchInput && value && (
            <span
              className={classNames(
                'absolute inset-y-0  flex items-center pl-[0.69rem] text-medium-grey peer-focus:text-dark-grey  peer-disabled:text-medium-grey md:pl-[0.6rem]',
                leftIcon ? 'left-5' : 'left-1',
              )}
              onClick={clearInput}
            >
              <Icon
                icon={'Close-OutLined'}
                className="cursor-pointer"
                size={16}
              />
            </span>
          )}
        </div>
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
            <span className={captionIcon && 'mr-1.5'}>{caption}</span>
          </div>
        ) : null}
      </div>
    );
  },
);

export default FormInput;
