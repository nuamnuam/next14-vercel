import React from 'react';
import Link from 'next/link';
import AuthBg from '@/assets/images/AuthBackground.svg';

import { useJobVacanciesPageContent } from '@/requests/job-vacancies';
import { Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';
import { useBreakpoint } from '@/hooks';

import WhyArzinja from './components/whyArzinja';
import Opportunities from './components/opportunities';

const JobVacanciesPage = () => {
  const { data: jobVacanciesPage, isLoading } = useJobVacanciesPageContent();
  const { isDesktop } = useBreakpoint();

  if (!jobVacanciesPage?.data || isLoading)
    return (
      <div className="mt-8 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const jobVacanciesPageData = jobVacanciesPage.data.attributes;

  return (
    <div>
      <div className="py-4 lg:p-0">
        <div
          className="container flex justify-between items-center bg-top lg:bg-inherit"
          style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
        >
          <div className="w-full pt-10 md:pt-20 lg:w-[48%]">
            {jobVacanciesPageData.Slider_TSH.title ? (
              <span className="block text-xl md:text-sm md:font-bold font-black mb-8 text-dark-700 text-right">
                {jobVacanciesPageData.Slider_TSH.title}
              </span>
            ) : null}
            {jobVacanciesPageData.Slider_SH.title ? (
              <h1 className="text-[28px] font-black leading-10 text-dark-700 text-right">
                {jobVacanciesPageData.Slider_SH.title}
              </h1>
            ) : null}

            {jobVacanciesPageData.Slider_SH.description ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: jobVacanciesPageData.Slider_SH.description,
                }}
                className="mt-4 w-full font-medium text-sm leading-6 text-dark-500 md:max-w-[504px]"
              />
            ) : null}

            <div className="mt-10">
              {jobVacanciesPageData.Values_T.title ? (
                <span className="block text-base font-bold text-dark-700 text-right">
                  {jobVacanciesPageData.Values_T.title}
                </span>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-y-4 sm:gap-y-8 lg:gap-y-10 gap-x-2">
                {jobVacanciesPageData.Values_IC.map((item) => (
                  <div className="flex items-center gap-6">
                    <img
                      src={`${assetsUrl(item.media.data.attributes.url)}`}
                      alt="media"
                      width={64}
                      height={64}
                    />
                    <div>
                      <span className="font-bold text-dark-700 text-xl mb-2 block">
                        {item.title}
                      </span>
                      <p
                        className="text-xs text-dark-500 font-medium"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 hidden items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-0 md:flex w-full lg:w-[59%]">
            <div className="lg:block">
              {jobVacanciesPageData.Slider_SH.media.data.attributes.url ? (
                <img
                  src={assetsUrl(
                    jobVacanciesPageData.Slider_SH.media.data.attributes.url,
                  )}
                  alt={
                    jobVacanciesPageData.Slider_SH.media.data.attributes
                      .alternativeText
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="my-8 border-b-2 border-b-dark-100 block md:my-14" />
      <div className="container">
        <WhyArzinja />
      </div>
      <div className="my-8 border-b-2 border-b-dark-100 block md:my-14" />
      <div className="container">
        <Opportunities />
      </div>

      <div className="container">
        <div className="flex flex-col items-center justify-start">
          <div className="mb-4 h-1 w-[35px] rounded-md bg-primary-600"></div>
          {jobVacanciesPageData.SocialMedia_SH.title ? (
            <h2 className="text-center md:text-right text-2xl md:text-[28px] font-black text-dark-700">
              {jobVacanciesPageData.SocialMedia_SH.title}
            </h2>
          ) : null}

          {jobVacanciesPageData.SocialMedia_SH.description ? (
            <h3
              className="mt-4 text-center md:text-right font-medium text-sm text-dark-500"
              dangerouslySetInnerHTML={{
                __html: jobVacanciesPageData.SocialMedia_SH.description,
              }}
            />
          ) : null}
          <div className="flex items-center gap-x-4 mt-4">
            {jobVacanciesPageData.SocialMedia_Icon.map((item) => (
              <Link href={item.link} target="_blank" rel="noreferrer">
                <img
                  src={assetsUrl(item.icon.data.attributes.url)}
                  alt={item.icon.data.attributes.alternativeText}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobVacanciesPage;
