import React, { useEffect, useRef, useState } from 'react';
import clsx from 'classnames';

import CandelBg1 from '@/assets/images/CandelBg1.png';
import { useBreakpoint } from '@/hooks';
import { AboutUsResponse, useGetAboutUs } from '@/requests/about-us/about-us';
import { Spinner } from '@/components/Common';

import { ResponsiveStatusBar } from '../components';

const StatusChart = () => {
  const { isMobile, isDesktop } = useBreakpoint();
  const { data: aboutUs, isLoading } = useGetAboutUs();
  const targetRef = useRef<HTMLDivElement>(null);
  const [visibleId, setVisibleId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (targetRef.current != null) {
        const elements = targetRef.current.querySelectorAll('div[id]');
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        let visibleElementId = '';

        elements.forEach((element) => {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + scrollTop;
          const elementBottom = bottom + scrollTop;

          if (
            elementTop >= scrollTop &&
            elementBottom <= scrollTop + windowHeight
          ) {
            visibleElementId = element.id;
          }
        });
        setVisibleId(visibleElementId);
      }
    };
    if (!isDesktop) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!aboutUs?.data || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const Roadmap_SH = aboutUs?.data?.attributes?.Roadmap_SH?.[0];
  const Roadmap_TM = aboutUs?.data?.attributes?.Roadmap_TM;

  return (
    <div
      className="my-8 flex flex-col items-center justify-start sm:mb-32 lg:mt-20 lg:mb-0 lg:pb-44 bg-no-repeat bg-right-top"
      style={{ backgroundImage: isDesktop ? `url('${CandelBg1.src}')` : '' }}
    >
      <div
        className="bg-no-repeat w-full bg-left"
        style={{ backgroundImage: isDesktop ? `url('${CandelBg1.src}')` : '' }}
      >
        <div className="container">
          <h2 className="m-auto text-[28px] font-black text-dark-700 text-center">
            {Roadmap_SH.title}
          </h2>
          <p
            className="m-auto mt-4 mb-6 text-xs font-medium text-dark-500 px-4 text-center"
            dangerouslySetInnerHTML={{ __html: Roadmap_SH?.description }}
          />

          <div
            className={clsx(
              'flex flex-col items-center justify-start',
              isMobile ? 'p-4' : 'p-4',
            )}
            ref={targetRef}
          >
            {mapTimelineData(Roadmap_TM).map((item, index: number) =>
              isDesktop ? null : (
                // <ResponsiveStatusBlock
                //   key={item.title}
                //   {...item}
                //   firstItem={index === 0}
                //   lastUpdate={''}
                //   lastItem={mapTimelineData(Roadmap_TM).length - 1 == index}
                //   active={index + 1 <= +visibleId?.slice(-1)}
                //   section={index + 1}
                // />
                <ResponsiveStatusBar
                  key={item.title}
                  {...item}
                  cardClassName={index === 0 ? '!mt-0' : ''}
                  className={index === 0 ? '[&_.horizontal-line]:!top-1/2' : ''}
                  lastItem={mapTimelineData(Roadmap_TM).length - 1 == index}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChart;

function mapTimelineData(
  timeline: AboutUsResponse['data']['attributes']['Roadmap_TM'],
) {
  return timeline.map((item, index) => {
    if (index === 0)
      return {
        date: item.date,
        title: item.title,
        variant: 'green' as any,
        description: item.description,
        direction: 'to-top',
        update: {
          title: item.title,
          description: item.description,
          updatedAt: item.date,
        },
        cardClassName: 'shadow-card bg-white',
      };

    return index % 2 === 0
      ? {
          date: item.date,
          title: item.title,
          variant: 'gray' as any,
          description: item.description,
          direction: 'to-top',
          update: {
            title: item.title,
            description: item.description,
            updatedAt: item.date,
          },
          cardClassName: 'bg-transparent',
        }
      : {
          date: item.date,
          title: item.title,
          variant: 'gray' as any,
          description: item.description,
          direction: 'to-bottom',
          update: {
            title: item.title,
            description: item.description,
            updatedAt: item.date,
          },
          cardClassName: 'bg-transparent',
        };
  });
}
