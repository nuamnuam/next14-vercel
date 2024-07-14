import IcoMoon, { type IconProps } from 'react-icomoon';
import clsx from 'classnames';
import iconSet from './selection.json';

const Icon = ({ className, ...rest }: IconProps) => {
  return (
    <IcoMoon
      iconSet={iconSet}
      className={clsx(
        '!shrink-0 [&>*]:transition [&>*]:duration-300 [&>*]:group-hover:transition [&>*]:group-hover:duration-300',
        className && className,
      )}
      {...rest}
    />
  );
};

export default Icon;
