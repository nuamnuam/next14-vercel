import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import AuthBg from '@/assets/images/AuthBackground.svg';
import CandelBg1 from '@/assets/images/CandleBg.svg';

import { useApplicationContent } from '@/requests/application';
import { assetsUrl } from '@/utils';
import { Spinner } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import BreadCrumb from '@/components/Common/BreadCrumb';
import { useSubmitIPMutation } from '@/requests/application/ipMutation';

const TopBanner = dynamic(async () => await import('./components/TopBanner'));
const DownloadLinks = dynamic(
  async () => await import('./components/DownloadLinks'),
);
const VideoBanner = dynamic(
  async () => await import('./components/VideoBanner'),
);
const Features = dynamic(async () => await import('./components/Features'));

const AnnouncementPage = () => {
  const [global] = useLang(['global']);

  const { data: applicationContent, isLoading } = useApplicationContent();
  const { mutateAsync } = useSubmitIPMutation();
  const { isDesktop } = useBreakpoint();

  const getClientIp = async () => {
    const response = await fetch('/api/ip');
    const result = await response.json();
    if (result?.ip) await mutateAsync({ ip: result.ip });
  };

  useEffect(() => {
    getClientIp();
  }, []);

  if (!applicationContent || isLoading)
    return (
      <div className="mt-8 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const { Slider_Image } = applicationContent.data.attributes;

  const breadcrumbs = [
    {
      label: global.startPage,
      href: '/',
    },
    {
      label: global.downloadApplication,
      href: '/application',
    },
  ];

  return (
    <div
      className="bg-[length:100%] bg-no-repeat"
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
    >
      <div className="container mt-6 mb-8 block sm:hidden">
        <BreadCrumb items={breadcrumbs} classNames="md:block pb-8" />
        <DownloadLinks />
      </div>
      <div className="container">
        <BreadCrumb items={breadcrumbs} classNames="sm:flex hidden pt-8" />
        <div className="flex flex-col justify-between bg-top gap-10 py-0 sm:flex-row">
          <div className="w-full lg:pt-[90px] py-0 sm:py-8 lg:w-1/2">
            <TopBanner />
          </div>
          {Slider_Image[0].media.data[0].attributes?.url ? (
            <div className="mt-5 hidden items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-10 sm:w-2/3 lg:flex lg:w-5/12">
              <div className="w-5/5 lg:block">
                <img
                  src={assetsUrl(Slider_Image[0].media.data[0].attributes.url)}
                  alt="media"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <div className="container hidden sm:block lg:hidden py-6">
          <Features />
        </div>
      </div>
      <div className="container hidden lg:block">
        <DownloadLinks />
      </div>
      <div className="my-14 hidden border-b-[1px] border-b-dark-100 lg:block" />
      <div className="container hidden sm:block">
        <VideoBanner />
      </div>
      <div className="my-14 border-b-2 border-b-dark-100 sm:block hidden" />
      <div className="py-14 lg:block hidden relative">
        <img
          src={CandelBg1.src}
          className="absolute right-0 -top-[500px] -z-10 lg:block hidden"
        />
        <div className="container lg:block hidden relative">
          <Features />
        </div>
      </div>
      <div className="mt-12 mb-8 hidden border-b-2 border-b-dark-100 lg:hidden" />

      <div className="container mt-12 hidden sm:block lg:hidden">
        <DownloadLinks />
      </div>
      <div className="my-14 border-b-2 border-b-dark-100 hidden sm:block lg:hidden " />
    </div>
  );
};

export default AnnouncementPage;
