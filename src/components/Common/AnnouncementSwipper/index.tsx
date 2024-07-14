import 'swiper/css';

import { FC } from 'react';
import Link from 'next/link';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { timestampToPersianDate } from '@/utils/date-format';
import { useBreakpoint } from '@/hooks';
import { useAnnouncements } from '@/requests/home/announcements';
import { HomeProps } from '@/components/Page/Home/types';

import Icon from '../Icon';
import Spinner from '../Spinner';

export interface AutoplaySwiperProps {
  spaceBetween: number;
  centeredSlides: boolean;
  autoplay: {
    delay: number;
    disableOnInteraction: boolean;
  };
  loop?: boolean;
  pagination: object;
  navigation: boolean;
  className: string;
  slidesPerView: number;
  preloadImages: boolean;
  lazy: boolean;
  watchSlidesVisibility: boolean;
  reverseDirection: boolean;
  direction?: 'vertical' | 'horizontal';
}

const AnnouncementSwipper: FC<Partial<HomeProps>> = ({
  announcements: announcementsData,
}) => {
  const { isMobile } = useBreakpoint();
  const { data: announcements } = useAnnouncements(!announcementsData);

  const data = announcementsData || announcements.data;

  if (!data)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const swiperProps: AutoplaySwiperProps = {
    spaceBetween: 30,
    centeredSlides: true,
    slidesPerView: 1,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop: true,
    pagination: {},
    navigation: false,
    reverseDirection: true,
    className: 'flex w-[330px] md:w-[600px] !overflow-unset !mr-0',
    preloadImages: false,
    lazy: true,
    watchSlidesVisibility: true,
    direction: 'vertical',
  };

  return (
    <div className="relative flex w-full items-center justify-start gap-3 overflow-hidden md:!w-11/12">
      <div className="h-8 w-8 min-w-8 flex justify-center items-center bg-danger-100 rounded-lg">
        <Icon
          icon="Announcement-TwoTone"
          className="[&>*]:fill-danger-500"
          size={16}
        />
      </div>
      <Swiper modules={[Autoplay]} {...swiperProps} className="h-[50px] !m-0">
        {data.map(({ attributes }: { attributes: any }, idx: number) => {
          return (
            <SwiperSlide key={attributes.slug + idx}>
              <Link
                href={`/announcement/${attributes?.announcement_cats?.data?.[0]?.attributes?.slug}/${attributes.slug}`}
                className="flex flex-col rounded-lg justify-center h-full"
              >
                <div className="lg:flex items-center justify-start gap-x-2">
                  <span className="text-sm font-medium text-dark-700 lg:whitespace-pre">
                    {attributes.title}
                  </span>
                  <span className="mr-2 inline-block text-xs font-medium text-dark-300 lg:whitespace-pre">
                    {timestampToPersianDate(attributes.dateTime)}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default AnnouncementSwipper;
