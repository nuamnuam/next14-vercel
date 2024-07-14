import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { HelpContentResponse, useHelpContent } from '@/requests/help';

import { Button, Icon, Spinner, Pagination } from '@/components';
import { HelpContent } from '@/store/useHelpStore';
import { useBreakpoint, useLang } from '@/hooks';
import ListItemsLayout from '../components/ListItemsLayout';
import ListItem from '../components/ListItem';

const HelpDeposit = ({ main }: { main?: string }) => {
  const [announcement] = useLang(['announcement']);

  const [page, setPage] = useState(1);
  const { query, pathname } = useRouter();
  const [pageData, setPageData] = useState<
    Array<
      HelpContent & {
        hasVideo: boolean;
        id: number;
        categories: HelpContentResponse['data'][number]['attributes']['help_categories'];
        slug: string;
      }
    >
  >([]);

  const { isDesktop } = useBreakpoint();

  const { data: helpContent, isLoading } = useHelpContent({
    page,
    pageSize: main != null ? 10 : undefined,
    id: main,
  });

  useEffect(() => {
    if (!helpContent) return;

    const helpData = [...mapHelps(helpContent.data)];

    if (!isDesktop && main == undefined) {
      setPageData(helpData.slice(0, 10));
      return;
    }

    if (!isDesktop && !(page === 1)) {
      setPageData((prev) => [...prev, ...helpData]);
      return;
    }

    if (!isDesktop) {
      setPageData(helpData);
      return;
    }

    if (isDesktop) {
      setPageData(() => (main == undefined ? helpData.slice(0, 10) : helpData));
    }
  }, [helpContent, page, pathname, main, query]);

  useEffect(() => {
    setPage(1);
  }, [main]);

  return (
    <ListItemsLayout>
      {!helpContent?.data || isLoading ? (
        <div className="flex items-center my-10 justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="lg:min-h-[585px]">
            {pageData.map((item, index) => (
              <ListItem key={index} {...item} />
            ))}
          </div>
          {main != null && helpContent.meta.pagination.total > 10 ? (
            <div className="flex items-center justify-center">
              <Pagination
                page={page}
                count={helpContent.meta.pagination.pageCount || 1}
                onChange={(page) => {
                  setPage(page);
                }}
                classNames="flex justify-center p-4 lg:p-6 lg:pt-4 lg:block hidden"
              />
              {page === helpContent.meta.pagination.pageCount ? null : (
                <Button
                  onClick={() => {
                    setPage((prev) => ++prev);
                  }}
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
    </ListItemsLayout>
  );
};

export default HelpDeposit;

function mapHelps(helps: HelpContentResponse['data']) {
  return helps.map((item) => ({
    id: item.id,
    title: item.attributes.title,
    description: item.attributes.description,
    media: item.attributes.media,
    hasVideo: item.attributes.media.data?.some((item) =>
      item.attributes.ext.includes('mp4'),
    ),
    updatedAt: item.attributes?.updatedAt,
    categories: item.attributes?.help_categories,
    slug: item.attributes.slug,
  }));
}
