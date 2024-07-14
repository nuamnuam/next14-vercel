import React from 'react';
import { Tooltip } from '@mui/material';
import { colors } from '@/designTokens';

interface Props {
  title: string | React.ReactElement;
  anchor: React.ReactElement;
}

const CustomTooltip: React.FC<Props> = ({ anchor, title }) => {
  return (
    <Tooltip
      title={title}
      placement="top"
      arrow
      enterTouchDelay={0}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: colors.dark[700],
            padding: '0.5rem',
          },
        },
        arrow: {
          sx: {
            '&::before': {
              color: colors.dark[700],
            },
          },
        },
      }}
    >
      <span>{anchor}</span>
    </Tooltip>
  );
};

export default CustomTooltip;
