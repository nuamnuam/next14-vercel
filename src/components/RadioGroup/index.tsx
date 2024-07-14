import { type FC, useCallback, useState } from 'react';
import clsx from 'classnames';

import { Icon } from '@/components/Common';
interface Props {
  options: Array<{
    key: string;
    value: string;
    label: string | React.ReactNode;
    el?: React.ReactNode;
    icon?: string;
    hasInputOnChange?: boolean;
  }>;
  onChange?: any;
  defaultSelected?: any;
  hideInput?: boolean;
  className?: {
    wrapper?: string;
    container?: string;
    option?: string;
    button?: string;
    input?: string;
  };
  staticOption?: React.ReactNode;
  switchTheme?: boolean;
  label?: string;
}

const RadioGroup: FC<Props> = ({
  options = [],
  onChange = () => {},
  defaultSelected = undefined,
  hideInput = true,
  className,
  staticOption,
  switchTheme = false,
  label,
}) => {
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = useCallback((value: string) => {
    setSelected(value);
    onChange(value);
  }, []);

  return (
    <div className={className?.wrapper}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-dark-600">
          {label}
        </span>
      )}
      <div
        className={clsx('flex rounded-lg bg-dark-50 p-1', className?.container)}
      >
        {options.map((item) => (
          <div
            className={clsx(className?.option, switchTheme && 'flex-1')}
            onClick={
              item.hasInputOnChange
                ? () => {
                    handleChange(item.value);
                  }
                : undefined
            }
          >
            <input
              hidden={hideInput}
              type="radio"
              checked={selected && item.value == selected}
              value={item.value}
              className={clsx(
                'h-4 w-4 text-primary-500 accent-primary-500 ring-2 ring-white',
                className?.input,
              )}
            />
            <button
              key={item.key}
              className={clsx(
                item.el
                  ? 'flex-auto self-stretch'
                  : `flex-1 rounded-lg py-2.5 text-sm ${
                      selected == item.value
                        ? 'bg-white text-primary-700 shadow-radio'
                        : 'text-dark-700 '
                    }`,
                !item.el && className?.button,
                switchTheme && 'w-full',
              )}
              onClick={
                !item.hasInputOnChange
                  ? () => {
                      handleChange(item.value);
                    }
                  : undefined
              }
            >
              {item.icon && (
                <Icon icon={item.icon} className="ml-1" size={15} />
              )}

              {item?.el ? item.el : <span>{item.label}</span>}
            </button>
          </div>
        ))}
        {staticOption || null}
      </div>
    </div>
  );
};

export default RadioGroup;
