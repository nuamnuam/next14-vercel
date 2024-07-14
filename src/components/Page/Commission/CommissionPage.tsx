import React from 'react';
import dynamic from 'next/dynamic';

import AuthBg from '@/assets/images/AuthBackground.svg';
import { useCommissionContent } from '@/requests/commission';
import { Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';
import BreadCrumb from '@/components/Common/BreadCrumb';

const CommissionTables = dynamic(
  async () =>
    await import(
      '@/components/Page/Panel/MyAccount/Commission/components/CommissionTables'
    ),
);

const CommissionPage = () => {
  const [global, commisson] = useLang(['global', 'commisson']);

  const { data: commission, isLoading } = useCommissionContent();
  const { isDesktop } = useBreakpoint();
  const breadcrumbs = [
    { label: global.startPage, href: '/' },
    { label: commisson.commissons, href: '/commission' },
  ];
  if (!commission?.data || isLoading)
    return (
      <div className="flex items-center justify-center mt-10">
        <Spinner />
      </div>
    );

  const { title, subTitle, media } = commission.data.attributes;

  return (
    <div
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
      className="bg-no-repeat bg-[length:100%] bg-[100%_-100px]"
    >
      <div className="container flex bg-top lg:py-0 sm:flex-row md:justify-between md:bg-inherit">
        <div className="lg:pt-8 pt-6">
          <BreadCrumb items={breadcrumbs} classNames="!p-0" />
          <div className="md:flex flex-col items-center md:items-start mx-auto lg:mt-12">
            <h2 className="my-0 font-bold leading-7 text-dark-700 hidden lg:block">
              {subTitle}
            </h2>
            <h1 className="lg:my-1 my-6 text-xl md:text-[28px] font-bold leading-10 text-dark-700 text-center">
              {title}
            </h1>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="lg:block hidden">
            <img
              src={assetsUrl(media.data.attributes.url)}
              alt="media"
              className="w-[500px] h-[220px]"
            />
          </div>
        </div>
      </div>

      <div className="container relative">
        <CommissionTables />
      </div>
    </div>
  );
};

export default CommissionPage;
