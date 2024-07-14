import FormControlLabel from '@mui/material/FormControlLabel';
import { type FC } from 'react';
import { Radio as MuiRadio } from '@mui/material';
import { colors } from '@/designTokens';

interface Props {
  value: string;
  checked?: boolean;
  label?: string;
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
  isDisable?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

const Radio: FC<Props> = ({
  value,
  checked,
  onChange,
  label = '',
  labelPlacement = 'end',
  isDisable = false,
  className,
}) => {
  return (
    <FormControlLabel
      value={value}
      checked={checked}
      onChange={() => onChange?.(value)}
      sx={{
        margin: 0,
        '& .MuiFormControlLabel-label': {
          fontSize: '14px',
          marginRight: '6px',
        },
        '&:not(.Mui-disabled)': {
          '& .MuiFormControlLabel-label': {
            color: `${colors.dark[900]} !important`,
          },
        },

        '&.Mui-disabled': {
          '& .MuiFormControlLabel-label': {
            color: `${colors.dark[300]} !important`,
          },

          '& svg': {
            color: colors.dark[200],
          },
        },
      }}
      control={
        <MuiRadio
          className={className}
          disabled={isDisable}
          disableFocusRipple
          color="success"
          sx={{
            padding: '2px',
            transition: '.1s',

            '&.Mui-focusVisible': {
              '& > *': {
                color: colors.primary[600],
              },
            },

            '&:not(.Mui-checked) > *': {
              color: colors.dark[900],
            },
            '&.Mui-checked > *': {
              color: colors.primary[600],
            },

            '&:hover': {
              backgroundColor: colors.primary[50],
              transition: '0.1s',

              '& > *': {
                color: colors.primary[600],
                transition: '0.1s',
              },
            },
          }}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

export default Radio;
