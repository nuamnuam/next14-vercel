import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';
import Slide from '@mui/material/Slide';
import styled from '@emotion/styled';

import { useDebounceFunc, useLang } from '@/hooks';
import { colors } from '@/designTokens';
import { Button } from '@/components/Common';

import Icon from '../Icon';

interface ToastConstType {
  openToast: (...args: [string]) => void;
}

interface ProviderProps {
  children: React.ReactNode;
}

type TOAST_VARIANTS =
  | 'success'
  | 'info'
  | 'danger'
  | 'warning'
  | 'normal'
  | 'dark'
  | 'light';

const ToastContext = createContext<ToastConstType>({
  openToast: () => {},
});

export const ToastProvider: React.FC<ProviderProps> = ({ children }) => {
  const [global] = useLang(['global']);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [toastClassName, setToastClassName] = useState('');
  const [hasCLose, setHasClose] = useState(false);
  const [isBtnClose, setIsBtnClose] = useState(false);

  const debouncedFunc = useDebounceFunc(3000, () => {
    setOpen(false);
  });

  useEffect(() => {
    if (!open) return;
    debouncedFunc();
  }, [open]);

  const openToast = useCallback(
    (message = '', variant: TOAST_VARIANTS = 'info', hasClose = false) => {
      if (open) {
        setOpen(false);
        setTimeout(() => {
          setToastClassName(variant);
          setHasClose(hasClose);
          setMessage(message);
          setOpen(true);
        }, 200);
        return;
      }
      setToastClassName(variant);
      setHasClose(hasClose);
      setMessage(message);
      setOpen(true);
    },
    [message],
  );

  return (
    <ToastContext.Provider value={{ openToast }}>
      <StyledWrraper
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transitionDuration={{ enter: 200, exit: 100 }}
        TransitionComponent={Slide}
        TransitionProps={{ enter: true, exit: true }}
        className={toastClassName}
      >
        <SnackbarContent
          message={message}
          action={
            hasCLose && isBtnClose ? (
              <Button
                className={'w-fit text-xs text-dark-700'}
                onClick={() => {
                  setOpen(false);
                }}
              >
                {global.confirm}
              </Button>
            ) : (
              <div
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Icon icon="Close-OutLined" className="text-white" size={14} />
              </div>
            )
          }
        />
      </StyledWrraper>
      {children}
    </ToastContext.Provider>
  );
};

const StyledWrraper = styled(Snackbar)(() => {
  return {
    '& .MuiSnackbarContent-root': {
      padding: '9px 16px',
      fontSize: '14px',
      height: '50px',
      minWidth: '395px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 500,
      borderRadius: '8px',
    },
    '&.info .MuiSnackbarContent-root': {
      backgroundColor: colors.blue[500],
      color: 'white',
    },
    '&.success .MuiSnackbarContent-root': {
      backgroundColor: colors.primary[600],
      color: 'white',
    },
    '&.danger .MuiSnackbarContent-root': {
      backgroundColor: colors.danger[400],
      color: 'white',
    },
    '&.warning .MuiSnackbarContent-root': {
      backgroundColor: colors.warning[500],
      color: 'white',
    },
    '&.normal .MuiSnackbarContent-root': {
      backgroundColor: colors.dark[700],
      color: colors.dark[50],
    },
    '&.dark .MuiSnackbarContent-root': {
      backgroundColor: colors.dark[700],
      color: 'white',
    },
    '&.light .MuiSnackbarContent-root': {
      backgroundColor: 'white',
      color: colors.dark[700],
    },
    '& .MuiSnackbarContent-message': {
      padding: 0,
    },
    '& .MuiSnackbarContent-action': {
      margin: '0 auto 0 0',
      paddingLeft: 0,
      cursor: 'pointer',
    },
  };
});

export const useToastProvider = () => {
  const { openToast } = useContext(ToastContext);
  return {
    openToast,
  };
};
