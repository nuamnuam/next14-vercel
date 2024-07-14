import Link from 'next/link';
import { AnnouncementsContentResponse } from '@/requests/announcements';

import LeftArrowIcon from '@/components/Icons/LeftArrowIcon';
import { Chip } from '@/components/Common';
import { formatedDate } from '@/utils/date-format';
import { useLang } from '@/hooks';

interface IProps {
  title: string;
  date: string;
  important?: boolean;
  onClickRow: string;
  description: string;
  articleCategoryName: string | undefined;
  categories: AnnouncementsContentResponse['data'][number]['attributes']['announcement_cats']['data'];
}

const TransactionRow = ({
  title,
  date,
  important,
  onClickRow,
  categories,
  articleCategoryName,
}: IProps) => {
  const [global] = useLang(['global']);

  return (
    <Link
      href={onClickRow}
      className="flex cursor-pointer p-3.5 sm:p-0 items-start sm:items-center sm:flex-row flex-col justify-between border-b border-dark-50	"
    >
      <div className="flex items-start sm:items-center sm:flex-row flex-col justify-start gap-x-4 sm:pr-4 sm:py-5">
        {important && <Chip variant="danger" label={global.important} />}
        <h3
          dangerouslySetInnerHTML={{ __html: title }}
          className="text-sm mt-2 sm:mt-0 font-bold text-dark-600"
        />
      </div>
      <div className="flex items-center justify-start gap-x-6 mt-2 sm:px-4">
        {articleCategoryName
          ? categories.map((category) => (
              <Chip
                key={category.id}
                classNames="lg:flex hidden"
                variant="secondary"
                label={category.attributes.title}
              />
            ))
          : null}

        <p className="m-0 text-sm font-medium text-dark-400">
          {formatedDate({ date, locale: 'fa' })
            ?.split(' ')
            .filter((item) => item)
            .join(' - ')}
        </p>
        <LeftArrowIcon className="lg:block hidden" />
      </div>
    </Link>
  );
};

export default TransactionRow;
