import React from 'react';
import { Icon, Spinner } from '@/components/Common';
import clsx from 'classnames';
import Link from 'next/link';

import { useApplicationContent } from '@/requests/application';
import { assetsUrl } from '@/utils';
import { useModal } from '@/hooks/useModal';

import { AppBox } from '../../Home/Application';
import { guideModalName } from '../../PWA/components/GuideModal';

const DownloadLinks = () => {
  const { data: applicationContent, isLoading } = useApplicationContent();

  const { showSyncModal } = useModal(guideModalName);

  if (!applicationContent || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { Download_SH, Download_CM, Download_DL } =
    applicationContent.data.attributes;

  return (
    <div className="p-0 sm:p-4">
      <div className="flex w-full flex-col gap-x-8 lg:items-center lg:flex-row justify-between">
        <div className="w-full lg:w-5/12">
          <h1 className="mt-[.35rem] w-full text-center text-dark-700 text-[28px]	 font-black sm:text-right sm:font-black">
            {Download_SH.title}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: Download_SH.description ?? '' }}
            className="mt-4 lg:max-w-[416px] text-center md:text-right  text-sm font-medium leading-6 text-dark-500"
          />
        </div>
        <div className="w-full sm:w-auto">
          <div className="mt-8 w-full grid sm:hidden sm:pr-9 md:pr-0 grid-cols-2 sm:overflow-x-auto md:overflow-x-visible max-w-none sm:max-w-2xl md:grid-cols-7 justify-between gap-x-5 gap-y-6">
            {Download_CM.map(({ title, media, id, url }, index) => {
              if (title === 'PWA') {
                return (
                  <div
                    key={id}
                    className={clsx(
                      'h-full [&>div>div>div]:h-full',
                      index === 0 && 'col-span-2 sm:col-span-1',
                    )}
                    onClick={() => showSyncModal()}
                  >
                    <div
                      className={clsx(
                        'flex w-full h-[59px] items-center justify-start pr-2 sm:pr-0 sm:gap-x-4 shadow-card rounded-md bg-white py-3 sm:w-[84px] sm:flex-col sm:justify-center sm:pt-4 sm:pb-3',
                        index !== 0 && 'w-[45%] flex-row ',
                      )}
                    >
                      {media.data[0].attributes?.url ? (
                        <img
                          src={assetsUrl(media.data[0].attributes.url)}
                          width={24}
                          height={24}
                          alt="media"
                        />
                      ) : null}

                      {title ? (
                        <p className="m-0 w-full px-2 border-t-white text-right sm:text-center text-[10px] font-bold text-dark-500 sm:mt-3 sm:border-t-2 sm:border-t-dark-50 sm:pt-2">
                          {title}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={id}
                  className={clsx(
                    'h-full [&>div>div>div]:h-full',
                    index === 0 && 'col-span-2 sm:col-span-1',
                  )}
                >
                  <Link
                    href={url || '/'}
                    className={clsx(
                      'flex w-full h-[59px] items-center justify-start pr-2 sm:pr-0 sm:gap-x-4 shadow-card rounded-md bg-white py-3 sm:w-[84px] sm:flex-col sm:justify-center sm:pt-4 sm:pb-3',
                      index !== 0 && 'w-[45%] flex-row ',
                    )}
                  >
                    {media.data[0].attributes?.url ? (
                      <img
                        src={assetsUrl(media.data[0].attributes.url)}
                        width={24}
                        height={24}
                        alt="media"
                      />
                    ) : null}

                    {title ? (
                      <p className="m-0 w-full px-2 border-t-white text-right sm:text-center text-[10px] font-bold text-dark-500 sm:mt-3 sm:border-t-2 sm:border-t-dark-50 sm:pt-2">
                        {title}
                      </p>
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mt-4 mb-8 lg:p-8 hidden items-center sm:flex justify-between gap-5 overflow-x-auto lg:max-w-xl xl:max-w-none pt-4 pb-8 md:mb-12 md:gap-3 lg:mb-0 lg:gap-6 lg:pb-4">
            {Download_CM.map((item, index) => {
              if (item?.title === 'PWA') {
                return (
                  <div className="lg:w-[86px] lg:h-[90px] sm:w-[161px] sm:h-[150px]  [&>a>div>img]:hover:saturate-[346%] [&>a>div>img]:hover:invert-[84%] [&>a>div>img]:hover:sepia-[10%] [&>a>div>img]:hover:hue-rotate-[194deg] [&>a>div>img]:hover:brightness-[88%] [&>a>div>img]:hover:contrast-[88%]">
                    {item.media.data[0].attributes.url && item.title ? (
                      <AppBox
                        icon={
                          <img
                            src={`${assetsUrl(
                              item.media.data[0].attributes.url,
                            )}`}
                            alt="media"
                            className="lg:w-[24px] lg:h-[24px] w-[32px] h-[32px]"
                          />
                        }
                        title={item.title}
                        key={index}
                        onClick={() => showSyncModal()}
                      />
                    ) : null}
                  </div>
                );
              }
              return (
                <div className="lg:w-[86px] lg:h-[90px] sm:w-[161px] sm:h-[150px]  [&>a>div>img]:hover:saturate-[346%] [&>a>div>img]:hover:invert-[84%] [&>a>div>img]:hover:sepia-[10%] [&>a>div>img]:hover:hue-rotate-[194deg] [&>a>div>img]:hover:brightness-[88%] [&>a>div>img]:hover:contrast-[88%]">
                  {item.media.data[0].attributes.url && item.title ? (
                    <AppBox
                      icon={
                        <img
                          src={`${assetsUrl(
                            item.media.data[0].attributes.url,
                          )}`}
                          alt="media"
                          className="lg:w-[24px] lg:h-[24px] w-[32px] h-[32px]"
                        />
                      }
                      link={item.url ?? '/'}
                      title={item.title}
                      qrCode={
                        <img
                          src={assetsUrl(item.qrMedia.data[0].attributes.url)}
                          alt="media"
                          className="w-32 hover:opacity(0.5) hover:drop-shadow(0px 0px 0px #B6B9CC)"
                        />
                      }
                      key={index}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-start gap-x-1 sm:gap-x-2 lg:p-8">
            <span className="bg-[#FFECB0] py-[4px] px-2 rounded-lg">
              <Icon
                icon={'Exclamation-TwoTone'}
                className="text-warning-600 [&>*]:fill-warning-600"
                size={16}
              />
            </span>
            <p className="text-sm font-medium text-dark-700	">
              {Download_DL[0].title}
            </p>
            <Link
              href={Download_DL[0].ctaUrl ?? '/'}
              className="text-sm text-primary-600 cursor-pointer"
            >
              {Download_DL[0].cta}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadLinks;
