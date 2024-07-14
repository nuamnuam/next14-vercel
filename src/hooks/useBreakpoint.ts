import { useMediaQuery, useTheme } from '@mui/material';

const useBreakpoint = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  return {
    isDesktop,
    isTablet,
    isMobile,
  };
};

export default useBreakpoint;

// sm:640px
// md:768px
// lg:1024px
