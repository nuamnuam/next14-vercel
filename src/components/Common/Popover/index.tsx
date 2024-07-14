import React, { useState, useRef, useTransition } from 'react';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';

interface Props {
  id: string;
  anchor: string | React.ReactNode;
  children: React.ReactNode;
}

const CustomPopover: React.FC<Props> = ({ id, anchor, children }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [_, startTranstion] = useTransition();
  const anchorRef = useRef(null);
  const triggerLeaveTimeout = useRef<any>();

  const handleTriggerMouseEnter = () => {
    setOpen(true);
  };

  const handleTriggerMouseLeave = () => {
    if (hover) return;
    triggerLeaveTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 50);
  };

  const handlePopoverMouseEnter = () => {
    clearTimeout(triggerLeaveTimeout.current);
    setHover(true);
  };

  const handlePopoverMouseLeave = () => {
    setHover(false);
    startTranstion(() => {
      setOpen(false);
    });
  };

  return (
    <>
      <div
        aria-describedby={id}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        ref={anchorRef}
      >
        {anchor}
      </div>
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleTriggerMouseLeave}
        className="custom-popover"
        anchorOrigin={{
          vertical: 40,
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        hideBackdrop
        disablePortal
        onMouseEnter={handlePopoverMouseEnter}
        onMouseLeave={handlePopoverMouseLeave}
      >
        {children}
      </StyledPopover>
    </>
  );
};

const StyledPopover = styled(Popover)(({ theme }) => ({
  '.MuiPopover-root': {
    position: 'static !important',
  },

  '.MuiPaper-root': {
    background: '#FFFFFF',
    boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    width: 'fit-content',
    minHeight: '100px',
    outline: 'none',
    zIndex: 11,
    overflow: 'hidden',
  },
}));

export default CustomPopover;
