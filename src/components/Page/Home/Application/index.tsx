import React, { FC, ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'classnames';
import Tooltip from '@mui/material/Tooltip';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import CandelBg1 from '@/assets/images/CandelBg1.png';
import { Button, Spinner } from '@/components/Common';
import { SliderContentResponse, useLandingContent } from '@/requests/home/home';
import { useBreakpoint } from '@/hooks';
import { AutoplaySwiperProps } from '@/components/Common/AnnouncementSwipper';
import { assetsUrl } from '@/utils';
import { useModal } from '@/hooks/useModal';

import type { HomeProps } from '../types';
import { guideModalName } from '../../PWA/components/GuideModal';

const Application: FC<HomeProps> = ({ data, isLoading }) => {
  const { data: application, isLoading: isContentLoading } = useLandingContent(
    !data,
  );

  const { showSyncModal } = useModal(guideModalName);

  const pageData = data || application?.data.attributes;
  const isComponentLoading = isLoading || isContentLoading;

  if (!pageData || isComponentLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );
  const { isDesktop } = useBreakpoint();
  const {
    APP_MobBack,
    APP_MobMedia,
    App_ASH,
    APP_IconCard,
    APP_CardMarket,
    APP_DSH,
  } = pageData;

  return (
    <div
      className="border-b border-dark-100 bg-[0%_-300px] bg-no-repeat pb-12 md:pb-20"
      style={{ backgroundImage: isDesktop ? `url('${CandelBg1.src}')` : '' }}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-28">
          <MobileApplication
            applicationImages={APP_MobMedia.media.data}
            mobileAppCover={APP_MobBack.media.data[0].attributes.url}
            mobileAppCandle={APP_MobBack.media.data[1].attributes.url}
          />

          <div className="items w-full lg:w-3/5 ml-6">
            <h2 className=" mt-0 mb-4 text-center text-[24px] font-black text-dark-700 md:text-right md:text-[28px]">
              {App_ASH.title}
            </h2>
            <p
              dangerouslySetInnerHTML={{ __html: App_ASH.description }}
              className="mt-0 mb-10 text-center text-sm font-medium leading-6 text-dark-500 md:text-right"
            />

            <div className="flex flex-wrap">
              {APP_IconCard.map((item: any, index: number) => (
                <div className="mb-1 w-1/2 pl-4" key={index}>
                  <div
                    className={clsx('flex items-center rounded-lg py-4 px-3')}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition duration-300 bg-primary-100">
                      <img
                        src={`${assetsUrl(item.media.data[0].attributes.url)}`}
                        alt="media"
                      />
                    </div>
                    <span className="mr-4 text-sm font-bold text-dark-600 md:text-base">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 hidden items-center justify-between md:flex">
              <h2 className=" text-[28px] font-black text-dark-700 ">
                {APP_DSH.title}
              </h2>
              <Button>
                <Link href={APP_DSH.ctaUrl}>{APP_DSH.cta}</Link>
              </Button>
            </div>
            <div className="mb-8 md:mt-4 flex items-center justify-between gap-5 overflow-x-auto lg:max-w-xl xl:max-w-none pt-4 pb-8 md:mb-12 md:gap-3 lg:mb-0 lg:gap-6 lg:pb-4">
              {APP_CardMarket.map((item: any) => {
                if (item?.title === 'PWA') {
                  return (
                    <div className="md:w-[161px] lg:w-[86px] md:h-[150px] lg:h-[90px] [&>a>div>img]:hover:saturate-[346%] [&>a>div>img]:hover:invert-[84%] [&>a>div>img]:hover:sepia-[10%] [&>a>div>img]:hover:hue-rotate-[194deg] [&>a>div>img]:hover:brightness-[88%] [&>a>div>img]:hover:contrast-[88%]">
                      <AppBoxHome
                        icon={
                          <img
                            src={`${assetsUrl(
                              item.media.data[0].attributes.url,
                            )}`}
                            alt="media"
                            className="md:w-8 md:h-8 w-6 h-6 lg:w-auto lg:h-auto"
                          />
                        }
                        title={item.title}
                        key={`${item.title}${item.url}`}
                        onClick={() => showSyncModal()}
                      />
                    </div>
                  );
                }
                return (
                  <div className="md:w-[161px] lg:w-[86px] md:h-[150px] lg:h-[90px] [&>a>div>img]:hover:saturate-[346%] [&>a>div>img]:hover:invert-[84%] [&>a>div>img]:hover:sepia-[10%] [&>a>div>img]:hover:hue-rotate-[194deg] [&>a>div>img]:hover:brightness-[88%] [&>a>div>img]:hover:contrast-[88%]">
                    <AppBoxHome
                      icon={
                        <img
                          src={`${assetsUrl(
                            item.media.data[0].attributes.url,
                          )}`}
                          alt="media"
                          className="md:w-8 md:h-8 w-6 h-6 lg:w-auto lg:h-auto"
                        />
                      }
                      link={item.url}
                      title={item.title}
                      qrCode={
                        <img
                          src={assetsUrl(item.qrMedia.data[0].attributes.url)}
                          className="w-32"
                          alt="media"
                        />
                      }
                      key={`${item.title}${item.url}`}
                    />
                  </div>
                );
              })}
            </div>

            <Button fullWidth className="block md:hidden">
              <Link href={APP_DSH.ctaUrl} className="w-full block">
                {APP_DSH.cta}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AppBoxProps {
  title: string;
  icon: any;
  link?: string;
  qrCode?: ReactNode;
  onClick?: () => void;
}

export const AppBoxHome = ({
  title,
  icon,
  link,
  qrCode,
  onClick,
}: AppBoxProps) => {
  const { isDesktop } = useBreakpoint();

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer group flex h-[90px] min-w-[81px] md:h-[150px] md:min-w-[160px] flex-col items-center rounded-lg bg-white shadow-card transition duration-300 hover:bg-dark-700 focus:bg-primary-500 lg:h-[90px] lg:w-[86px] lg:min-w-fit"
      >
        <div className="group flex flex-auto items-center justify-center transition duration-300">
          {icon}
        </div>
        <span className="self-stretch border-t border-dark-50 py-3 text-center text-xxs md:text-xs font-bold text-dark-500 transition duration-300 group-hover:border-dark-600 group-hover:text-dark-100 group-focus:border-primary-200 group-focus:text-white lg:py-2 lg:text-xxs">
          {title}
        </span>
      </div>
    );
  }
  if (link && qrCode)
    return isDesktop ? (
      <Tooltip
        title={qrCode}
        placement="top"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: '#fff',
              padding: '0.8rem',
              display: isDesktop ? 'block' : 'none',
            },
          },
          arrow: {
            sx: {
              '&::before': {
                color: '#fff',
              },
            },
          },
        }}
      >
        <Link
          className="group flex h-[90px] min-w-[80px] md:min-w-[86px] flex-col items-center rounded-lg bg-white shadow-card transition duration-300 hover:bg-dark-700 focus:bg-primary-500 lg:h-[90px] lg:w-[86px] lg:min-w-fit"
          href={link}
        >
          <div className="group flex flex-auto items-center justify-center transition duration-300">
            {icon}
          </div>
          <span className="self-stretch border-t border-dark-50 py-3 text-center text-xxs md:text-xs font-bold text-dark-500 transition duration-300 group-hover:border-dark-600 group-hover:text-dark-100 group-focus:border-primary-200 group-focus:text-white lg:py-2 lg:text-xxs">
            {title}
          </span>
        </Link>
      </Tooltip>
    ) : (
      <Link
        className="group flex h-[90px] min-w-[81px] md:h-[150px] md:min-w-[160px] flex-col items-center rounded-lg bg-white shadow-card transition duration-300 hover:bg-dark-700 focus:bg-primary-500 lg:h-[90px] lg:w-[86px] lg:min-w-fit"
        href={link}
      >
        <div className="group flex flex-auto items-center justify-center transition duration-300">
          {icon}
        </div>
        <span className="self-stretch border-t border-dark-50 py-3 text-center text-xxs md:text-xs font-bold text-dark-500 transition duration-300 group-hover:border-dark-600 group-hover:text-dark-100 group-focus:border-primary-200 group-focus:text-white lg:py-2 lg:text-xxs">
          {title}
        </span>
      </Link>
    );
};

