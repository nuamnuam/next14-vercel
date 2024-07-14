import { useRouter } from 'next/router';
import { useAnnouncementDetailsContent } from '@/requests/announcements/details';

import { Card, Spinner } from '@/components/Common';

const TransactionDetail = () => {
  const { query } = useRouter();

  const { data: announcementDetails, isLoading } =
    useAnnouncementDetailsContent(query.id as string);

  if (!announcementDetails?.data || isLoading)
    return (
      <div className="flex mt-8 items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <Card classNames="shadow-card w-full">
      <p
        className="p-6 text-sm font-medium leading-6 text-dark-500"
        dangerouslySetInnerHTML={{
          __html: announcementDetails.data[0].attributes.description,
        }}
      />
    </Card>
  );
};

export default TransactionDetail;
