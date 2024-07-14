import React from 'react';
import clsx from 'classnames';

import { Button } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import { getLang } from '@/utils';

import { StatusBlock, ResponsiveStatusBar } from '../components';

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

const LastUpdates: React.FC = () => {
  const [application] = useLang(['application']);

  const { isDesktop } = useBreakpoint();

  return (
    <div className="">
      <div className="mt-24 flex items-center justify-between">
        <div className="flex items-center justify-start gap-x-6">
          <h2 className=" text-[28px]	font-black text-dark-700">
            {application.alwaysUpdate}
          </h2>
          <p className="hidden text-base font-medium text-dark-500 md:block">
            {application.currentPriceDescription}
          </p>
        </div>
        <Button className="border-none bg-primary-500 ">
          {application.seeAllUpdates}
        </Button>
      </div>
      <div className="my-12 md:my-40">
        <div
          className={clsx(
            'flex items-center justify-start',
            isDesktop ? 'flex-row' : 'flex-col',
          )}
        >
          {StatusBarData?.map((item, index: number) =>
            isDesktop ? (
              <StatusBlock
                key={item.title}
                {...item}
                lastUpdate=""
                firstItem={index === 0}
                lastItem={StatusBarData.length - 1 == index}
              />
            ) : (
              <ResponsiveStatusBar
                key={item.title}
                {...item}
                lastItem={StatusBarData.length - 1 == index}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default LastUpdates;

const StatusBarData: IStatusItem[] = [
  {
    date: 'sampleDate',
    title: 'enableInternatNotifs',
    variant: 'green',
    description: 'enableInternatNotifsDesc',
    direction: 'to-top',
    update: {
      title: application.enableInternalNotif,
      description: application.addedInternalNotifSupport,
      updatedAt: application.udatedAt,
    },
    cardClassName: 'shadow-card',
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
