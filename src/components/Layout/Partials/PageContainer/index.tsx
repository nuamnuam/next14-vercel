import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  parentClassList?: string;
  containerClassList?: string;
  preventFitHeight?: boolean;
};

const PageContainer: React.FC<Props> = ({
  children,
  parentClassList,
  containerClassList,
  preventFitHeight = false,
}) => {
  return (
    <div
      className={classNames(
        'bg-white pb-10 pt-[1.5rem] md:pt-[2.5rem] md:pb-[3.5rem]',
        {
          'min-h-[calc(100vh-392px)]': !preventFitHeight,
        },
        parentClassList,
      )}
    >
      <div className={classNames('container', containerClassList)}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
