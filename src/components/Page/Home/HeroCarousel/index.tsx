import 'swiper/css/pagination';
import 'swiper/css';
import 'swiper/css/effect-fade';

import React, { FC } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import clsx from 'classnames';

import { Button } from '@/components/Common';
import { useBreakpoint } from '@/hooks';

import type { HomeProps } from '../types';
import styles from './styles.module.scss';
import { useLandingContent } from '@/requests/home/home';

const HeroCarousel: FC<HomeProps> = ({ data }) => {
  const { data: sliderData } = useLandingContent(!data);

  const pageData = data || sliderData?.data.attributes;

  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  const swiperProps: SwiperOptions = {
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
    },
  };

  return (
    <div
      style={{ direction: 'ltr' }}
      className={clsx(
        styles.hero_slider,
        isDesktop && styles.hero_slider__desktop,
        isTablet && styles.hero_slider__tablet,
        isMobile && styles.hero_slider__mobile,
      )}
    >
      <Swiper
        {...swiperProps}
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        className="h-auto md:h-[600px] lg:h-[460px] text-center md:text-right"
      >
        {pageData?.Slider_CC.map((slide) => (
          <SwiperSlide key={slide.id} className="h-[400px] md:pr-10">
            <Slide
              title={slide.title}
              description={slide.description}
              actionTitle={slide.cta}
              href={slide.ctaUrl}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

interface SlideProps {
  title: string;
  description: string;
  actionTitle?: string;
  href?: string;
}

const Slide: React.FC<SlideProps> = ({
  title,
  description,
  href,
  actionTitle,
}) => {
  return (
    <div
      className="flex flex-col items-center py-8 md:items-start justify-center h-full md:py-0"
      style={{ direction: 'rtl' }}
    >
      <h2 className="mt-0 mb-6 text-2xl font-black leading-normal text-dark-700 sm:text-[28px] lg:text-[32px] ">
        {title}
      </h2>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="mt-0 mb-6 text-sm font-medium leading-6 text-dark-500"
      />
      {actionTitle && href && (
        <Link href={href}>
          <Button size="lg">{actionTitle}</Button>
        </Link>
      )}
    </div>
  );
};

export default HeroCarousel;
