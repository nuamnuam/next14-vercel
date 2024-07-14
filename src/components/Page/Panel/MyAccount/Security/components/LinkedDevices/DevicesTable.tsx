import { Paper, EmptyTable, BoxDivider, Spinner } from '@/components/Common';
import { type IActivity } from '@/types/myAccount';
import { useBreakpoint, useLang } from '@/hooks';

import { DeviceRow } from './index';
interface IProps {
  data: IActivity[] | [];
  deleteItem: (device: IActivity) => void;
  isLoading: boolean;
}

const DevicesTable: React.FC<IProps> = ({
  deleteItem,
  data,
  isLoading,
}: IProps) => {
  const [global, security] = useLang(['global', 'security']);

  const { isDesktop } = useBreakpoint();

  const headers: string[] = [
    security.device,
    global.date,
    global.ip,
    global.action,
  ];

  return (
    <Paper classNames="p-0 flex-col flex items-center lg:mt-8 ">
      <h2 className=" hidden w-full p-6 text-right font-medium text-dark-800 lg:block">
        {security.linkedDevices}
      </h2>
      {isLoading ? (
        <>
          <BoxDivider className="hidden lg:block" />
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        </>
      ) : (
        <>
          {data.length ? (
            <table className="w-full table-auto">
              {data?.length ? (
                <thead className=" hidden bg-[#F2F4FA]/[.5] lg:table-header-group">
                  <tr>
                    {(!isDesktop ? [...headers, ''] : headers).map(
                      (th, index) =>
                        !isDesktop && index === 1 ? null : (
                          <th
                            className="py-4 px-10 text-xs font-normal text-dark-600"
                            key={th}
                          >
                            {th}
                          </th>
                        ),
                    )}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {data?.map((tr) => (
                  <DeviceRow
                    key={JSON.stringify(tr)}
                    tr={tr}
                    deleteItem={deleteItem}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <BoxDivider className="hidden lg:block" />
              <EmptyTable />
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default DevicesTable;