export const AppBox = ({ title, icon, link, qrCode, onClick }: AppBoxProps) => {
  const { isDesktop } = useBreakpoint();

  if (onClick) {
    return (
      <div
        className="cursor-pointer group flex h-[150px] min-w-[161px] flex-col items-center rounded-lg bg-white shadow-card transition duration-300 hover:bg-dark-700 focus:bg-primary-500 lg:h-[90px] lg:w-[86px] lg:min-w-fit"
        onClick={onClick}
      >
        <div className="group flex flex-auto items-center justify-center transition duration-300">
          {icon}
        </div>
        <span className="self-stretch border-t border-dark-50 py-3 text-center text-xxs md:text-xs font-bold text-dark-500 transition duration-300 group-hover:border-dark-600 group-hover:text-dark-100 group-focus:border-primary-200 group-focus:text-white lg:py-2 lg:text-xxs">
          {title}
        </span>
      </div>
    );
  }
  if (link && qrCode)
    return isDesktop ? (
      <Tooltip
        title={qrCode}
        placement="top"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: '#fff',
              padding: '0.8rem',
              display: isDesktop ? 'block' : 'none',
            },
          },
          arrow: {
            sx: {
              '&::before': {
                color: '#fff',
              },
            },
          },
        }}
      >
        <Link
          className="group flex h-[90px] min-w-[80px] md:min-w-[86px] flex-col items-center rounded-lg bg-white shadow-card transition duration-300 hover:bg-dark-700 focus:bg-primary-500 lg:h-[90px] lg:w-[86px] lg:min-w-fit"
          href={link}
        >
          <div className="group flex flex-auto items-center justify-center transition duration-300">
            {icon}
          </div>
          <span className="self-stretch border-t border-dark-50 py-3 text-center text-xxs md:text-xs font-bold text-dark-500 transition duration-300 group-hover:border-dark-600 group-hover:text-dark-100 group-focus:border-primary-200 group-focus:text-white lg:py-2 lg:text-xxs">
            {title}
          </span>
        </Link>
      </Tooltip>
    ) : (
      <Link
        className="group flex h-[150px] min-w-[161px] flex-col items-center rounded-lg bg-white shadow-card transition duration-300 hover:bg-dark-700 focus:bg-primary-500 lg:h-[90px] lg:w-[86px] lg:min-w-fit"
        href={link}
      >
        <div className="group flex flex-auto items-center justify-center transition duration-300">
          {icon}
        </div>
        <span className="self-stretch border-t border-dark-50 py-3 text-center text-xxs md:text-xs font-bold text-dark-500 transition duration-300 group-hover:border-dark-600 group-hover:text-dark-100 group-focus:border-primary-200 group-focus:text-white lg:py-2 lg:text-xxs">
          {title}
        </span>
      </Link>
    );
};

