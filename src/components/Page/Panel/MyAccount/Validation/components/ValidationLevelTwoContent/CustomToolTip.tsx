import type { FC, ReactElement } from 'react';
import { Tooltip } from '@mui/material';

type Props = {
  children: ReactElement;
  title: ReactElement | null;
};

const CustomToolTip: FC<Props> = ({ children, title }) => {
  return (
    <Tooltip
      title={title}
      placement="top"
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: '#373B4F',
            padding: '6px 8px',
            width: '190px',
            borderRadius: '8px',
            boxShadow: '0px 0px 30px 0px rgba(7, 16, 58, 0.09)',
            display: 'flex',
            justifyContent: 'center',
          },
        },
        arrow: {
          sx: {
            '&::before': {
              color: '#373B4F',
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CustomToolTip;
