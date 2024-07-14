import clsx from 'classnames';

interface Props {
  children: React.ReactNode;
  classNames?: string;
  as?: React.ElementType;
}

const Paper: React.FC<Props> = ({ children, classNames, as = 'div' }) => {
  const Tag = as;
  return (
    <Tag
      className={clsx(
        'bg-white rounded-lg flex items-center justify-between overflow-hidden',
        classNames,
      )}
    >
      {children}
    </Tag>
  );
};

export default Paper;
