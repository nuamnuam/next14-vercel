import { type Dispatch, type FC, type SetStateAction, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { type SelectChangeEvent } from '@mui/material/Select';
import classNames from 'classnames';
import { Checkbox } from '@mui/material';
import { colors } from '@/designTokens/colors';

interface Props {
  options: string[];
  setChangeResult: Dispatch<SetStateAction<string[]>>;
  label?: string;
  status: 'succuss' | 'error' | 'default';
  isDisabled?: boolean;
  placeholder?: string;
  placeholderExtraClassName?: string;
  helperText?: string;
  multiple?: boolean;
  icon?: React.ReactNode;
  type?: 'withCheckBox' | 'default';
  size?: 'md' | 'lg';
  selectClassName?: string;
  containerClassName?: string;
}

const Select: FC<Props> = ({
  label,
  options = [],
  multiple = false,
  isDisabled = false,
  setChangeResult,
  size = 'md',
  status = 'default',
  placeholder = 'placeholder',
  helperText,
  icon,
  placeholderExtraClassName,
  containerClassName,
  selectClassName,
  type = 'default',
}) => {
  const [selectedOptions, setselectedOptions] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedOptions>) => {
    const {
      target: { value },
    } = event;
    // On autofill we get a stringified value.
    const result = typeof value === 'string' ? value.split(',') : value;
    setselectedOptions(result);
    setChangeResult(result);
  };

  return (
    <div className={classNames(containerClassName)}>
      {label && (
        <div
          className={classNames(
            'px-2 text-sm font-medium text-dark-grey',
            isDisabled && 'opacity-50',
          )}
        >
          {label}
        </div>
      )}
      <MuiSelect
        disabled={isDisabled}
        sx={{
          '.MuiOutlinedInput-notchedOutline': {
            borderColor:
              status === 'succuss'
                ? colors.success.DEFAULT
                : status === 'error'
                ? colors.error.DEFAULT
                : colors.medium.grey,
          },
          '&:hover': {
            '&& fieldset': {
              border: '2px solid #D0D0D0',
            },
          },
          '&.Mui-focused': {
            '&& fieldset': {
              border: '1px solid #717171',
            },
          },
        }}
        className={classNames(
          '!rounded-lg !px-4 [&>div]:!py-0 [&>div]:!pl-0',
          selectClassName,
          size === 'lg' ? '!py-[15px]' : '!py-[11px]',
        )}
        multiple={multiple}
        displayEmpty
        value={selectedOptions}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected: any[] | any) => {
          if (selected.length === 0) {
            return (
              <span className="flex items-center">
                {icon && <span className="mr-2">{icon}</span>}
                <span
                  className={classNames(
                    'text-sm text-dark-grey',
                    placeholderExtraClassName,
                  )}
                >
                  {placeholder}
                </span>
              </span>
            );
          }

          return (
            <span className="flex items-center">
              {icon && <span className="mr-2">{icon}</span>}
              {selected.join(', ')}
            </span>
          );
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              '& .MuiMenuItem-root': {
                backgroundColor: '#FFFFFF !important',
                paddingY: size === 'lg' ? '18px' : '14px',
                paddingX: '16px',
                marginX: '16px',
                marginY: '2px',
              },
              '& .MuiMenuItem-root.Mui-selected': {
                borderRadius: '8px',
                backgroundColor: '#F7F7F7 !important',
              },
              '& .MuiMenuItem-root:hover': {
                borderRadius: '8px',
                backgroundColor: '#F7F7F7 !important',
              },
              '& .MuiMenuItem-root.Mui-selected:hover': {
                borderRadius: '8px',
                backgroundColor: '#F7F7F7 !important',
              },
            },
          },
        }}
      >
        {options?.map((option) => (
          <MenuItem key={option} value={option}>
            {type === 'withCheckBox' && (
              <Checkbox
                sx={{
                  paddingY: 0,
                  color: colors.dark.grey,
                  borderColor: colors.dark.grey,
                  '&.Mui-checked': {
                    color: colors.arzinja[500],
                  },
                }}
                checked={selectedOptions.includes(option)}
              />
            )}
            {option}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && (
        <div
          className={classNames(
            'px-2 text-sm font-medium text-dark-grey',
            isDisabled && 'opacity-50',
          )}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Select;
