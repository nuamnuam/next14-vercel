import React from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import AuthBg from '@/assets/images/AuthBackground.svg';

import { useBreakpoint, useLang } from '@/hooks';
import { useTermsContent } from '@/requests/termsAndConditions';
import { Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';
import BreadCrumb from '@/components/Common/BreadCrumb';
const ContentSectionPage = dynamic(
  async () => await import('./components/ContentSectionPage'),
);

const TermsAndConditionsPage = () => {
  const [global, terms] = useLang(['global', 'terms']);

  const { isDesktop } = useBreakpoint();
  const { data: termsContent, isLoading } = useTermsContent();
  const breadcrumbs = [
    { label: global.startPage, href: '/' },
    { label: terms.provisionAgreement, href: '/terms-and-conditions' },
  ];
  if (!termsContent?.data || isLoading)
    return (
      <div className="mt-8 flex items-center justify-center">
        <Spinner />
      </div>
    );
  const { Header_SH } = termsContent.data.attributes;

  return (
    <div
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
      className="bg-no-repeat bg-[length:100%] bg-[100%_-128px]"
    >
      <div className="container flex flex-col lg:justify-between py-0 sm:flex-row lg:bg-inherit lg:mt-3">
        <div className="sm:w-full lg:w-1/2 pt-8 text-center">
          <BreadCrumb items={breadcrumbs} classNames="!py-0" />
          <div className="flex flex-col gap-1 pt-10 lg:pt-0  lg:pb-4 lg:justify-center lg:h-full">
            <h2 className="text-center text-base font-bold text-dark-700 lg:text-right mx-auto lg:mx-0">
              {Header_SH.title}
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: Header_SH.description }}
              className="text-center text-[28px] font-black text-dark-700 lg:text-right"
            />
          </div>
        </div>
        <div className="mt-5 hidden lg:block items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-0  sm:w-1/3 lg:w-4/12">
          <div className="w-5/5 lg:block hidden">
            <img
              className="w-[500px]"
              src={assetsUrl(Header_SH.media.data.attributes.url)}
              alt="media"
            />
          </div>
        </div>
      </div>
      <div
        className={classNames(
          'container relative ',
          isDesktop ? 'mt-0' : 'mt-8',
        )}
      >
        <ContentSectionPage />
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
