import { Icon } from '@/components/Common';

interface IProps {
  title?: string;
  icon: string;
  responsiveStatus?: React.ReactNode;
  index?: number;
}

const CardRowItem = (props: IProps) => {
  const { icon, title, responsiveStatus, index } = props;

  return (
    <div className="flex w-full items-center justify-start gap-x-2 pb-3 sm:pb-3">
      <Icon
        icon={icon}
        className={
          icon === 'CloseCircle-OutLined'
            ? '[&>*]:fill-danger-500'
            : '[&>*]:fill-primary-500'
        }
        size={16}
      />
      <p className="tex-dark-700 text-sm font-normal leading-6">{title}</p>
      <div className="flex flex-grow items-stretch justify-end">
        {index === 0 && responsiveStatus}
      </div>
    </div>
  );
};

export default CardRowItem;
