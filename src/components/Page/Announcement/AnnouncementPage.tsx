import React, { PropsWithChildren, useMemo } from 'react';
import AuthBg from '@/assets/images/AuthBackground.svg';
import { useRouter } from 'next/router';
import { useAnnouncementPageContent } from '@/requests/announcements/announcementPage';
import { useAnnouncementCatByIdContent } from '@/requests/announcements/catById';
import { useAnnouncementDetailsContent } from '@/requests/announcements/details';

import { Spinner } from '@/components/Common';
import { assetsUrl, formatedDate } from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';
import BreadCrumb from '@/components/Common/BreadCrumb';

const AnnouncementPage = ({ children }: PropsWithChildren) => {
  const [announcement, global, help] = useLang([
    'announcement',
    'global',
    'help',
  ]);

  const { query } = useRouter();
  const { data: announcementPage, isLoading } = useAnnouncementPageContent();
  const { data: catById, isLoading: announcementCatLoading } =
    useAnnouncementCatByIdContent(
      query.slug ? (query.slug as string) : undefined,
    );
  const { data: announcementDetailsContent, isLoading: announcementLoading } =
    useAnnouncementDetailsContent(query.id as string);

  const { isDesktop } = useBreakpoint();

  const breadCrumbGenerator = useMemo(() => {
    const items = [
      {
        label: global.startPage,
        href: '/',
      },
      {
        label: help.helps,
        href: '/help',
      },
    ];

    if (!query.slug && !query.id) {
      items.push({
        label: help.announcementsTitle,
        href: `/announcement`,
      });
    }

    if (!isDesktop && query.slug === 'articles' && catById?.data) {
      items.push({
        label: announcement.firstTabArticles,
        href: `/announcement`,
      });
    }

    if (!isDesktop && query.slug !== 'articles' && catById?.data) {
      items.push({
        label: catById?.data[0]?.attributes?.title?.trimStart().trimEnd(),
        href: `/announcement/${String(catById?.data[0]?.attributes?.slug)}${
          catById?.data[0]?.attributes?.is_updates ? '?is_update=true' : ''
        }`,
      });
    }

    if (isDesktop && query.slug !== 'articles' && catById?.data) {
      items.push({
        label: catById?.data[0]?.attributes?.title?.trimStart().trimEnd(),
        href: `/announcement/${String(catById?.data[0]?.attributes?.slug)}${
          catById?.data[0]?.attributes?.is_updates ? '?is_update=true' : ''
        }`,
      });
    }

    if (query.id && announcementDetailsContent?.data) {
      items.push({
        label: announcementDetailsContent.data[0].attributes.title
          .trimStart()
          .trimEnd(),
        href: `/announcement/${String(catById?.data[0]?.attributes?.slug)}/${
          announcementDetailsContent.data[0].attributes.slug
        }`,
      });
    }

    return items;
  }, [query, catById, announcementDetailsContent]);

  if (!announcementPage || isLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <div
      className="bg-[50%_-80px] bg-no-repeat"
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
    >
      <div className="container flex flex-col items-start justify-between bg-top py-0 sm:flex-row lg:bg-inherit">
        <div className="py-0 sm:w-6/12 lg:w-1/2">
          <div className="mt-8">
            <BreadCrumb classNames="!py-0" items={breadCrumbGenerator} />
          </div>
          <div className="flex w-full flex-col mb-6 lg:mb-0 mt-6 lg:mt-16">
            {announcementCatLoading || announcementLoading ? (
              <div className="">
                <Spinner />
              </div>
            ) : (
              <h1
                className="lg:mt-[.35rem] w-full text-xl md:text-[28px] text-right font-black"
                dangerouslySetInnerHTML={{
                  __html:
                    !query.id && query.slug === 'articles'
                      ? announcement.firstTabArticles
                      : !query.id &&
                        query.slug &&
                        catById?.data[0]?.attributes?.title
                      ? catById?.data[0]?.attributes?.title
                          .trimStart()
                          .trimEnd()
                      : query.id &&
                        announcementDetailsContent?.data[0].attributes.title
                      ? announcementDetailsContent?.data[0].attributes.title
                          .trimStart()
                          .trimEnd()
                      : announcementPage.data.attributes.title
                          .trimStart()
                          .trimEnd(),
                }}
              />
            )}

            {query.slug === 'articles' ? null : (catById?.data[0]?.attributes
                .updatedAt &&
                query.is_update) ||
              (announcementDetailsContent?.data[0].attributes.announcement_cats
                .data &&
                query.id) ||
              (announcementDetailsContent?.data[0].attributes.announcement_cats
                .data &&
                query.id) ? (
              <div className="flex items-center gap-x-8 mt-4 lg:mt-6">
                {catById?.data[0].attributes.updatedAt && query.is_update ? (
                  <span className="font-normal text-dark-500 text-xs">
                    {global.latestUpdate}{' '}
                    {formatedDate({
                      date: catById?.data[0].attributes.updatedAt,
                      locale: 'fa',
                    })}
                  </span>
                ) : null}

                {announcementDetailsContent?.data[0].attributes
                  .announcement_cats.data && query.id ? (
                  <span className="font-normal text-dark-500 text-xs">
                    {global.section}{' '}
                    {announcementDetailsContent?.data[0].attributes.announcement_cats.data.map(
                      (item, index) =>
                        index ===
                        announcementDetailsContent?.data[0].attributes
                          .announcement_cats.data.length -
                          1
                          ? `${item.attributes.title}`
                          : `${item.attributes.title} - `,
                    )}
                  </span>
                ) : null}

                {announcementDetailsContent?.data[0].attributes
                  .announcement_cats.data && query.id ? (
                  <span className="font-normal text-dark-500 text-xs">
                    {help.publish} ‌{' '}
                    {formatedDate({
                      date: announcementDetailsContent?.data[0].attributes
                        .announcement_cats.data[0].attributes.updatedAt,
                      locale: 'fa',
                    })}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-5 hidden items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-0 lg:flex sm:w-1/3 lg:w-4/12">
          <div className="w-5/5 lg:block">
            <img
              src={assetsUrl(
                announcementPage.data.attributes.media.data.attributes.url,
              )}
              alt="media"
            />
          </div>
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};

export default AnnouncementPage;
