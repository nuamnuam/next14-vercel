import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { useFooter } from '@/requests/home/footer';
import { assetsUrl } from '@/utils';
import { Spinner } from '@/components/Common';
import { FooterProps } from '@/components/Layout/Landing';

type IProps = {
  isShowSocialsTitle?: boolean;
  onlySocials?: boolean;
  className?: { wrapper?: string; container?: string; followUs?: string };
} & FooterProps;

const Copyright = ({
  onlySocials = false,
  className,
  isShowSocialsTitle = true,
  footer_data,
  isLoading,
}: IProps) => {
  const { data: footer, isLoading: isFooterLoading } = useFooter(!footer_data);
  const footerData = footer_data || footer?.data.attributes;
  const isComponentLoading = isLoading || isFooterLoading;

  if (isComponentLoading || !footerData)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { CopyRight_Text, SocialMedia_Title, SocialMedia_Icon } = footerData;

  return (
    <div
      className={classNames(
        'mt-8 border-t border-dark-100 py-6 lg:mt-14 lg:py-8 ',
        className?.wrapper,
      )}
    >
      <div className={classNames('container', className?.container)}>
        <div className="flex flex-col items-center justify-start text-center lg:flex-row lg:justify-between">
          {!onlySocials && (
            <span className="order-3 text-xs font-medium text-dark-700 lg:order-1 lg:ml-auto lg:text-sm">
              {CopyRight_Text.title}
            </span>
          )}
          {isShowSocialsTitle ? (
            <span
              className={classNames(
                'order-2 ml-3 font-medium text-dark-700 hidden lg:block text-sm',
                className?.followUs,
              )}
            >
              {SocialMedia_Title[0].title}
            </span>
          ) : null}

          <div className="order-1 mb-[18px] flex items-center justify-between lg:order-3 lg:mb-0">
            {SocialMedia_Icon.map((socialMedia: any) => (
              <Link
                href={socialMedia.link}
                target="_blank"
                className="group mr-4"
                rel="noreferrer"
              >
                <img
                  src={`${assetsUrl(socialMedia?.icon?.data?.attributes?.url)}`}
                  className="object-contain"
                  alt="social-media"
                  width={socialMedia?.icon?.data?.attributes?.width}
                  height={socialMedia?.icon?.data?.attributes?.height}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
