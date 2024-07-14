import classNames from 'classnames';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FC, type ReactNode, forwardRef, useEffect, useState } from 'react';
import { Checkbox as MuiCheckBox } from '@mui/material';
import { colors } from '../../designTokens/colors';

interface Props {
  label?: string | React.ReactNode;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'arzinja' | 'green' | 'blue' | 'pink' | 'yellow';
  icon?: ReactNode;
  checkedIcon?: ReactNode;
  isChecked?: boolean;
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
  isDisabled?: boolean;
  error?: boolean;
  className?: string;
  containerClassName?: string;
  labelSize?: 'xs' | 'sm' | 'md' | 'lg';
  handleInputChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, Props>(
  (
    {
      label = '',
      name = '',
      size = 'small',
      color = 'arzinja',
      icon,
      checkedIcon,
      isChecked = false,
      labelPlacement = 'end',
      isDisabled = false,
      error = false,
      className,
      containerClassName,
      labelSize = 'sm',
      handleInputChange,
    },
    ref,
  ) => {
    const [checked, setChecked] = useState(isChecked);

    useEffect(() => {
      setChecked(isChecked);
    }, [isChecked]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      handleInputChange?.(event.target.checked);
    };

    return (
      <FormControlLabel
        className={classNames(
          containerClassName,
          '!m-0',
          '[&>.MuiFormControlLabel-label]:text-dark-grey',
        )}
        style={{ marginRight: 0 }}
        control={
          <MuiCheckBox
            inputRef={ref}
            name={name}
            sx={{
              color: error ? colors.danger[500] : colors.dark[500],
              // borderColor: colors.dark[500],
              '&.MuiCheckbox-root': {
                padding: '9px !important',
                transition: 'all 0.2s',
                '&:hover': {
                  transition: 'all 0.2s',
                  background:
                    error && !isChecked ? colors.dark[50] : colors.primary[50],
                },
                '&:focus': {
                  transition: 'all 0.2s',
                  background:
                    error && !isChecked
                      ? colors.danger[50]
                      : colors.primary[50],
                },
              },
              '&.Mui-checked': {
                color:
                  color === 'arzinja'
                    ? colors[color][500]
                    : colors[color].DEFAULT,
                '& + .MuiFormControlLabel-label': {
                  color: colors.black,
                  margin: 0,
                },
              },
            }}
            className={classNames(
              className,
              size === 'large' && '[&>.MuiSvgIcon-root]:text-[28px]',
            )}
            size={size === 'small' || size === 'medium' ? size : undefined}
            icon={icon}
            checkedIcon={checkedIcon}
            checked={checked}
            onChange={handleChange}
            disabled={isDisabled}
            style={{ padding: 0 }}
          />
        }
        label={<span className={`text-${labelSize}`}>{label}</span>}
        labelPlacement={labelPlacement}
      />
    );
  },
);

export default Checkbox;
