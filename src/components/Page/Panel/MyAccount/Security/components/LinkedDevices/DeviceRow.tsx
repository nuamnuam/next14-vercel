import clsx from 'classnames';

import { Icon } from '@/components/Common';
import { type IActivity } from '@/types/myAccount';
import { formatedDate } from '@/utils/date-format';
import { useBreakpoint, useLang } from '@/hooks';

interface IProps {
  deleteItem: (device: IActivity) => void;
  tr: IActivity;
}

const DeviceRow: React.FC<IProps> = ({ tr, deleteItem }: IProps) => {
  const [global] = useLang(['global']);

  const { isDesktop } = useBreakpoint();

  return (
    <tr
      className="border-b border-dark-50"
      onClick={() => {
        if (isDesktop) return;
        deleteItem(tr);
      }}
    >
      <td
        className={clsx(
          'text-right w-[80%] md:w-[25%] px-4 md:pl-2 md:pr-10 h-[72px] text-xs font-normal text-dark-600 md:text-center',
        )}
      >
        <div className="flex gap-4 lg:justify-center items-center">
          <Icon
            icon={
              tr?.device === 'Desktop' ? 'Desktop-OutLined' : 'Mobile-OutLined'
            }
            size={16}
          />

          {isDesktop
            ? tr?.agent
              ? tr.agent?.length > 25
                ? '...' + tr.agent.substring(0, 25)
                : tr.agent
              : ''
            : tr?.agent
            ? tr.agent?.length > 35
              ? '...' + tr.agent.substring(0, 35)
              : tr.agent
            : ''}
        </div>
      </td>
      <td
        className={clsx(
          ' two-line-truncate hidden w-[25%] px-2 h-[72px] text-right text-xs font-normal text-dark-600 md:table-cell md:text-center',
        )}
      >
        {formatedDate({ date: tr?.created_at, locale: 'fa' })}
      </td>
      <td
        className={clsx(
          'two-line-truncate hidden w-[25%] px-2 h-[72px] text-right text-xs font-normal text-dark-600 md:table-cell md:text-center',
        )}
      >
        {tr?.ip}
      </td>
      <td
        onClick={() => {
          deleteItem(tr);
        }}
        className="hidden md:pl-10 cursor-pointer w-[10%] px-2 h-[72px] text-center text-xs font-medium text-danger-500 md:table-cell"
      >
        {global.delete}
      </td>
      <td className="pl-6 text-left md:hidden md:h-[72px]">
        <Icon icon={'Left-OutLined'} className="text-dark-400" size={16} />
      </td>
    </tr>
  );
};

export default DeviceRow;
