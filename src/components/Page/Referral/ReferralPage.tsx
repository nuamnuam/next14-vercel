import React from 'react';
import AuthBg from '@/assets/images/AuthBackground.svg';
import CandelBg1 from '@/assets/images/CandelBg1.png';
import CandelBg from '@/assets/images/CandleBg.svg';
import { useReferralContent } from '@/requests/referral';

import { TopBanner, Rewards, StartEarningIncome, Features } from './components';
import { Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';
import BreadCrumb from '@/components/Common/BreadCrumb';

const ReferralPage = () => {
  const [global] = useLang(['global']);

  const { data: referralContent, isLoading } = useReferralContent();
  const { isDesktop } = useBreakpoint();

  const breadcrumb = [
    { label: global.startPage, href: '/' },
    { label: global.inviteFriends, href: '/' },
  ];

  if (!referralContent || isLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const {
    attributes: { url, alternativeText },
  } = referralContent.data.attributes.Slider_SH.media.data[0];

  return (
    <div
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
      className="bg-no-repeat bg-[length:100%] bg-[100%_-105px]"
    >
      <div className="container">
        <BreadCrumb items={breadcrumb} classNames="pt-8" />
        <div className=" flex flex-col justify-between bg-top py-0 lg:flex-row lg:mt-16 lg:bg-inherit">
          <div className="w-full py-8 lg:pb-[158px] lg:mt-12 lg:w-1/2">
            <TopBanner />
          </div>
          <div className="mt-5 hidden items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-0 sm:w-1/3 lg:flex md:w-auto">
            <div className="lg:block">
              <img
                src={assetsUrl(url)}
                alt={alternativeText}
                className="w-[550px] h-[548px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container  sm:block">
        <Features />
      </div>
      <div className="my-[55px] lg:my-[72px] border-b-[1px] border-b-dark-100 md:block" />
      <div className="relative">
        <img
          src={CandelBg1.src}
          className="absolute left-0 -top-[400px] -z-10 lg:block hidden"
        />
        <div className="container sm:block">
          <Rewards />
        </div>
      </div>

      <div className=" relative">
        <img
          src={CandelBg.src}
          className="absolute right-0 -top-[500px] -z-10 lg:block hidden"
        />
        <div className="container">
          <StartEarningIncome />
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
