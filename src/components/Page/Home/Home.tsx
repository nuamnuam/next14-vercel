import React, { FC, Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

import AuthBg from '@/assets/images/OrientedAuthBackground.svg';
import CalculatorBg from '@/assets/images/CalculatorBg.png';
import { useBreakpoint, useMarketData } from '@/hooks';
import { Spinner } from '@/components';
import { useLandingContent } from '@/requests/home/home';

import Counter from './Counter';
import StartTrade from './StartTrade';
import type { HomeProps } from './types';

const Calculator = dynamic(
  async () => await import('@/components/Calculator/Calculator'),
  {
    ssr: true,
  },
);
const CoinsTable = dynamic(
  async () => await import('@/components/Page/Home/CoinsTable'),
  { ssr: true },
);
const HeroCarousel = dynamic(async () => await import('./HeroCarousel'), {
  ssr: true,
});
const PrimeCoins = dynamic(
  async () => await import('./PrimeCoins/PrimeCoins'),
  { ssr: true },
);
const Banners = dynamic(async () => await import('./Banners'), { ssr: true });
const Application = dynamic(async () => await import('./Application'), {
  ssr: true,
});
const AnnouncementSwipper = dynamic(
  async () => await import('@/components/Common/AnnouncementSwipper'),
  {
    ssr: true,
  },
);
const Blog = dynamic(async () => await import('./Blog'), { ssr: true });

const HomePage: FC<HomeProps> = (props) => {
  const [pairs, setPairs] = useState<string[]>([]);

  const { isDesktop } = useBreakpoint();

  const { data } = useLandingContent(!props.data);

  const { update } = useMarketData(pairs);

  const updatePairs = (input: string[]) => {
    if (input.length) {
      const result: string[] = [];
      input.forEach((item) => {
        if (!pairs.find((pair) => pair === item)) {
          result.push(item);
        }
      });
      setPairs([...pairs, ...result]);
    }
  };

  const pageData = props.data || data?.data;

  if (!pageData)
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );

  return (
    <div
      className="bg-[2%_-130px] bg-no-repeat bg-[length:100%]"
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
    >
      <div className="container flex md:gap-x-6 flex-col justify-between py-0 sm:pb-0 sm:pt-12 md:flex-row lg:bg-inherit lg:pt-10 px-4 md:px-8 lg:px-4">
        <div className=" py-0 md:w-5/12 lg:pt-10 lg:w-1/2">
          <Suspense fallback={<div />}>
            <HeroCarousel {...props} />
          </Suspense>
        </div>
        <div
          className="mt-5 flex items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-0 md:w-2/3 lg:w-7/12 mb-8"
          style={{ backgroundImage: `url('${CalculatorBg.src}')` }}
        >
          {updatePairs ? (
            <Suspense fallback={<div />}>
              <Calculator updatePairs={updatePairs} update={update} />
            </Suspense>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="container mb-8 md:mb-6 px-4 sm:px-8 lg:px-4">
        <Suspense fallback={<div />}>
          <AnnouncementSwipper {...props} />
        </Suspense>
      </div>
      <div className="container mb-12 px-4 sm:px-8 lg:px-4">
        <Suspense fallback={<div />}>
          <PrimeCoins updatePairs={updatePairs} update={update} />
        </Suspense>
      </div>
      {isDesktop ? (
        <div className="container mb-12 px-4 sm:px-8 lg:px-4">
          <Suspense fallback={<div />}>
            <Banners {...props} />
          </Suspense>
        </div>
      ) : null}
      <div className="container mb-8 md:mb-24 px-4 sm:px-8 lg:px-4">
        <Suspense fallback={<div />}>
          <CoinsTable
            updatePairs={updatePairs}
            update={update}
            currencies={props.currencies}
          />
        </Suspense>
      </div>
      {!isDesktop ? (
        <div className="container mb-8 md:mb-12 px-4 sm:px-8 lg:px-4">
          <Suspense fallback={<div />}>
            <Banners {...props} />
          </Suspense>
        </div>
      ) : null}
      <div>
        <Suspense fallback={<div />}>
          <Application {...props} />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<div />}>
          <Counter {...props} />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<div />}>
          <Blog {...props} />
        </Suspense>
      </div>
      <div className="mb-4 lg:-mb-24">
        <Suspense fallback={<div />}>
          <StartTrade {...props} />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
