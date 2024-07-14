import React from 'react';
import { Card, Spinner } from '@/components/Common';
import clsx from 'classnames';
import {
  ApplicationContentResponse,
  useApplicationContent,
} from '@/requests/application';
import { assetsUrl } from '@/utils';
import { useLang } from '@/hooks';

const Features = () => {
  const { data: applicationContent, isLoading } = useApplicationContent();

  if (!applicationContent || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { Intro_IC_Fac } = applicationContent.data.attributes;

  return (
    <div className="flex flex-wrap items-center justify-between bg-no-repeat bg-top gap-y-6 gap-x-1 lg:flex-nowrap lg:bg-inherit lg:gap-x-9">
      {mapApplicationFeatures(Intro_IC_Fac)?.map(
        ({ icon, title, titleClassName, description, bgColor }) => (
          <Card
            key={title}
            classNames={clsx(
              'shadow-card p-6 flex items-start gap-x-4 w-[48%] lg:unset',
              bgColor,
            )}
          >
            {icon ? <img src={`${assetsUrl(icon)}`} alt="media" /> : null}
            <div>
              <p className={titleClassName}>{title}</p>
              <div
                className="mt-4 text-sm font-medium text-dark-500"
                dangerouslySetInnerHTML={{ __html: description ?? '' }}
              />
            </div>
          </Card>
        ),
      )}
    </div>
  );
};

export default Features;

function mapApplicationFeatures(
  features: ApplicationContentResponse['data']['attributes']['Intro_IC_Fac'],
) {
  const [application] = useLang(['application']);

  return features.map(({ description, id, media, title }, index) =>
    index % 2 === 0
      ? {
          title,
          description,
          icon: media.data.attributes.url,
          bgColor: '!bg-dark-700',
          titleClassName: 'text-xl text-white font-bold',
          update: {
            title: application.enableInternalNotif,
            description: application.addedInternalNotifSupport,
            updatedAt: application.udatedAt,
          },
        }
      : {
          title,
          description,
          icon: media.data.attributes.url,
          bgColor: 'bg-white',
          titleClassName: 'text-xl	text-dark-700 font-bold',
        },
  );
}
