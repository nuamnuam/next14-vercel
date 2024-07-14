import { Icon } from '@/components/Common';
import { formatedDate } from '@/utils/date-format';

interface IItem {
  title?: string;
  description?: string;
  date?: string;
  has_icon?: boolean;
  url?: string;
}

interface IProps {
  tr: IItem;
}

const TableRow: React.FC<IProps> = ({ tr }: IProps) => {
  return (
    <div className="flex flex-row-reverse">
      {tr.url ? (
        <a
          target="_blank"
          className="flex flex-col w-full"
          href={`/${tr.url}`}
          rel="noreferrer"
        >
          <div className="lg:hidden flex flex-row items-center px-4 pt-4">
            <Icon
              icon="Calendar-OutLined"
              size={16}
              className="text-dark-400 lg:mr-2"
            />
            <span className="text-xs pr-2 font-medium text-dark-400">
              {formatedDate({
                date: tr?.date,
                locale: 'fa',
                withExtra: false,
              })}
            </span>
          </div>
          <div className="flex flex-row p-4 pb-0 text-right text-xs font-normal text-dark-600 lg:px-3 w-full justify-between">
            <div className="flex flex-col">
              <p className="text-[14px] font-medium leading-6 text-dark-800">
                {tr?.has_icon && (
                  <Icon
                    icon={'Announcement-Filled'}
                    size={28}
                    className="ml-2 rounded-md bg-danger-50 p-2 text-danger-400"
                  />
                )}
                {tr?.title}
              </p>
            </div>
            <div className="hidden lg:flex flex-col justify-center">
              <div className="flex">
                <Icon
                  icon="Calendar-OutLined"
                  size={16}
                  className="text-dark-400 lg:mr-2"
                />
                <span className="text-xs pr-2 font-medium text-dark-400">
                  {formatedDate({
                    date: tr?.date,
                    locale: 'fa',
                    withExtra: false,
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row p-4 pt-0 text-right text-xs font-normal text-dark-600 lg:px-3 w-full">
            <p
              className="mt-2 text-[12px] font-medium text-dark-400"
              dangerouslySetInnerHTML={{ __html: tr?.description || '' }}
            />
          </div>
        </a>
      ) : (
        <div className="flex flex-col w-full">
          <div className="lg:hidden flex flex-row items-center px-4 pt-4">
            <Icon
              icon="Calendar-OutLined"
              size={16}
              className="text-dark-400 lg:mr-2"
            />
            <span className="text-xs pr-2 font-medium text-dark-400">
              {formatedDate({
                date: tr?.date,
                locale: 'fa',
                withExtra: false,
              })}
            </span>
          </div>
          <div className="flex flex-row p-4 pb-0 text-right text-xs font-normal text-dark-600 lg:px-3 w-full justify-between">
            <div className="flex flex-col">
              <p className="text-[14px] font-medium leading-6 text-dark-800">
                {tr?.has_icon && (
                  <Icon
                    icon={'Announcement-Filled'}
                    size={28}
                    className="ml-2 rounded-md bg-danger-50 p-2 text-danger-400"
                  />
                )}
                {tr?.title}
              </p>
            </div>
            <div className="hidden lg:flex flex-col justify-center">
              <div className="flex">
                <Icon
                  icon="Calendar-OutLined"
                  size={16}
                  className="text-dark-400 lg:mr-2"
                />
                <span className="text-xs pr-2 font-medium text-dark-400">
                  {formatedDate({
                    date: tr?.date,
                    locale: 'fa',
                    withExtra: false,
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row p-4 pt-0 text-right text-xs font-normal text-dark-600 lg:px-3 w-full">
            <p
              className="mt-2 text-[12px] font-medium text-dark-400"
              dangerouslySetInnerHTML={{ __html: tr?.description || '' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableRow;
