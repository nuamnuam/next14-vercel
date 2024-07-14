import React, { useEffect } from 'react';

import { useMarketContentMutation } from '@/requests/market/contentMutation';
import { useCoinCategoriesMutation } from '@/requests/market/coinCategoriesMutation';
import useMarketStore from '@/store/marketStore';
import BreadCrumb from '@/components/Common/BreadCrumb';
import { Card, ParagraphBox } from '@/components';
import { useBreakpoint, useLang } from '@/hooks';
import AuthBg from '@/assets/images/AuthBackground.svg';

import CoinsTable from './CoinsTable';

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL;

const MarketPage = () => {
  const [global, instantMarket] = useLang(['global', 'instantMarket']);

  const { isDesktop } = useBreakpoint();
  const { category_id } = useMarketStore();

  const { data } = useMarketContentMutation();
  const { data: categories } = useCoinCategoriesMutation();

  const breadcrumbs = [
    { label: global.startPage, href: '/' },
    { label: instantMarket.tradeAndConvert, href: '/instant-market' },
  ];

  const HeaderImgUrl = data
    ? `${MEDIA_BASE_URL}${data?.data.attributes.Header_SH.media?.data?.[0]?.attributes.url}`
    : '';

  const activeCategory = categories?.result.find(
    ({ id }) => id === category_id,
  );

  useEffect(() => {
    if (category_id)
      document.title = `${instantMarket.instantMarketTitle}${
        activeCategory?.meta_title || ''
      }`;
    else {
      document.title = instantMarket.instantMarketTitle1;
    }
    return () => {
      document.title = instantMarket.instantMarketTitle2;
    };
  }, [category_id]);

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
                {activeCategory
                  ? `${instantMarket.coinsPrice} ${
                      activeCategory.meta_title || ''
                    }`
                  : data?.data.attributes.Header_SH.title}
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
        <CoinsTable selectedTab="trade" />
      </div>
      {activeCategory?.meta_description ||
      data?.data.attributes.BlogPost_Post.description ? (
        <div className="lg:container">
          <Card classNames="p-8">
            <ParagraphBox
              title={
                activeCategory?.meta_title ||
                data?.data.attributes.BlogPost_Post.title
              }
              content={
                activeCategory?.meta_description ||
                data?.data.attributes.BlogPost_Post.description
              }
              height={140}
            />
          </Card>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MarketPage;
