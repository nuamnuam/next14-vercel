import clsx from 'classnames';

interface CardProps {
  children: React.ReactNode;
  classNames?: string;
  style?: React.CSSProperties;
  header?: React.ReactNode;
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  classNames,
  style,
  header,
  as = 'div',
}) => {
  const Tag = as;
  return (
    <Tag
      className={clsx('rounded-lg bg-white shadow-medium', classNames)}
      style={style}
    >
      {header && header}
      {children}
    </Tag>
  );
};

export default Card;
