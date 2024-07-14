import classNames from 'classnames';
import { PropsWithChildren } from 'react';

type AvatarShape = 'circle' | 'square';
type AvatarType = 'img' | 'div' | 'span';

type AvatarProps<T extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[T] & { shape: AvatarShape; as: AvatarType };

const Avatar = <T extends keyof JSX.IntrinsicElements>({
  children,
  shape,
  as,
  className,
  ...props
}: PropsWithChildren<AvatarProps<T>>) => {
  const Component = (as as any) || 'div';

  return (
    <Component
      className={classNames(
        'w-10 h-10',
        className,
        shape === 'circle' ? 'rounded-full' : 'rounded-lg',
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

interface Props {
  shape: AvatarShape;
}

export const AvatarText = ({ children, shape }: PropsWithChildren<Props>) => {
  return (
    <Avatar
      as="span"
      shape={shape}
      className={classNames(
        'bg-primary-50 m-10 text-primary-500 flex items-center font-normal justify-center',
      )}
    >
      {children}
    </Avatar>
  );
};

export const AvatarIcon = ({ children, shape }: PropsWithChildren<Props>) => {
  return (
    <Avatar as="div" shape={shape} className="bg-secondary-100 text-white">
      {children}
    </Avatar>
  );
};

export const AvatarImage = ({ children, shape }: PropsWithChildren<Props>) => {
  return (
    <Avatar as="img" shape={shape}>
      {children}
    </Avatar>
  );
};

export const AvatarPlaceholder = ({
  children,
  shape,
}: PropsWithChildren<Props>) => {
  return (
    <Avatar as="img" shape={shape}>
      {children}
    </Avatar>
  );
};
