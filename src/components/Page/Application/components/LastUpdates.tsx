import React, { useState, useRef, useEffect } from 'react';

import { Button, Spinner } from '@/components/Common';
import { useBreakpoint } from '@/hooks';
import clsx from 'classnames';
import { StatusBlock, ResponsiveStatusBlock } from '../components';
import {
  ApplicationContentResponse,
  useApplicationContent,
} from '@/requests/application';
import Link from 'next/link';
import { StatusVariant } from './StatusBlock';
import { getLang } from '@/utils';

interface IStatusItem {
  title: string;
  date: string;
  description: string;
  variant?: 'green' | 'gray';
  lastItem?: boolean;
  direction?: string;
  update?: {
    title?: string;
    description?: string;
    updatedAt?: string;
  };
  cardClassName?: string;
}

const [application] = getLang(['application']);

const LastUpdates = () => {
  const { data: applicationContent, isLoading } = useApplicationContent();

  if (!applicationContent || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { Intro_SH2, Roadmap_TL, Roadmap_TL_LT } =
    applicationContent.data.attributes;

  const { isDesktop } = useBreakpoint();
  const [active, setActive] = useState(0);

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

  return (
    <div>
      <div className="container">
        <div className="lg:mt-10 mt-12 flex items-center justify-between">
          <div className="flex items-center justify-start gap-x-6">
            <h2 className="text-[28px]	font-black text-dark-700">
              {Intro_SH2[0].title}
            </h2>
            <div
              className="hidden text-base font-medium text-dark-500 lg:block"
              dangerouslySetInnerHTML={{ __html: Intro_SH2[0].description }}
            />
          </div>
          <Button className="border-none bg-primary-500 ">
            <Link href={Intro_SH2[0].ctaUrl ?? '/'}>{Intro_SH2[0].cta}</Link>
          </Button>
        </div>
        <div className="mt-12 mb-40 lg:my-0">
          <div
            ref={targetRef}
            className={clsx(
              'flex items-center lg:overflow-x-auto lg:h-[510px] justify-start',
              isDesktop ? 'flex-row' : 'flex-col',
            )}
          >
            {mapStatusBarData(
              Roadmap_TL.slice(Roadmap_TL.length - 7, Roadmap_TL.length),
            ).map((item, index: number) =>
              isDesktop ? (
                <StatusBlock
                  onMouseEnter={() => {
                    setActive(index);
                  }}
                  currentItem={active}
                  item={index}
                  key={item.title}
                  lastUpdate={Roadmap_TL_LT.title}
                  {...item}
                  firstItem={index === 0}
                  lastItem={StatusBarData.length - 1 == index}
                  active={index === active}
                />
              ) : (
                <ResponsiveStatusBlock
                  key={item.title}
                  {...item}
                  firstItem={index === 0}
                  lastUpdate={Roadmap_TL_LT.title}
                  lastItem={StatusBarData.length - 1 == index}
                  active={index + 1 <= +visibleId?.slice(-1)}
                  section={index + 1}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastUpdates;

function mapStatusBarData(
  timeline: ApplicationContentResponse['data']['attributes']['Roadmap_TL'],
) {
  return timeline.map(({ date, description, title }, index) =>
    index % 2 === 0
      ? {
          date,
          title,
          variant: 'gray' as StatusVariant,
          description,
          direction: 'to-top',
          update: {
            title,
            description,
            updatedAt: date,
          },
          cardClassName: 'bg-transparent',
        }
      : {
          date,
          title,
          variant: 'gray' as StatusVariant,
          description,
          direction: 'to-bottom',
          update: {
            title,
            description,
            updatedAt: date,
          },
          cardClassName: 'bg-transparent',
        },
  );
}

const StatusBarData: IStatusItem[] = [
  {
    date: 'sampleDate',
    title: 'enableInternatNotifs',
    variant: 'gray',
    description: 'enableInternatNotifsDesc',
    direction: 'to-top',
    update: {
      title: application.enableInternalNotif,
      description: application.addedInternalNotifSupport,
      updatedAt: application.udatedAt,
    },
    cardClassName: 'bg-transparent',
  },
  {
    date: 'sampleDate',
    title: 'securityUpdateArzinjaApplication',
    variant: 'gray',
    description: 'securityUpdateArzinjaApplicationDesc',
    direction: 'to-bottom',
    update: {
      title: application.enableInternalNotif,
      description: application.addedInternalNotifSupport,
      updatedAt: application.udatedAt,
    },
    cardClassName: 'bg-transparent',
  },
  {
    date: 'sampleDate',
    title: 'enableInternatNotifs',
    variant: 'gray',
    description: 'enableInternatNotifsDesc',
    direction: 'to-top',
    update: {
      title: application.enableInternalNotif,
      description: application.addedInternalNotifSupport,
      updatedAt: application.udatedAt,
    },
    cardClassName: 'bg-transparent',
  },
  {
    date: 'sampleDate',
    title: 'securityUpdateArzinjaApplication',
    variant: 'gray',
    description: 'securityUpdateArzinjaApplicationDesc',
    direction: 'to-bottom',
    update: {
      title: application.enableInternalNotif,
      description: application.addedInternalNotifSupport,
      updatedAt: application.udatedAt,
    },
    cardClassName: 'bg-transparent',
  },
  {
    date: 'sampleDate',
    title: 'enableInternatNotifs',
    variant: 'gray',
    description: 'enableInternatNotifsDesc',
    direction: 'to-top',
    update: {
      title: application.enableInternalNotif,
      description: application.addedInternalNotifSupport,
      updatedAt: application.udatedAt,
    },
    cardClassName: 'bg-transparent',
  },
  {
    date: 'sampleDate',
    title: 'securityUpdateArzinjaApplication',
    variant: 'gray',
    description: 'securityUpdateArzinjaApplicationDesc',
    direction: 'to-bottom',
    update: {
      title: application.enableInternalNotif,
      description: application.addedInternalNotifSupport,
      updatedAt: application.udatedAt,
    },
    cardClassName: 'bg-transparent',
  },
  {
    date: 'sampleDate',
    title: 'enableInternatNotifs',
    variant: 'gray',
    description: 'enableInternatNotifsDesc',
    direction: 'to-top',
    update: {
      title: application.enableInternalNotif,
      description: application.addedInternalNotifSupport,
      updatedAt: application.udatedAt,
    },
    cardClassName: 'bg-transparent',
  },
  {
    date: 'sampleDate',
    title: 'securityUpdateArzinjaApplication',
    variant: 'gray',
    description: 'securityUpdateArzinjaApplicationDesc',
    direction: 'to-bottom',
  },
];
