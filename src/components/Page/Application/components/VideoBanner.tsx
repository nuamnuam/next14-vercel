import React from 'react';
import { Button, Card, VideoPlayer, Spinner } from '@/components/Common';
import VideoIcon from '@/assets/images/Application/VideoIcon.svg';
import Image from 'next/image';
import { useApplicationContent } from '@/requests/application';
import Link from 'next/link';
import { assetsUrl } from '@/utils';
import { useLang } from '@/hooks';

const VideoBanner = () => {
  const [application] = useLang(['application']);

  const { data: applicationContent, isLoading } = useApplicationContent();

  if (!applicationContent || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { Intro_VB_Video, Intro_VB, Intro_SH, Intro_IC_Features } =
    applicationContent.data.attributes;

  return (
    <div className="flex flex-col justify-between bg-top py-0 lg:flex-row lg:bg-inherit">
      <div className="py-0 sm:py-10 ">
        <div className="flex w-full flex-col items-start">
          <h2 className="mt-[.35rem] w-full text-center text-[28px] text-dark-700 font-black sm:text-right sm:font-black">
            {Intro_SH.title}
          </h2>
          <div
            className="mt-4 lg:max-w-[526px] text-sm font-medium leading-6 text-dark-500"
            dangerouslySetInnerHTML={{ __html: Intro_SH.description }}
          />
          <div className="mt-8 flex w-full flex-wrap justify-between gap-y-8">
            {Intro_IC_Features.map(({ title, description, id, media }) => (
              <div
                key={id}
                className="flex w-5/12 items-center justify-start gap-x-4"
              >
                <span className="!rounded-[8px] w-[40px]">
                  <img
                    src={assetsUrl(media.data.attributes.url)}
                    className="w-full"
                    alt="media"
                  />
                </span>
                <div>
                  <span
                    dir="ltr"
                    className="text-[28px] font-bold leading-10 text-dark-700	"
                  >
                    {title}
                  </span>
                  <p
                    className="text-base font-medium text-dark-500"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 hidden w-full items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-0 sm:flex lg:w-fit ">
        <div className="w-full lg:block">
          <Card classNames="shadow-card w-full lg:w-[624px]">
            <div className="p-4">
              {Intro_VB_Video.media.data[0].attributes.url ? (
                <div className="h-full w-full overflow-hidden !rounded-lg">
                  <VideoPlayer
                    src={`${process.env.NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL}${Intro_VB_Video.media.data[0].attributes.url}`}
                  />
                </div>
              ) : (
                <div className="flex w-full flex-col items-center justify-center rounded-lg bg-dark-100">
                  <Image src={VideoIcon} alt="arzinja-video" />
                  <p className="mt-4 text-xl font-medium text-dark-500">
                    {application.noVideo}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex items-center justify-between gap-x-4 border-t-[1px] border-t-dark-100 p-4">
              <div className="flex items-center justify-center gap-x-4">
                <span className="flex items-center justify-center rounded-full bg-primary-100 p-[5px]">
                  <span className="flex items-center justify-center rounded-full bg-primary-600 p-[5px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.33333 10.5732V4.01074C9.33333 3.40667 8.81076 2.91699 8.16667 2.91699H1.16667C0.522326 2.91699 0 3.40667 0 4.01074V10.5732C0 11.1773 0.522326 11.667 1.16667 11.667H8.16667C8.81101 11.667 9.33333 11.1773 9.33333 10.5732ZM14 10.3361V4.24699C14 3.64496 13.2573 3.29013 12.7137 3.63642L9.91667 5.42737V9.15812L12.714 10.9474C13.2556 11.2935 14 10.9405 14 10.3361Z"
                        fill="#E6FCF5"
                      />
                    </svg>
                  </span>
                </span>
                <p className="text-base font-bold text-dark-700">
                  {Intro_VB.title}
                </p>
              </div>
              <Button
                variant="secondary"
                className="rounded-md border-[1px] border-dark-200"
              >
                <Link href={Intro_VB.ctaUrl ?? '/'}>{Intro_VB.cta}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoBanner;
