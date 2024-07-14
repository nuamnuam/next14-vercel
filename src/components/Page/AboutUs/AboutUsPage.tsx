import React from 'react';
import dynamic from 'next/dynamic';

import { Icon, Spinner } from '@/components/Common';
import AuthBg from '@/assets/images/AuthBackground.svg';
import { useGetAboutUs } from '@/requests/about-us/about-us';
import { assetsUrl } from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';
import BreadCrumb from '@/components/Common/BreadCrumb';

const CompareArzinja = dynamic(
  async () => await import('./components/CompareArzinja'),
);
const StatusChart = dynamic(
  async () => await import('./components/StatusChart'),
);
const ArzinjaTeam = dynamic(
  async () => await import('./components/ArzinjaTeam'),
);

const AboutUsPage = () => {
  const [global, aboutUs] = useLang(['global', 'aboutUs']);

  const { data: aboutUsData, isLoading } = useGetAboutUs();
  const { isDesktop } = useBreakpoint();

  const breadcrumbs = [
    { label: global.startPage, href: '/' },
    { label: aboutUs.aboutUs, href: '/about-us' },
  ];

  if (!aboutUsData?.data || isLoading)
    return (
      <div className="mt-8 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const slider_SH = aboutUsData?.data?.attributes?.Slider_SH?.[0];
  const slider_IC = aboutUsData?.data?.attributes?.Slider_IC?.[0];

  return (
    <div
      className="bg-no-repeat bg-[length:100%] bg-[100%_-120px]"
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
    >
      <div className="p-4 md:p-4 lg:p-0">
        <div className="container lg:pt-8 md:pt-0">
          <BreadCrumb items={breadcrumbs} />
          <div className="grid items-center lg:grid-cols-5 lg:bg-inherit">
            <div className="w-full pt-10 md:pt-8 lg:pt-20 col-span-2">
              <span className="text-center block text-sm font-bold text-dark-700 sm:text-right">
                {slider_SH?.title_SH || ''}
              </span>
              <h1 className="text-center text-[28px] font-black leading-10 text-dark-700 sm:text-right">
                {slider_SH?.title || ''}
              </h1>
              <p
                dangerouslySetInnerHTML={{ __html: slider_SH?.description }}
                className="mt-4 w-full font-medium text-xs leading-6 text-dark-500 lg:max-w-[504px]"
              />

              <div className="mt-7 flex items-center justify-start gap-x-4">
                <Icon icon="Users-TwoTone" size={24} />
                <p className="text-xl	font-bold text-dark-700">
                  {slider_IC?.title}{' '}
                </p>
              </div>
            </div>
            <div className="mt-5 hidden items-center col-span-3 justify-center bg-contain bg-center bg-no-repeat sm:mt-0 lg:flex">
              <div className="w-5/5 lg:block">
                <img
                  src={assetsUrl(slider_SH?.media?.data?.attributes?.url)}
                  alt="media"
                  className="h-[527px] lg:w-[746px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-8 border-b-2 border-b-dark-100 md:my-14" />
      <div className="container mb-0 sm:mb-[72px]">
        <CompareArzinja />
      </div>
      <div className="block sm:hidden">
        <StatusChart />
      </div>
      <div className="container">
        <ArzinjaTeam />
      </div>
    </div>
  );
};

export default AboutUsPage;
