import React, { type ReactNode } from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { Fade, Slide } from '@mui/material';
import { type TransitionProps } from '@mui/material/transitions';

import { colors } from '@/designTokens';
import { useBreakpoint, useSsr } from '@/hooks';
import { useModal } from '@/hooks/useModal';

import IconButton from '../IconButton';
import Icon from '../Icon';

const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FadeTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme, maxWidth, fullScreen }) => ({
  '& .MuiDialog-paper': {
    overflow: 'visible',
  },
  '& .MuiPaper-root': {
    width: '100%',
    background: '#fff',
    margin: 0,
    boxShadow: '0px 0px 30px rgba(7, 16, 58, 0.09);',
    borderRadius: '13px',
    maxWidth,

    [theme.breakpoints.down('lg')]: {
      background: fullScreen ? colors.dark[50] : '#fff',
      marginTop: 'auto',
      maxWidth: '100%',
      borderRadius: fullScreen ? 0 : '13px 13px 0 0',

      // '&::before': {
      //   content: "''",
      //   position: 'absolute',
      //   width: '4rem',
      //   height: '5px',
      //   borderRadius: '1rem',
      //   backgroundColor: colors.dark[50],
      //   top: '18px',
      //   right: '50%',
      //   transform: 'translateX(50%)',
      //   display: fullScreen ? 'none' : 'block',
      // },
    },
  },

  '& .MuiBackdrop-root': {
    backgroundColor: '#00000033',
    backdropFilter: 'blur(2px)',
  },
}));

type CustomizedDialogsProps = {
  name: string;
  title?: string | null;
  titleWrapperClassName?: string;
  subtitle?: string;
  headerIcon?: string;
  children: ReactNode;
  onClose: () => void;
  maxWidth?: any;
  hasCloseAction?: boolean;
  footer?: ReactNode;
  fullScreen?: boolean;
  noTransition?: boolean;
  extra?: ReactNode;
  contentAddtionalClassNames?: string;
  headerClassNames?: string;
  noBackIcon?: boolean;
  hasHelp?: boolean;
  footerClassName?: string;
  modalWrapper?: string;
  onTitleClick?: () => void;
  sync?: boolean;
  disableCloseOnClickOutside?: boolean;
};

const CustomizedDialogs = ({
  name,
  title,
  headerIcon,
  onClose,
  subtitle,
  children,
  titleWrapperClassName,
  maxWidth = '462px',
  hasCloseAction = true,
  footer,
  fullScreen = false,
  noTransition = false,
  extra,
  contentAddtionalClassNames = '',
  headerClassNames,
  noBackIcon = false,
  hasHelp = true,
  footerClassName,
  onTitleClick,
  sync = false,
  disableCloseOnClickOutside = false,
}: CustomizedDialogsProps) => {
  const router = useRouter();
  const { isServer } = useSsr();
  const { isDesktop } = useBreakpoint();
  const { isModalOpen, isSyncModalOpen } = useModal(name);
  const fullScreenMode = !isDesktop && fullScreen;

  const is_pwa =
    typeof window !== 'undefined'
      ? Boolean(localStorage.getItem('pwa'))
      : false;

  const handleClose = (_?: any, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason && reason === 'backdropClick' && disableCloseOnClickOutside)
      return;
    return onClose();
  };

  const handleClickTitle = () => {
    if (typeof onTitleClick === 'function') {
      onTitleClick();
    } else if (!noBackIcon) {
      handleClose();
    }
  };
  if (isServer) return <div />;
  return (
    <>
      <StyledDialog
        open={sync ? isSyncModalOpen : isModalOpen}
        maxWidth={maxWidth}
        onClose={handleClose}
        TransitionComponent={noTransition ? FadeTransition : SlideTransition}
        transitionDuration={noTransition ? 0 : 200}
        fullScreen={fullScreenMode}
        fullWidth={fullScreenMode}
      >
        <div
          className={clsx(
            'flex flex-col items-center overflow-hidden',
            fullScreenMode && 'h-full lg:h-auto',
          )}
        >
          {fullScreenMode ? (
            <div
              className={clsx(
                'flex w-full items-center justify-between border border-b-dark-100 bg-white px-8 h-[76px]',
                headerClassNames,
              )}
            >
              <div
                className="flex items-center"
                onClick={() => handleClickTitle()}
              >
                {!noBackIcon && (
                  <Icon
                    icon="Right-OutLined"
                    size={18}
                    className="text-dark-200"
                  />
                )}
                <span
                  className={clsx(
                    'mr-8 text-lg font-medium text-dark-600',
                    noBackIcon && '!mr-0',
                  )}
                >
                  {title}
                </span>
              </div>
              <div className="flex items-center">
                {extra}
                {hasHelp && (
                  <IconButton
                    size="lg"
                    className={clsx('border-dark-200', extra && 'mr-4')}
                    icon={
                      <Icon
                        icon="QuestionCircle-OutLined"
                        size={20}
                        className="text-dark-600"
                      />
                    }
                    onClick={async () => await router.push('/help')}
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              className={clsx(
                'flex w-full items-center justify-between px-4 pt-10 pb-3 md:px-6 z-[1]',
                !title && '!pt-0 !pb-0',
                titleWrapperClassName,
              )}
            >
              {title && (
                <div className="flex items-center">
                  {headerIcon && (
                    <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-[13px] bg-primary-50">
                      <Icon icon={headerIcon} size={24} />
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-dark-600">{title}</h2>
                </div>
              )}
              {hasCloseAction ? (
                <Icon
                  icon="Close-OutLined"
                  size={20}
                  onClick={() => handleClose?.()}
                  className="mr-auto cursor-pointer text-dark-600 z-10"
                />
              ) : null}
              {subtitle && (
                <h3 className="mt-[0.5rem] text-sm md:mt-[0.75] md:text-base">
                  {subtitle}
                </h3>
              )}
            </div>
          )}
          <div
            className={clsx(
              'content w-full overflow-y-auto px-4 md:px-6 lg:rounded-[13px]',
              footer ? 'pb-2' : is_pwa ? 'pb-9' : 'pb-6 lg:pb-10',
              title || hasCloseAction ? 'pt-3' : 'pt-10',
              fullScreenMode && 'flex-1',
              contentAddtionalClassNames,
            )}
          >
            <div className="w-full">{children}</div>
          </div>
          {footer && (
            <div
              className={clsx(
                'w-full px-6 pt-2',
                is_pwa ? 'pb-9' : 'pb-6 lg:pb-10',
                footerClassName,
                fullScreenMode &&
                  'rounded-t-2xl bg-white px-4 pt-[10px] shadow-card',
              )}
            >
              {footer}
            </div>
          )}
        </div>
      </StyledDialog>
    </>
  );
};

export default CustomizedDialogs;
