import React, { useMemo } from 'react';
import AuthBg from '@/assets/images/AuthBackground.svg';
import { useFaqPageContent } from '@/requests/faqs/page';

import ContentSectionPage from './ContentSection/ContentSectionPage';
import { Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';
import BreadCrumb from '@/components/Common/BreadCrumb';

import { Context } from './ContentSection/Transactions/TransactionsPage';

interface Props {
  main: string;
}

const FaqsPage = ({ main }: Props) => {
  const [global, faq, help] = useLang(['global', 'faq', 'help']);

  const { data: faqPage, isLoading } = useFaqPageContent();
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
      {
        label: faq.faqsTabAnnouncement,
        href: '/faqs',
      },
    ];

    return items;
  }, []);

  if (!faqPage?.data || isLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div
      className="bg-[100%_-100px]"
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
    >
      <div className="container flex flex-col items-start justify-between bg-top py-0 sm:flex-row lg:bg-inherit">
        <div className="py-0 sm:w-6/12 lg:w-1/2">
          <div className="mt-8">
            <BreadCrumb classNames="!py-0" items={breadCrumbGenerator} />
          </div>
          <div className="flex w-full flex-col mt-6 lg:mt-16">
            <h1
              className="lg:mt-[.35rem] w-full text-xl md:text-[28px] text-right font-black"
              dangerouslySetInnerHTML={{
                __html: faqPage.data.attributes.title,
              }}
            />
          </div>
        </div>
        <div className="mt-5 hidden items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-0 lg:flex sm:w-1/3 lg:w-4/12">
          <div className="w-5/5 lg:block">
            <img
              src={assetsUrl(faqPage.data.attributes.media.data.attributes.url)}
              alt="media"
            />
          </div>
        </div>
      </div>
      <div className="relative">
        <Context>
          <ContentSectionPage />
        </Context>
      </div>
    </div>
  );
};

export default FaqsPage;
