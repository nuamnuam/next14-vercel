import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { useContactUsContent } from '@/requests/contact-us';
import { Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';
import { useFooter } from '@/requests/home/footer';

const Guide = () => {
  const { data: contactUsContent, isLoading } = useContactUsContent();
  const { data: footer } = useFooter();

  if (!footer || isLoading || !contactUsContent)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { SocialMedia_Title } = footer.data.attributes;

  if (!contactUsContent?.data || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const {
    ContactDetails_Ic,
    ContactDetails_SH,
    ContactDetails_Title,
    ContactDetails_des,
    SocialMedia_Icon,
  } = contactUsContent.data.attributes;

  return (
    <div className="h-full rounded-lg bg-white md:mt-0">
      <div className="p-6 lg:p-8">
        <h2 className="mb-4 text-xl font-bold text-dark-700">
          {ContactDetails_SH.title}
        </h2>
        <div
          className="text-sm font-medium leading-6 text-dark-500	"
          dangerouslySetInnerHTML={{ __html: ContactDetails_SH.description }}
        />

        <div className="mt-10 gap-y-4 grid sm:grid-cols-2 sm:gap-x-4 md:gap-x-6">
          {ContactDetails_Ic.map(({ description, icon, id, link }, index) => (
            <div className="gap-4 gap-y-3 rounded-lg">
              <Link
                key={id}
                href={link}
                className={classNames(
                  'flex text-sm transition-all font-bold gap-4 items-center text-dark-700 justify-start rounded-lg p-4 lg:p-4 border border-dark-100',
                )}
              >
                <img
                  src={assetsUrl(icon.data.attributes.url)}
                  className="w-8 h-8"
                  alt="media"
                />
                {description}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 mb-2 h-px md:h-6 w-full  bg-dark-lightest border-t border-dark-50" />
      <div className="p-6 lg:p-8 pb-3">
        <h2 className="mb-5 text-xl font-bold text-dark-700">
          {ContactDetails_Title[0].title}:
        </h2>
        {ContactDetails_des.map(({ id, media, title }) => (
          <div
            key={id}
            className="mb-4 flex items-center justify-start gap-x-4"
          >
            <img
              src={assetsUrl(media.data[0].attributes.url)}
              alt="media"
              className="w-6 h-6"
            />
            <h3 className="max-w-[386px] text-sm font-medium leading-6 text-dark-500">
              {title}
            </h3>
          </div>
        ))}
      </div>

      <div className="mt-3 mb-2 h-px md:h-6 w-full  bg-dark-lightest border-t border-dark-50" />

      <div className="container p-6 justify-between lg:p-8 flex sm:flex-row flex-col gap-4">
        <span className="ml-3 font-medium text-dark-700 text-sm">
          {SocialMedia_Title[0].title}
        </span>

        <div className="mb-[18px] flex gap-x-4 items-center lg:order-3 lg:mb-0">
          {SocialMedia_Icon.map((socialMedia) => (
            <Link
              href={socialMedia.link}
              target="_blank"
              className="group"
              rel="noreferrer"
            >
              <img
                src={`${assetsUrl(socialMedia.icon.data.attributes.url)}`}
                className="object-contain w-5 h-5"
                alt="media"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Guide;
