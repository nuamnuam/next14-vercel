import React, { useEffect } from 'react';

import { useMarketContentMutation } from '@/requests/market/contentMutation';
import BreadCrumb from '@/components/Common/BreadCrumb';
import { useBreakpoint, useLang } from '@/hooks';
import AuthBg from '@/assets/images/AuthBackground.svg';

import CoinsTable from './CoinsTable';

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL;

const AdvanceMarketPage: React.FC = () => {
  const [global, market] = useLang(['global', 'market']);

  const breadcrumbs = [
    { label: global.startPage, href: '/' },
    { label: market.tradeMarkets, href: '/advance-market' },
  ];

  const { isDesktop } = useBreakpoint();

  const { data } = useMarketContentMutation();

  const HeaderImgUrl = data
    ? `${MEDIA_BASE_URL}${data?.data.attributes.Header_SH.media?.data?.[0]?.attributes.url}`
    : '';

  useEffect(() => {
    document.title = market.marketTitle;
  }, []);

  return (
    <div>
      <div
        style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
        className="!bg-[length:100%] !bg-[2%_-98px] !bg-no-repeat"
      >
        <div className="hidden lg:flex lg:container -mb-2 flex justify-start bg-top py-8 md:pt-8 md:pb-0 sm:flex-row lg:justify-between lg:bg-inherit">
          <div>
            <BreadCrumb items={breadcrumbs} classNames="hidden lg:flex !p-0" />
            <div className="flex flex-col items-start pt-[73px]">
              <h1 className="my-0 text-[28px] font-bold leading-10 text-dark-700">
                {market.arzMarkets}
              </h1>
            </div>
          </div>
          {HeaderImgUrl ? (
            <div className="hidden lg:flex">
              <img src={HeaderImgUrl} alt="market" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="lg:container relative mb-8 lg:mb-12">
        <CoinsTable selectedTab="markets" />
      </div>
    </div>
  );
};

export default AdvanceMarketPage;
