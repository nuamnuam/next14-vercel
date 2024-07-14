import React, { type FC } from 'react';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const switchStyle = {
  padding: '4px 5px',

  borderRadius: 2,
  '& .MuiSwitch-root': {
    padding: '4px !important',
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#00CB8C',
  },
  '& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
    backgroundColor: '#00CB8C',
  },

  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: '6px 8px',
    '& + .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#9A9EB5',
    },
    '&.Mui-checked': {
      padding: '6px 4px',
      transform: 'translateX(12px)',
      right: 4,
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#00CB8C',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 22,
    height: 22,
    borderRadius: 6,
    boxSizing: 'border-box',
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    backgroundColor: '#000000',
    boxSizing: 'border-box',
    height: '26px !important',
    width: '52px !important',
  },
};

interface Props {
  value?: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  checked?: boolean;
  isDisabled?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

const SwitchButton: FC<Props> = ({
  label = '',
  className,
  checked,
  isDisabled = false,
  onChange,
}) => {
  return (
    <div className={className}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={onChange}
            sx={switchStyle}
            disabled={isDisabled}
          />
        }
        label={label}
      />
    </div>
  );
};

export default SwitchButton;
