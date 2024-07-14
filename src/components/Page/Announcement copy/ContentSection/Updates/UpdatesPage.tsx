import { Card } from '@/components/Common';
import { getLang } from '@/utils';

import UpdateItem from './UpdateItem';
import { useLang } from '@/hooks';

interface IUpdate {
  title: string;
  date: string;
  description: string;
  variant?: 'green' | 'gray';
  lastItem?: boolean;
}

const [announcement] = getLang(['global', 'announcement']);

const UpdatesPage = () => {
  const [global] = useLang(['global']);

  return (
    <Card classNames="shadow-card w-full pb-9">
      <>
        <div className="flex items-center justify-start gap-x-2 border border-b-2 border-dark-50 p-6">
          <h2 className="text-xl font-medium text-dark-700">
            {global.arzinjaUpdates}{' '}
          </h2>
        </div>
        <div className="flex-col pl-6 pr-0 sm:pr-5 sm:pl-10">
          {data.map((item: IUpdate, index: number) => {
            return (
              <UpdateItem
                key={item.title}
                {...item}
                lastItem={data.length - 1 == index}
              />
            );
          })}
        </div>
      </>
    </Card>
  );
};

export default UpdatesPage;

const data: IUpdate[] = [
  {
    date: announcement.sampleDate,
    title: announcement.enableInternatNotifs,
    variant: 'green',
    description: announcement.enableInternatNotifsDesc,
  },
  {
    date: announcement.sampleDate,
    title: announcement.securityUpdateArzinjaApplication,
    variant: 'gray',
    description: announcement.securityUpdateArzinjaApplicationDesc,
  },
  {
    date: announcement.sampleDate,
    title: announcement.addMellatPaymentGateway,
    description: announcement.addMellatPaymentGatewayDesc,
  },
  {
    date: announcement.sampleDate,
    title: announcement.SibAppIOSVersionRelease,
    description: announcement.SibAppIOSVersionReleaseDesc,
  },
  {
    date: announcement.sampleDate,
    title: announcement.enableInternatNotifs,
    description: announcement.enableInternatNotifsDesc,
  },
  {
    date: announcement.sampleDate,
    title: announcement.enableInternatNotifs,
    description: announcement.enableInternatNotifsDesc,
  },
  {
    date: announcement.sampleDate,
    title: announcement.enableInternatNotifs,
    description: announcement.enableInternatNotifsDesc,
  },
];
