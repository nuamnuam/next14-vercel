import React from 'react';
import clsx from 'classnames';
import {
  ReferralContentResponse,
  useReferralContent,
} from '@/requests/referral';

import { Card, Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';

const Features = () => {
  const { data: referralContent, isLoading } = useReferralContent();

  if (!referralContent || isLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const { UpCB_SH, UpCB_IconCard } = referralContent.data.attributes;

  return (
    <div>
      <h2 className="font-black text-center md:text-right text-dark-700 text-2xl  md:text-[29px]">
        {UpCB_SH.title}
      </h2>
      <div
        className="mt-4 mb-11 text-sm text-center md:text-right font-medium text-dark-500"
        dangerouslySetInnerHTML={{ __html: UpCB_SH.description }}
      />

      <div className="block sm:grid md:grid-cols-2 lg:grid-cols-4 justify-between gap-y-6 gap-x-1 md:gap-x-9">
        {mapFeatures(UpCB_IconCard)?.map(
          ({ icon, title, titleClassName, description, bgColor }) => (
            <Card
              key={title}
              classNames={clsx(
                'shadow-card py-6 px-4 flex gap-x-1 md:unset w-full mb-6 md:mb-0',
                bgColor,
              )}
            >
              <div className="flex w-12 items-center justify-center">
                <img
                  src={assetsUrl(icon)}
                  alt={title}
                  className="w-full h-12 rounded-full"
                />
              </div>
              <div className="mr-3 flex-1">
                <p className={titleClassName}>{title}</p>
                <p
                  className="mt-2 text-sm font-medium text-dark-500"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </Card>
          ),
        )}
      </div>
    </div>
  );
};

export default Features;

function mapFeatures(
  features: ReferralContentResponse['data']['attributes']['UpCB_IconCard'],
) {
  return features.map(({ description, id, media, title }, index) => {
    return index % 2 === 0
      ? {
          title,
          description,
          icon: media.data.attributes.url,
          bgColor: '!bg-dark-700',
          titleClassName: 'text-lg w-fit text-white font-bold',
          iconClassName: '[&>*]:fill-dark-100',
        }
      : {
          title,
          description,
          icon: media.data.attributes.url,
          bgColor: 'bg-white',
          titleClassName: 'text-lg	!text-dark-700 font-bold',
          iconClassName: '[&>*]:fill-dark-200',
        };
  });
}
