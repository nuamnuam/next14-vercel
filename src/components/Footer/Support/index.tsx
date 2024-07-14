import Link from 'next/link';
import React, { FC } from 'react';

import { Button, Icon, Spinner } from '@/components/Common';
import { FooterProps } from '@/components/Layout/Landing';
import { useFooter } from '@/requests/home/footer';

const Support: FC<FooterProps> = ({ footer_data, isLoading }) => {
  const { data: footer, isLoading: isFooterLoading } = useFooter(!footer_data);

  const data = footer_data || footer?.data.attributes;
  const isComponentLoading = isLoading || isFooterLoading;

  if (!data || isComponentLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );
  const { Support_CTA, Support_CTA2 } = data;

  return (
    <div className="flex flex-col items-center justify-between rounded-lg bg-dark-700 p-8 text-center lg:flex-row lg:p-6 lg:text-right">
      <div className="flex items-center">
        <div className="flex-center ml-6 hidden rounded-lg bg-dark-600 p-4 lg:block">
          <Icon
            icon="Message-TwoTone"
            size={32}
            className="[&>*]:fill-dark-50"
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2 text-sm font-medium text-dark-300">
            {Support_CTA.title}
          </span>
          <span
            className="text-xl font-bold text-dark-50 lg:text-lg"
            dangerouslySetInnerHTML={{ __html: Support_CTA.description }}
          />
        </div>
      </div>
      <div className="mt-6 flex w-full items-center lg:mr-auto lg:mt-0 lg:w-fit flex-wrap gap-4 sm:flex-nowrap">
        <Button variant="secondary" className="flex-1 bg-white" size="lg">
          <Link href={Support_CTA2.ctaUrl ?? ''}>{Support_CTA2.cta}</Link>
        </Button>
        <Button size="lg" className="flex-1">
          <Link href={Support_CTA.ctaUrl ?? ''}>{Support_CTA.cta}</Link>
        </Button>
      </div>
    </div>
  );
};

export default Support;
