import React, { useCallback } from 'react';
import { useGlobalStore } from '@/store';

interface MaskProps {
  children: React.ReactNode | string | number;
  component?: keyof JSX.IntrinsicElements;
  count?: number;
}

const Mask: React.FC<MaskProps & React.HTMLAttributes<HTMLOrSVGElement>> = ({
  children,
  component: Wrapper = 'span',
  count = 5,
  ...rest
}) => {
  const isMaskedValue = useGlobalStore((state) => state.isMaskedValue);

  const renderInner = useCallback(() => {
    if (!isMaskedValue) return children;
    return Array(count).fill('*');
  }, [isMaskedValue, children]);

  //@ts-ignore
  return <Wrapper {...rest}>{renderInner()}</Wrapper>;
};

export default Mask;
