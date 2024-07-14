import React from 'react';
import { useRouter } from 'next/router';
import { useHelpDetailsContent } from '@/requests/help/details';

import mediaType, { MediaType } from '@/utils/mediaType';
import { Spinner, VideoPlayer } from '@/components/Common';
import { assetsUrl } from '@/utils';
import SingleItemLayout from './components/SingleItemLayout';

const HelpContentPage = () => {
  const { query } = useRouter();
  const { data: helpDetails, isLoading } = useHelpDetailsContent(
    query.id as string,
  );

  if (!helpDetails?.data || isLoading)
    return (
      <div className="flex mt-8 items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <SingleItemLayout>
      {helpDetails.data[0].attributes.media?.data
        ? helpDetails.data[0].attributes.media.data.map((item) => {
            const ext = item.attributes?.ext;
            const url = item.attributes?.url;
            const alternativeText = item.attributes?.alternativeText;

            return mediaType(ext as MediaType) === 'video' ? (
              <div className="w-full h-[442px] object-cover mb-6">
                <VideoPlayer
                  src={assetsUrl(url)}
                  classNames="object-cover rounded-lg"
                />
              </div>
            ) : (
              <img
                src={assetsUrl(url)}
                alt={alternativeText}
                className="mx-auto mb-8"
              />
            );
          })
        : null}
      {helpDetails.data[0].attributes?.description ? (
        <div
          className="text-sm font-medium leading-7 text-dark-500"
          dangerouslySetInnerHTML={{
            __html: helpDetails.data[0].attributes.description,
          }}
        />
      ) : null}
    </SingleItemLayout>
  );
};

export default HelpContentPage;
