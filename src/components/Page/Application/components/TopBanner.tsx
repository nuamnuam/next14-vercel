import React from 'react';
import { Icon, Button, Spinner } from '@/components/Common';
import { useApplicationContent } from '@/requests/application';
import Link from 'next/link';

const TopBanner: React.FC = () => {
  const { data: applicationContent, isLoading } = useApplicationContent();

  if (!applicationContent || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const SliderSH = applicationContent.data.attributes.Slider_SH[0];

  const { Slider_SH_P2, Slider_SH_CTA } = applicationContent.data.attributes;

  return (
    <div>
      <div className="flex w-full flex-col items-center">
        <h3 className="mt-8 w-full text-center text-base text-dark-700 font-bold sm:mt-0 sm:text-right">
          {SliderSH?.title}
        </h3>
        <h1 className="mt-[.35rem] w-full text-center text-[28px] text-dark-700	 font-black sm:text-right sm:font-black">
          {SliderSH?.title}
        </h1>

        <div
          dangerouslySetInnerHTML={{ __html: SliderSH.description ?? '' }}
          className="mt-4 text-center md:text-right text-sm font-medium leading-6 text-dark-500"
        />

        <div className="mt-8 flex w-full flex-wrap gap-y-6">
          {Slider_SH_P2.map((item) => (
            <div className="flex w-6/12 gap-x-4 sm:w-5/12">
              <Icon
                icon="Check-TwoTone"
                size={24}
                className="[&>*]:fill-dark-200"
              />
              <p className="text-base font-bold text-dark-600">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 hidden sm:flex w-full items-center justify-start gap-x-6">
          <Button className="border-none" variant="primary">
            <Link href={Slider_SH_CTA[0].ctaUrl ?? '/'}>
              {Slider_SH_CTA[0].cta}
            </Link>
          </Button>
          <Button className="border-none bg-dark-500 text-white" variant="text">
            <Link href={Slider_SH_CTA[1].ctaUrl ?? '/'}>
              {Slider_SH_CTA[1].cta}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
