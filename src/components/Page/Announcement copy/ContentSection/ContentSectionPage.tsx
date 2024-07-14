import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useFaqCatByIdContent } from '@/requests/faqs/catById';
import { queryClient } from '@/requests';
import { useFaqCatsContent } from '@/requests/faqs/cats';

import { useBreakpoint, useLang } from '@/hooks';
import { TabsGroup, Spinner } from '@/components/Common';
import ImportantArticlesIcon from '@/components/Icons/announcement/ImportantArticlesIcon';
import Transactions, { FaqContext } from './Transactions/TransactionsPage';
import { assetsUrl } from '@/utils';
import HelpIcon from '@/components/Icons/announcement/HelpIcon';
import { TabsModel } from '@/components/Common/Tab';
import NotifIcon from '@/components/Icons/announcement/NotifIcon';
import ResponsiveMenu from '../ResponsiveMenu';

type TabContent = Array<TabsModel & { name: string }>;

const getTabContent = (tab: string, tabContents: TabContent) => {
  return tabContents.find((item) => item.name === tab)?.tabContent;
};

const ContentSectionPage = () => {
  return (
    <div className="container flex items-start justify-between">
      <CategoryTabs />
    </div>
  );
};

export default ContentSectionPage;

const CategoryTabs = () => {
  const [announcement, faq] = useLang(['announcement', 'faq']);

  const { isDesktop } = useBreakpoint();
  const { query } = useRouter();

  const { data: faqCatById, isLoading: faqLoading } = useFaqCatByIdContent(
    query.categoryId === 'articles' ? undefined : (query.categoryId as string),
  );

  const { setFaqId } = useContext(FaqContext);

  const { data: categories, isLoading } = useFaqCatsContent();
  const [activeTab, setActiveTab] = useState('');

  const router = useRouter();

  const data: TabContent | undefined = useMemo(() => {
    if (!categories) return;

    categories.data.sort(
      (a, b) => a.attributes.priority - b.attributes.priority,
    );

    const faqsCats = categories.data.map(({ attributes, id }) => {
      return {
        name: String(attributes.slug),
        tabTitle: attributes.title,
        tabContent: <Transactions categoryId={id} />,
        leftIcon: (
          <img
            src={assetsUrl(attributes.icon.data[0].attributes.url)}
            className="w-5 h-5"
            alt="media"
          />
        ),
        tabOnClick: () => {
          queryClient.refetchQueries({
            queryKey: ['get-faqs', id],
          });
          setFaqId(null);
        },
      };
    });

    return [
      {
        name: 'articles',
        tabTitle: faq.latestTabFaq,
        tabContent: <Transactions name="articles" />,
        leftIcon: <ImportantArticlesIcon />,
        tabOnClick: () => {
          queryClient.refetchQueries({ queryKey: ['get-faqs', undefined] });
          router.push('/faqs');
        },
      },
      ...faqsCats,
      {
        name: 'help',
        tabTitle: announcement.helpTabAnnouncement,
        leftIcon: <HelpIcon />,
        tabOnClick: () => {
          router.push('/help/latest-help');
        },
        tabContent: null,
        extraClassname: '!text-warning-600',
      },
      {
        name: 'announcement',
        tabTitle: announcement.announcementTabFAQ,
        leftIcon: <NotifIcon />,
        tabOnClick: () => {
          router.push('/announcement');
        },
        tabContent: null,
        extraClassname: '!text-danger-600',
      },
    ];
  }, [categories]);

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const handleCategory = (category: string) => {
    if (category === 'help') {
      return router.push('/help/latest-help');
    }

    if (category === 'announcement') {
      return router.push('/announcement');
    }

    setFaqId(null);
    queryClient.refetchQueries({ queryKey: ['get-faqs'] });

    router.push(`/faqs/${category}`);

    setActiveTab(category);
  };

  useEffect(() => {
    if (data?.length) {
      setActiveTab(data[0].name);
    }
  }, [categories]);

  if (!data || isLoading)
    return (
      <div className="flex items-center justify-center mt-10">
        <Spinner />
      </div>
    );

  return (
    <>
      {isDesktop && (
        <TabsGroup
          tabs={data}
          mode="horizontal"
          classes={{ tabs: 'w-[306px]' }}
        />
      )}
      {!isDesktop && (
        <div className="mt-6 flex flex-col gap-y-6 w-full cursor-pointer rounded-lg">
          {faqLoading ? (
            <div>
              <Spinner />
            </div>
          ) : (
            <ResponsiveMenu
              items={data}
              activeItem={
                data.find((item) => item.name === router.query.categoryId)
                  ? data.find((item) => item.name === router.query.categoryId)!
                      .name
                  : activeTab
              }
              placeholder={
                faqCatById?.data[0].attributes.title
                  ? faqCatById?.data[0].attributes.title
                  : faq.latestTabFaq
              }
              onChange={handleCategory}
            />
          )}
          <div className="w-full">
            {getTabContent(
              data.find((item) => item.name === router.query.categoryId)
                ? data.find((item) => item.name === router.query.categoryId)!
                    .name
                : activeTab,
              data,
            )}
          </div>
        </div>
      )}
    </>
  );
};
