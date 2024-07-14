import classNames from 'classnames';

interface Props {
  extraClassName?: string;
  children: React.ReactNode;
}

const SingleContainerLayout: React.FC<Props> = ({
  children,
  extraClassName,
}) => {
  return (
    <div
      className={classNames('mt-10 md:mt-14 lg:mt-20 lg:px-56', extraClassName)}
    >
      {children}
    </div>
  );
};

export default SingleContainerLayout;
