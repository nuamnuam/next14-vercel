import React, { useState } from 'react';
import clsx from 'classnames';
import styled from '@emotion/styled';
import {
  MenuItem,
  Select,
  type SelectChangeEvent,
  SelectProps,
} from '@mui/material';

import { colors } from '@/designTokens';
import { useBreakpoint } from '@/hooks';
import { useModal } from '@/hooks/useModal';

import Icon from '../Icon';
import { Modal } from '..';

type SelectOption = {
  value: string | number;
  label: any;
};

interface Props {
  name?: string;
  label?: string;
  isOpen?: boolean;
  defaultSelected?: string | number;
  disabled?: boolean;
  icon?: any;
  error?: boolean;
  warning?: boolean;
  fullWidth?: boolean;
  caption?: string;
  palceholder?: string;
  options: SelectOption[];
  classNames?: string;
  onChange?: (val: string) => void;
  selectClassName?: string;
  value?: string | number | undefined;
  onOptionClick?: (val: string | number) => void;
  menuListRefHandler?: (instance: Exclude<any, string> | undefined) => void;
}
const selectInputModalName = 'select-input-modal';

const SelectInput = React.forwardRef<SelectProps, Props>((props, ref) => {
  const {
    name = '',
    label,
    isOpen = false,
    defaultSelected,
    disabled = false,
    icon = false,
    error = false,
    warning = false,
    fullWidth = false,
    caption,
    palceholder,
    options = [],
    classNames,
    selectClassName,
    onChange = () => {},
    value = '',
    onOptionClick = () => {},
    menuListRefHandler,
  } = props;

  const { isDesktop } = useBreakpoint();
  const [open, setOpen] = useState<boolean>(isOpen);
  const { showSyncModal } = useModal(`${name}-${selectInputModalName}`);

  const handleOpen = (e: React.SyntheticEvent<Element, Event>) => {
    if (disabled) return;
    if (isDesktop) {
      setOpen(true);
    } else {
      e.preventDefault();
      showSyncModal();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    onChange(e.target.value as string);
  };

  return (
    <div className={clsx(fullWidth ? 'w-full' : 'w-auto', classNames)}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-dark-400">
          {label}
        </span>
      )}
      <div
        className={clsx(
          'relative rounded-lg border border-dark-200 focus-within:!border-primary-400 pl-4',
          disabled && '!border-dark-50 !bg-dark-50',
          selectClassName,
          error && '!border-danger-400',
        )}
      >
        <StyledSelect
          fullWidth
          variant="standard"
          value={value}
          open={open}
          onOpen={handleOpen}
          ref={ref}
          onClose={handleClose}
          onChange={handleChange}
          defaultValue={defaultSelected}
          className={clsx(
            icon && 'hasIcon',
            disabled && 'disabled',
            error && 'hasError',
            'text-7xl',
          )}
          disabled={disabled}
          MenuProps={{
            PaperProps: {
              sx: {
                marginTop: '0.2rem',
                borderRadius: '0.5rem',
                boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
                '& ul': {
                  maxHeight: '300px',
                },
                '& li': {
                  fontSize: '14px',
                  '&:hover': {
                    bgcolor: colors.dark[50],
                  },
                  '&.Mui-selected': {
                    bgcolor: colors.dark[50],
                    '&:hover': {
                      bgcolor: colors.dark[50],
                    },
                  },
                },
              },
              ref(instance: any) {
                menuListRefHandler?.(instance);
              },
            },
          }}
        >
          {options.map((item) => (
            <MenuItem
              value={item.value}
              onClick={() => {
                onOptionClick(item.value as string);
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </StyledSelect>
        <div
          className={clsx(
            'absolute left-4 top-0 flex h-full items-center',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          onClick={handleOpen}
        >
          <Icon
            icon="Down-OutLined"
            size={14}
            className={clsx(
              'text-dark-400 transition duration-300',
              open && 'rotate-180',
            )}
          />
        </div>
        {!value && palceholder && (
          <div
            className={clsx(
              'absolute top-2 cursor-pointer select-none font-medium text-sm text-dark-500 pt-[2px]',
              icon ? 'right-14' : 'right-4',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
            onClick={handleOpen}
          >
            {palceholder}
          </div>
        )}
        {icon && (
          <div
            className={clsx(
              'absolute right-3 top-2 cursor-pointer text-sm text-dark-300',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
            onClick={handleOpen}
          >
            {icon}
          </div>
        )}
      </div>
      {caption && (
        <div
          className={clsx(
            'mt-1 flex items-center justify-start text-sm text-dark-600',
            error && 'text-danger-600',
            warning && 'text-warning-600',
          )}
        >
          <span className={!warning && !error ? 'text-blue-500' : ''}>
            <Icon icon="InfoCircle-OutLined" size={14} />
          </span>
          <span className="mr-1.5">{caption}</span>
        </div>
      )}
      <SelectInputModal {...props} />
    </div>
  );
});

const SelectInputModal: React.FC<Partial<Props>> = ({
  name = '',
  options = [],
  onChange = () => {},
}) => {
  const { closeSyncModal } = useModal(`${name}-${selectInputModalName}`);

  const handleChange = (item: SelectOption) => {
    onChange(item.value as string);
    closeSyncModal();
  };
  return (
    <Modal
      sync
      name={`${name}-${selectInputModalName}`}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames=" !pt-8 "
    >
      {options.map((item) => (
        <MenuItem
          value={item.value}
          onClick={() => {
            handleChange(item);
          }}
          className="h-[43px] !rounded-lg hover:!bg-dark-100"
        >
          {item.label}
        </MenuItem>
      ))}
    </Modal>
  );
};

const StyledSelect = styled(Select)(({ theme, disabled }) => ({
  outline: 'none',
  minWidth: '140px',
  height: '100%',
  '&::after': {
    display: 'none',
  },
  '&::before': {
    display: 'none',
  },
  '.MuiSelect-select': {
    height: '100%',
    color: '#373B4F !important',
    fontWeight: '500',
    '&:focus': {
      background: 'transparent',
    },
  },
  '.MuiInputBase-input': {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingRight: '1rem !important',
    color: '#4E536B',
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
  },
  '.MuiSelect-icon': {
    display: 'none',
  },
  '&.hasIcon': {
    '.MuiInput-input': {
      paddingRight: '2.5rem !important',
    },
  },
  '.MuiPaper-elevation': {
    display: 'none',
  },
  '& li.Mui-selected': {
    fontSize: '12 !important',
    backgroundColor: '#cccccc',
  },
}));

export default SelectInput;
