export interface ButtonProps {
  children?: React.ReactNode;
  size?: 'lg' | 'md' | 'sm';
  variant?:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'dashed'
    | 'link'
    | 'text'
    | 'chip'
    | 'active-chip';
  shape?: 'standard' | 'danger' | 'circle' | 'square';
  block?: boolean;
  fullWidth?: boolean;
  endIcon?: JSX.Element;
  startIcon?: JSX.Element;
  isLoading?: boolean;
  isBusy?: boolean;
  disabled?: boolean;
  disableWithoutAffect?: boolean;
  childrenClassname?: string;
}

export type ButtonSizes = 'btn-lg' | 'btn-md' | 'btn-sm';
export type ButtonVariants =
  | 'btn-primary-standard'
  | 'btn-secondary-standard'
  | 'btn-dark-standard'
  | 'btn-dashed-standard'
  | 'btn-link-standard'
  | 'btn-text-standard'
  | 'btn-chip-standard'
  | 'btn-active-chip-standard'
  | 'btn-primary-danger'
  | 'btn-secondary-danger'
  | 'btn-dark-danger'
  | 'btn-dashed-danger'
  | 'btn-link-danger'
  | 'btn-text-danger'
  | 'btn-chip-danger'
  | 'btn-active-chip-danger'
  | 'btn-primary-circle'
  | 'btn-secondary-circle'
  | 'btn-dark-circle'
  | 'btn-dashed-circle'
  | 'btn-link-circle'
  | 'btn-text-circle'
  | 'btn-chip-circle'
  | 'btn-active-chip-circle'
  | 'btn-primary-square'
  | 'btn-secondary-square'
  | 'btn-dark-square'
  | 'btn-dashed-square'
  | 'btn-link-square'
  | 'btn-text-square'
  | 'btn-chip-square'
  | 'btn-active-chip-square';

export type ButtonDisabled =
  | 'btn-primary-disabled'
  | 'btn-secondary-disabled'
  | 'btn-dark-disabled'
  | 'btn-dashed-disabled'
  | 'btn-link-disabled'
  | 'btn-text-disabled'
  | 'btn-chip-disabled'
  | 'btn-active-chip-disabled';
