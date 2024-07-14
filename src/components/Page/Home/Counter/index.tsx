import React, { FC } from 'react';
import Link from 'next/link';

import { Button, Spinner } from '@/components/Common';
import CandelBg1 from '@/assets/images/RightCangleBg.svg';
import { useBreakpoint } from '@/hooks';
import { assetsUrl, toPersianDigits } from '@/utils';
import { useLandingContent } from '@/requests/home/home';

import type { HomeProps } from '../types';

const Counter: FC<HomeProps> = ({ data, isLoading }) => {
  const { data: counterData } = useLandingContent(!data);

  const pageData = data || counterData?.data.attributes;

  const { isDesktop } = useBreakpoint();

  if (!pageData || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { ContentBox_SH, Competition_CTA, ContentBox_IC, ContentBox_IC_Info } =
    pageData;

  return (
    <div
      className="border-b border-dark-100 md:py-18 bg-right bg-no-repeat"
      style={{ backgroundImage: isDesktop ? `url('${CandelBg1.src}')` : '' }}
    >
      <div className="container mb-8 md:mb-12 px-4 md:py-[72px] sm:px-8 lg:px-4">
        <div className="grid lg:gap-x-10 lg:grid-cols-5 items-center">
          <div className="w-full text-center md:text-right col-span-3 lg:col-span-2">
            <div className="flex items-center justify-between mb-6 mt-6 lg:mt-0">
              <h2 className="mt-0 text-2xl font-bold text-dark-700 md:text-[28px]">
                {ContentBox_SH?.title}
              </h2>

              <Button>
                <Link href={Competition_CTA.ctaUrl}>{Competition_CTA.cta}</Link>
              </Button>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: ContentBox_SH.description }}
              className="text-sm text-center sm:text-right font-medium leading-6 text-dark-500 mt-6"
            />

            <div className="items-center px-6 justify-between flex sm:w-4/5 lg:pr-0 mt-6 md:mt-12">
              {ContentBox_IC.slice(0, 2).map((item, idx) => (
                <div
                  key={item.id + idx}
                  className="flex flex-col items-center justify-between sm:flex-row"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <img
                      src={assetsUrl(item.media.data.attributes.url)}
                      className="w-full h-full"
                      alt="media"
                    />
                  </div>
                  <div className="mt-2 text-center sm:mt-0 sm:mr-4 sm:text-right">
                    <span className="block text-xl font-bold text-dark-700 sm:text-[28px] dir-ltr">
                      {toPersianDigits(item.title)}
                    </span>
                    <span
                      dangerouslySetInnerHTML={{ __html: item.description }}
                      className="text-xs sm:text-base font-medium text-dark-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-3 flex lg:justify-end">
            <div className="mt-6 md:mt-12 gap-y-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-4/5">
              {ContentBox_IC_Info.map((item, index) =>
                item?.title != null ? (
                  <div
                    className={
                      index === 0 || index === 2 ? 'flex lg:justify-end' : ''
                    }
                  >
                    <div
                      key={item.id + index}
                      className="flex bg-white shadow-card rounded-lg items-start md:flex-row p-6 w-full min-h-[130px] md:min-h-[148px] h-full"
                    >
                      <img
                        src={assetsUrl(item.media.data.attributes.url)}
                        alt="media"
                        width={32}
                        height={32}
                      />
                      <div className="text-right mr-4">
                        <span
                          dangerouslySetInnerHTML={{ __html: item?.title }}
                          className="mb-4 block text-xl font-bold text-dark-700"
                        />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item?.description?.slice(0, 170),
                          }}
                          className="text-xs font-medium text-dark-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;
