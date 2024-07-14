import React from 'react';
import {
  AnnouncementContentResponse,
  FaqContentResponse,
  HelpContentResponse,
  useAnnouncementContent,
  useFaqContent,
  useHelpContent,
} from '@/requests/help';

import LastBox from './LastBox';
import { Spinner } from '@/components/Common';
import { useLang } from '@/hooks';

const LastBoxes = () => {
  const [help] = useLang(['help']);

  const { data: helps, isLoading } = useHelpContent({ page: 1, pageSize: 5 });
  const { data: faqs } = useFaqContent();
  const { data: announcements } = useAnnouncementContent();

  if (!helps?.data || isLoading || !announcements?.data || !faqs?.data)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="mb-4 flex flex-col gap-12 lg:-mb-20 lg:flex-row lg:gap-6">
      <LastBox
        title={help.latestAnnouncements}
        items={mapAnnouncements(announcements.data)}
        icon="Announcement-TwoTone"
        variant="danger"
        showMoreHref="/announcement"
      />
      <LastBox
        title={help.latestFaqs}
        items={mapFaqs(faqs.data)}
        icon="QuestionList-TwoTone"
        variant="info"
        showMoreHref="/faqs"
      />
      <LastBox
        title={help.latestHelps}
        items={mapHelps(helps.data)}
        icon="Article-TwoTone"
        variant="warning"
        showMoreHref="/help/latest-help"
      />
    </div>
  );
};

export default LastBoxes;

function mapFaqs(faqs: FaqContentResponse['data']) {
  return faqs.slice(0, 5).map(({ attributes, id }) => ({
    label: attributes.question.trimEnd().trimStart(),
    href: `/faqs?question=${id}`,
  }));
}

function mapAnnouncements(announcements: AnnouncementContentResponse['data']) {
  return announcements.slice(0, 5).map(({ attributes }) => ({
    label: attributes.title.trimEnd().trimStart(),
    href: `/announcement/${attributes?.announcement_cats?.data?.[0]?.attributes?.slug}/${attributes?.slug}`,
  }));
}

function mapHelps(helps: HelpContentResponse['data']) {
  return helps.slice(0, 5).map(({ attributes }) => ({
    label: attributes.title.trimEnd().trimStart(),
    media: attributes.media,
    description: attributes.description,
    href: `/help/latest-help/${attributes.slug}`,
  }));
}
