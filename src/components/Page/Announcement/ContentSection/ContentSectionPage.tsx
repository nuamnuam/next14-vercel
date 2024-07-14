import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { queryClient } from '@/requests';
import { useAnnouncementCatByIdContent } from '@/requests/announcements/catById';
import { useAnnouncementCatsContent } from '@/requests/announcements/announcementCats';

import { useBreakpoint, useLang } from '@/hooks';
import { TabsGroup, Spinner } from '@/components/Common';
import ImportantArticlesIcon from '@/components/Icons/announcement/ImportantArticlesIcon';
import Transactions from './Transactions/TransactionsPage';
import { assetsUrl } from '@/utils';
import HelpIcon from '@/components/Icons/announcement/HelpIcon';
import FAQIcon from '@/components/Icons/announcement/FAQIcon';
import { TabsModel } from '@/components/Common/Tab';
import UpdatesPage from './Updates/UpdatesPage';
import ResponsiveMenu from '../ResponsiveMenu';

type TabContent = Array<TabsModel & { name: string }>;

const getTabContent = (tab: string, tabContents: TabContent) => {
  return tabContents.find((item) => item.name === tab)?.tabContent;
};

const ContentSectionPage = ({ children }: PropsWithChildren) => {
  return (
    <div className="container flex items-start justify-between  ">
      <CategoryTabs children={children} />
    </div>
  );
};

export default ContentSectionPage;

const CategoryTabs = ({ children }: PropsWithChildren) => {
  const [announcement] = useLang(['announcement']);

  const router = useRouter();
  const { isDesktop } = useBreakpoint();

  const { data: categories, isLoading } = useAnnouncementCatsContent();

  const { data: catById } = useAnnouncementCatByIdContent(
    router.query.slug as string,
  );

  const [activeTab, setActiveTab] = useState('');

  const data: TabContent | undefined = useMemo(() => {
    if (!categories) return;

    categories.data.sort(
      (a, b) => a.attributes.priority - b.attributes.priority,
    );

    const announcementsCats = categories.data.map(({ attributes }) => {
      return {
        name: attributes.slug,
        tabTitle: attributes.title,
        tabContent:
          !router.query.id && attributes.is_updates ? (
            <UpdatesPage categoryId={attributes.slug} />
          ) : router.query.id ? (
            children
          ) : (
            <Transactions
              categoryTitle={attributes.title}
              categoryId={attributes.slug}
            />
          ),
        leftIcon: (
          <img
            src={assetsUrl(attributes.icon.data[0].attributes.url)}
            className="w-5 h-5"
            alt="media"
          />
        ),
        tabOnClick: () => {
          queryClient.refetchQueries({
            queryKey: ['get-announcements', attributes.slug],
          });
        },
        link: attributes.is_updates
          ? `/announcement/${attributes.slug}?is_update=true`
          : `/announcement/${attributes.slug}`,
      };
    });

    return [
      {
        name: 'articles',
        tabTitle: announcement.latestTabAnnouncement,
        tabContent: !router.query.id ? (
          <Transactions
            name="articles"
            categoryTitle={announcement.latestTabAnnouncement}
          />
        ) : (
          children
        ),
        leftIcon: <ImportantArticlesIcon />,
        link: `/announcement`,
        tabOnClick: () => {
          queryClient.refetchQueries({
            queryKey: ['get-announcements', undefined],
          });
        },
      },
      ...announcementsCats,
      {
        name: 'help',
        tabTitle: announcement.helpTabAnnouncement,
        leftIcon: <HelpIcon />,
        link: `/help/latest-help`,
        tabContent: null,
        extraClassname: '!text-warning-600',
      },
      {
        name: 'faq',
        tabTitle: announcement.faqsTabAnnouncement,
        leftIcon: <FAQIcon />,
        tabContent: null,
        link: `/faqs`,
        extraClassname: '!text-blue-500',
      },
    ];
  }, [categories]);

  useEffect(() => {
    if (data?.length) {
      setActiveTab(data[0].name);
    }
  }, [categories]);

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const handleCategory = (category: string) => {
    if (category === 'help') {
      return router.push('/help/latest-help');
    }

    if (category === 'faq') {
      return router.push('/faqs');
    }

    setActiveTab(category);
  };

  if (!data || isLoading)
    return (
      <div className="flex items-center justify-center mt-10">
        <Spinner />
      </div>
    );

  const activeTabIndex = data.findIndex(
    (item) => item.name === router.query.slug,
  );

  return (
    <>
      {isDesktop && (
        <TabsGroup
          tabs={data}
          selectedIndex={activeTabIndex !== -1 ? activeTabIndex : 0}
          mode="horizontal"
          classes={{ tabs: 'w-[306px]' }}
        />
      )}

      {!isDesktop && (
        <div className="flex flex-col gap-y-8 md:mt-0 w-full cursor-pointer">
          <ResponsiveMenu
            items={data}
            activeItem={
              data.find((item) => item.name === router.query.slug)
                ? data.find((item) => item.name === router.query.slug)!.name
                : activeTab
            }
            placeholder={
              router.query.slug === 'articles'
                ? announcement.firstTabArticles
                : catById?.data[0].attributes.title
                ? catById.data[0].attributes.title
                : announcement.firstTabArticles
            }
            onChange={handleCategory}
          />
          {!router.query.id ? (
            <div className="w-full">
              {getTabContent(
                data.find((item) => item.name === router.query.slug)
                  ? data.find((item) => item.name === router.query.slug)!.name
                  : activeTab,
                data,
              )}
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </>
  );
};
