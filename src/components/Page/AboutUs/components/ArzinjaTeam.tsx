import React from 'react';
import Link from 'next/link';

import { Button, Spinner } from '@/components/Common';
import { useGetAboutUs } from '@/requests/about-us/about-us';

const ArzinjaTeam = () => {
  const { data: aboutUs, isLoading } = useGetAboutUs();

  if (!aboutUs?.data || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { cta, ctaUrl, description, title } =
    aboutUs?.data?.attributes?.ArzinjaTeam_CB;

  return (
    <div className="m-auto flex w-full max-w-[637px] flex-col items-center justify-start rounded-lg bg-primary-600 p-4 sm:p-8">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p
        className="mt-4 text-center text-base font-normal leading-6 text-white"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      <Button
        className="mt-6 w-full lg:w-auto bg-white text-base text-dark-700"
        variant="text"
      >
        <Link href={ctaUrl || '#'}>{cta}</Link>
      </Button>
    </div>
  );
};

export default ArzinjaTeam;
