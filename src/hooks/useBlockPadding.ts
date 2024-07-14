import theme from '@/theme';
import { useBreakpoint } from '@/hooks/index';

const useBlockPadding = (padding?: 'small' | 'medium' | 'large') => {
  const { isDesktop } = useBreakpoint();

  if (!padding) return 0;

  return parseInt(
    theme.padding[`${padding}${isDesktop ? 'Desktop' : 'Mobile'}`].replace(
      'px',
      '',
    ),
  );
};

export default useBlockPadding;
