import {
  AnnouncementsContentResponse,
  useAnnouncementsContent,
} from '@/requests/announcements';

import { Card, Spinner } from '@/components/Common';
import UpdateItem, { UpdateItemVariant } from './UpdateItem';

interface IUpdate {
  title: string;
  date: string;
  description: string;
  variant?: 'green' | 'gray';
  lastItem?: boolean;
}

const UpdatesPage = ({ categoryId }: { categoryId: string }) => {
  const { data: announcements, isLoading } = useAnnouncementsContent(
    categoryId,
    1,
    7,
  );

  if (!announcements?.data || isLoading)
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner />
      </div>
    );

  return (
    <Card classNames="shadow-card w-full pb-9">
      <div className="flex-col pl-6 pr-0 sm:pr-5 sm:pl-10 pt-10">
        {mapUpdates(announcements?.data).map((item: IUpdate, index: number) => {
          return (
            <UpdateItem
              key={item.title}
              {...item}
              lastItem={mapUpdates(announcements?.data).length - 1 == index}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default UpdatesPage;

function mapUpdates(announcements: AnnouncementsContentResponse['data']) {
  const newData = announcements.sort(
    (a, b) => +b.attributes.is_pin - +a.attributes.is_pin,
  );

  return newData.map(({ attributes }, index) => {
    if (index === 0)
      return {
        date: attributes.dateTime,
        title: attributes.title,
        variant: 'green' as UpdateItemVariant,
        description: attributes.description,
      };

    return {
      date: attributes.dateTime,
      title: attributes.title,
      variant: 'gray' as UpdateItemVariant,
      description: attributes.description,
    };
  });
}
