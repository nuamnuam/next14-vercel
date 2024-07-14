import React, { FC } from 'react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

import { Button, Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';

import type { HomeProps } from '../types';
import { useLandingContent } from '@/requests/home/home';
import { useLang } from '@/hooks';

interface BannerItem {
  title: string;
  description: string;
  href: string;
  image: string;
  backgroundColor: string;
  btnTitle?: string;
}

const Banners: FC<HomeProps> = ({ data, isLoading }) => {
  const { data: banners, isLoading: isContentLoading } = useLandingContent(
    !data,
  );

  const pageData = data || banners?.data.attributes;
  const isComponentLoading = isLoading || isContentLoading;

  if (!pageData || isComponentLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  return (
    <div className="flex gap-4 overflow-x-scroll lg:overflow-visible pb-8 lg:gap-6 lg:pb-0">
      {pageData.Banner_CB.slice(0, 3).map((item) => (
        <BannerCard
          description={item.description}
          href={item.ctaUrl}
          image={item.media.data[0].attributes.url}
          title={item.title}
          backgroundColor={item.title2}
          key={item.id}
          btnTitle={item.cta}
        />
      ))}
    </div>
  );
};

const BannerCard = ({
  title,
  description,
  href,
  image,
  backgroundColor,
  btnTitle,
}: BannerItem) => {
  const [home] = useLang(['home']);

  return (
    <StyledCardWrraper
      className="flex h-[227px] w-[262px] just min-w-[262px] flex-col rounded-lg py-6 px-6 shadow-card lg:h-[140px] lg:w-1/3 lg:flex-row lg:py-5"
      style={{ backgroundColor }}
    >
      <div className="hidden lg:flex justify-between w-full">
        <div className="flex items-center w-full lg:w-auto lg:flex-row flex-col text-center lg:items-start lg:text-right">
          <img
            src={`${assetsUrl(image)}`}
            className="object-contain h-[100px] w-[100px]"
            alt="media"
          />

          <div className="flex flex-col lg:mr-6 justify-around h-full">
            <span className="mt-4 mb-2 text-xl font-bold text-dark-50 lg:mt-0 lg:text-xl">
              {title}
            </span>
            <span
              dangerouslySetInnerHTML={{ __html: description }}
              className="pl-4 text-sm text-dark-50"
            />
          </div>
        </div>

        {href ? (
          <div className="flex self-end">
            <Link
              href={href}
              target="_blank"
              className="hidden lg:block"
              rel="noreferrer"
            >
              <Button variant="secondary" size="sm" className="mr-auto">
                {btnTitle || home.catch}
              </Button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>

      <Link href={href} className="flex lg:hidden justify-between w-full">
        <div className="flex items-center w-full lg:w-auto lg:flex-row flex-col text-center lg:items-start lg:text-right">
          <img
            src={`${assetsUrl(image)}`}
            className="object-contain h-[100px] w-[100px]"
            alt="media"
          />

          <div className="flex flex-col lg:mr-6 justify-around h-full">
            <span className="mt-4 mb-2 text-xl font-bold text-dark-50 lg:mt-0 lg:text-xl">
              {title}
            </span>
            <span
              dangerouslySetInnerHTML={{ __html: description }}
              className="pl-4 text-sm text-dark-50"
            />
          </div>
        </div>

        {href ? (
          <div className="flex self-end">
            <Link
              href={href}
              target="_blank"
              className="hidden lg:block"
              rel="noreferrer"
            >
              <Button variant="secondary" size="sm" className="mr-auto">
                {btnTitle || home.catch}
              </Button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </Link>
    </StyledCardWrraper>
  );
};

const StyledCardWrraper = styled('div')(({ theme }) => ({
  '&.purple': {
    background:
      'linear-gradient(87.63deg, #8162D7 0%, rgba(94, 92, 200, 0.57) 100%)',

    '&:hover': {
      background:
        'linear-gradient(87.63deg, rgba(94, 92, 200, 0.57) 0%, #8162D7 100%)',
    },
  },

  '&.blue': {
    background:
      'linear-gradient(87.63deg, #2E7DA9 0%, rgba(61, 146, 194, 0.57) 100%)',

    '&:hover': {
      background:
        'linear-gradient(87.63deg, rgba(61, 146, 194, 0.57) 0%, #2E7DA9 100%)',
    },
  },

  '&.green': {
    background:
      'linear-gradient(87.63deg, #2EA982 0%, rgba(61, 194, 153, 0.57) 100%)',

    '&:hover': {
      background:
        'linear-gradient(87.63deg, rgba(61, 194, 153, 0.57) 0%, #2EA982 100%)',
    },
  },
}));

export default Banners;