export default Application;

interface MobileApplicationProps {
  mobileAppCover: string;
  applicationImages: SliderContentResponse['data']['attributes']['APP_MobMedia']['media']['data'];
  mobileAppCandle: string;
}

const MobileApplication = ({
  mobileAppCover,
  applicationImages,
  mobileAppCandle,
}: MobileApplicationProps) => {
  const swiperProps: AutoplaySwiperProps = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {},
    navigation: false,
    reverseDirection: true,
    className: 'flex md:w-[270px] !overflow-unset !mr-0',
    preloadImages: false,
    lazy: true,
    watchSlidesVisibility: true,
  };

  return (
    <div className="hidden w-2/5 lg:block relative">
      <img
        src={assetsUrl(mobileAppCandle)}
        className="absolute -z-10 h-full"
        alt="media"
      />
      <div className="relative w-[300px] mx-auto">
        <img
          src={assetsUrl(mobileAppCover)}
          className="absolute top-0 h-[610px] w-full left-0"
          alt="media"
        />
        <Swiper modules={[Autoplay, EffectFade]} effect="fade" {...swiperProps}>
          {applicationImages.map(({ attributes, id }) => (
            <SwiperSlide key={id} className="!h-[637px]">
              <div className="absolute h-[527px] w-[310px] -left-[2.1rem] top-[2.45rem]">
                <img
                  src={`${assetsUrl(attributes.url)}`}
                  className="h-full w-full"
                  alt="media"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
