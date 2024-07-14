import React from 'react';
import Link from 'next/link';
import { useReferralContent } from '@/requests/referral';

import { Button, Spinner } from '@/components/Common';
import QuestionsMenu from './QuestionsMenu';

const StartEarningIncome = () => {
  const { data: referralContent, isLoading } = useReferralContent();

  if (!referralContent || isLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const {
    CallToAction: { cta, ctaUrl, description, title },
  } = referralContent.data.attributes;

  return (
    <div className="mt-[72px] flex flex-col items-center justify-start">
      <div className="mb-4 h-1 w-[35px] rounded-md bg-primary-600"></div>
      <h2 className="text-center md:text-right text-2xl md:text-[28px] font-black text-dark-700">
        {title}
      </h2>
      <h3
        className="mt-4 text-center md:text-right text-sm text-dark-500"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      <Button className="mt-4 " variant="primary">
        <Link href={ctaUrl}>{cta}</Link>
      </Button>
      <QuestionsMenu />
    </div>
  );
};

export default StartEarningIncome;
