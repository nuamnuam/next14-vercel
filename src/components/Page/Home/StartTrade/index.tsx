import React, { FC } from 'react';
import Link from 'next/link';

import { Button, Spinner } from '@/components/Common';
import { useLandingContent } from '@/requests/home/home';

import type { HomeProps } from '../types';

const StartTrade: FC<HomeProps> = ({ data }) => {
  const { data: startTrade } = useLandingContent(!data);

  const pageData = data || startTrade?.data.attributes;

  if (!pageData)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );
  const { cta, ctaUrl, description, title } = pageData.Start2Trade;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="hidden h-1 w-8 rounded-lg bg-primary-600 lg:block" />
      <h2 className="my-4 text-2xl font-bold text-dark-700 md:text-[28px]">
        {title}
      </h2>
      <p
        dangerouslySetInnerHTML={{ __html: description }}
        className="font-sm mt-0 mb-4 font-medium text-dark-500 md:px-0 px-4"
      />
      <Button size="lg">
        <Link href={ctaUrl}>{cta}</Link>
      </Button>
    </div>
  );
};

export default StartTrade;
