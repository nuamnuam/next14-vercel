import React, { useRef, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import { useClickoutside } from '@/hooks';

interface Props {
  id: string;
  open: boolean;
  backdropFilter?: boolean;
  setOpen: (val: boolean) => void;
  anchor: string | React.ReactNode;
  children: React.ReactNode;
  openCallback?: (status: boolean) => void;
  hideBackdrop?: boolean;
  anchorOrigin?: {
    vertical: number | 'bottom' | 'top' | 'center';
    horizontal: number | 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: number | 'bottom' | 'top' | 'center';
    horizontal: number | 'left' | 'center' | 'right';
  };
}

const ClickablePopover: React.FC<Props> = ({
  id,
  open,
  setOpen,
  openCallback = () => {},
  hideBackdrop,
  anchor,
  backdropFilter,
  anchorOrigin = {
    vertical: 40,
    horizontal: 'right',
  },
  transformOrigin = {
    vertical: 'top',
    horizontal: 'right',
  },
  children,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const anchorRef = useRef(null);

  useEffect(() => {
    openCallback && openCallback(open);
  }, [open]);

  useClickoutside(anchorRef, () => setAnchorEl(null));
  return (
    <>
      <div
        aria-describedby={id}
        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          setOpen(!open);
          setAnchorEl(event.currentTarget);
        }}
        ref={anchorRef}
      >
        {anchor}
      </div>
      <StyledPopover
        id={id}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setOpen(false);
        }}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        hideBackdrop={hideBackdrop}
        disablePortal
        style={{ backdropFilter: backdropFilter ? 'blur(3px)' : 'none' }}
      >
        {children}
      </StyledPopover>
    </>
  );
};

const StyledPopover = styled(Popover)(({ theme }) => ({
  '.MuiPopover-root': {
    position: 'static',
  },
  '.MuiBackdrop-root': {
    backgroundColor: '#000',
    opacity: '0.2 !important',
  },
  '.MuiPaper-root': {
    background: '#FFFFFF',
    boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    width: 'fit-content',
    minHeight: '100px',
    outline: 'none',
    zIndex: '10',
    overflow: 'hidden',
  },
}));

export default ClickablePopover;
