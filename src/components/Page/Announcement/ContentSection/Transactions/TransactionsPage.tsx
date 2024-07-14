import { useEffect, useState } from 'react';
import {
  AnnouncementsContentResponse,
  useAnnouncementsContent,
} from '@/requests/announcements';

import { AnnouncementContent } from '@/store/useAnnouncementsStore';
import { Button, Card, Icon, Spinner, Pagination } from '@/components';
import { useBreakpoint, useLang } from '@/hooks';

import AnnouncementRow from './TransactionRow';

interface Props {
  categoryId?: string;
  categoryTitle: string;
  name?: string;
}

function mapAnnouncements(
  announcements: AnnouncementsContentResponse,
  name: string | undefined,
) {
  return announcements.data.map(({ attributes }) => ({
    title: attributes.title,
    important: !!attributes.is_pin,
    date: attributes.dateTime,
    description: attributes.description,
    categories: attributes.announcement_cats.data,
    id: attributes.slug,
    updatedAt: attributes.dateTime,
    isPin: attributes.is_pin,
    slug: attributes.slug,
  }));
}

const TransactionsPage = ({ categoryId, name }: Props) => {
  const [announcement] = useLang(['announcement']);

  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState<AnnouncementContent[]>([]);
  const { isDesktop } = useBreakpoint();

  const { data: announcements, isLoading } = useAnnouncementsContent(
    categoryId,
    page,
    name === 'articles' ? undefined : 10,
  );

  useEffect(() => {
    if (!announcements) return;

    const currentData = [...mapAnnouncements(announcements, name)];

    currentData.sort((a, b) => +b.isPin - +a.isPin);

    if (!isDesktop && name === 'articles') {
      setPageData(currentData.slice(0, 10));
      setPage(1);
      return;
    }

    if (!isDesktop && !(page === 1)) {
      setPageData((prev) =>
        [...prev, ...currentData].sort(
          (a, b) =>
            +(b as { isPin: boolean }).isPin - +(a as { isPin: boolean }).isPin,
        ),
      );
      return;
    }

    if (!isDesktop) {
      setPageData(currentData);
      return;
    }

    if (isDesktop) {
      setPageData(() =>
        name === 'articles' ? currentData.slice(0, 10) : currentData,
      );
    }
  }, [announcements, page, name]);

  return (
    <Card classNames="shadow-card w-full">
      {pageData?.length <= 0 || !announcements?.data || isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="lg:h-[660px]">
            {pageData.map((row: AnnouncementContent) => (
              <AnnouncementRow
                key={row.title}
                articleCategoryName={name}
                onClickRow={`/announcement/${row?.categories?.[0]?.attributes?.slug}/${row?.slug}`}
                categories={row.categories!}
                {...row}
              />
            ))}
          </div>
          {announcements.meta.pagination.total > 10 && name !== 'articles' ? (
            <div className="p-5 flex items-center justify-center">
              <Pagination
                page={announcements.meta.pagination.page}
                count={announcements.meta.pagination.pageCount || 1}
                onChange={(page) => setPage(page)}
                classNames="mb-4 sm:mb-0 lg:block hidden"
              />
              {page === announcements.meta.pagination.pageCount ? null : (
                <Button
                  onClick={() => {
                    setPage((prev) => ++prev);
                  }}
                  disabled={page === announcements.meta.pagination.pageCount}
                  endIcon={
                    <Icon
                      icon="ArrowLeft-TwoTone"
                      size={22}
                      className="[&>*]:fill-dark-400"
                    />
                  }
                  variant="text"
                  className="!text-dark-400 text-sm lg:hidden block"
                >
                  {announcement.loadMore}
                </Button>
              )}
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
};

export default TransactionsPage;
