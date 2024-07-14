import type {
  ButtonDisabled,
  ButtonProps,
  ButtonSizes,
  ButtonVariants,
} from '@/types/component';
import { createContext } from 'react';

interface ButtonBaseContext {
  sizeClass: ButtonSizes;
  variantClass: ButtonVariants;
  disabledClass: ButtonDisabled;
  iconSizeClass: () => string;
  loadingSize: () => { width: number; height: number };
  iconButtonSize: () => string;
}

export const ButtonBaseContext = createContext<ButtonBaseContext>({
  sizeClass: 'btn-md',
  variantClass: 'btn-primary-standard',
  disabledClass: 'btn-primary-disabled',
  iconSizeClass: () => 'text-base',
  loadingSize: () => ({ width: 22, height: 22 }),
  iconButtonSize: () => 'w-10 h-10',
});

interface Props
  extends Pick<
    ButtonProps,
    'size' | 'variant' | 'isBusy' | 'shape' | 'disabled'
  > {
  children: React.ReactNode;
}

const ButtonBase: React.FC<Props> = ({
  children,
  size = 'md',
  shape = 'standard',
  variant = 'primary',
}) => {
  const iconSizeClass = () => {
    const sizes = {
      lg: 'text-sm',
      md: 'text-sm font-medium leading-6	',
      sm: 'text-sm',
    };

    return sizes[size];
  };

  const iconButtonSize = () => {
    const sizes = {
      lg: 'w-[45px] h-[45px]',
      md: 'w-10 h-10',
      sm: 'w-8 h-8',
    };

    return sizes[size] + ' p-0';
  };

  const loadingSize = () => {
    const sizes = {
      xxl: 32,
      xl: 24,
      lg: 20,
      md: 16,
      sm: 16,
    };

    return {
      width: sizes[size],
      height: sizes[size],
    };
  };

  const sizeClass: ButtonSizes = `btn-${size}` as ButtonSizes;
  const variantClass: ButtonVariants = `btn-${variant}-${shape}`;
  const disabledClass: ButtonDisabled = `btn-${variant}-disabled`;

  return (
    <ButtonBaseContext.Provider
      value={{
        sizeClass,
        variantClass,
        disabledClass,
        iconSizeClass,
        loadingSize,
        iconButtonSize,
      }}
    >
      {children}
    </ButtonBaseContext.Provider>
  );
};

export default ButtonBase;
