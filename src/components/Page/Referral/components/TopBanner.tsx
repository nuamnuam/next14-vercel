import React from 'react';
import Link from 'next/link';
import { useReferralContent } from '@/requests/referral';

import { Button, Chip, Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';

const TopBanner = () => {
  const { data: referralContent, isLoading } = useReferralContent();

  if (!referralContent || isLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const {
    Slider_SH: { cta, ctaUrl, description, id, title },
    SliderTitle_SH,
    Slider_C,
  } = referralContent.data.attributes;

  return (
    <div>
      <div className="flex w-full flex-col items-center md:items-start">
        <Chip
          label={Slider_C.title}
          variant="light"
          classNames="!bg-white"
          icon={
            <img
              src={assetsUrl(Slider_C.media.data[0].attributes.url)}
              alt={Slider_C.media.data[0].attributes.alternativeText}
              className="w-4 h-4"
            />
          }
        />
        <h2 className="mt-8 text-base font-bold text-dark-700 text-center md:text-right">
          {SliderTitle_SH.title}
        </h2>
        <h1 className="mt-[.35rem] w-full text-2xl text-center md:text-right  md:text-[28px] text-dark-700 font-black sm:text-right sm:font-black ">
          {title}
        </h1>
        <h3
          className="mt-4 text-sm lg:max-w-[504px] font-medium text-center md:text-right leading-6 text-dark-500"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <Button className="mt-7 border-none " variant="primary">
          <Link href={ctaUrl}>{cta}</Link>
        </Button>
      </div>
    </div>
  );
};

export default TopBanner;
