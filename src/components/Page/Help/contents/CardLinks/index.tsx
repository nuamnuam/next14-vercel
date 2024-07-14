import React from 'react';
import {
  HelpCatsContentResponse,
  useHelpCatsContent,
} from '@/requests/help/cats';
import {
  AnnouncementsContentResponse,
  useAnnouncementsContent,
} from '@/requests/announcements';
import { FaqsContentResponse, useFaqsContentWHID } from '@/requests/faqs';

import { ParagraphBox, Spinner } from '@/components/Common';
import CardLink, {
  CardVariant,
} from '@/components/Page/Help/contents/CardLinks/CardLink';
import { useBreakpoint, useLang } from '@/hooks';
import { getLang, toPersianDigits } from '@/utils';

const [announcement, faq, global, help] = getLang([
  'announcement',
  'faq',
  'global',
  'help',
]);

const CardLinks = () => {
  const [help] = useLang(['help']);
  const { isMobile } = useBreakpoint();
  const { data: helpCats, isLoading } = useHelpCatsContent();
  const { data: faqs } = useFaqsContentWHID();
  const { data: announcements } = useAnnouncementsContent();

  if (!helpCats?.data || isLoading || !announcements?.data || !faqs?.data)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isMobile)
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow-card">
        <ParagraphBox
          height={200}
          showMoreLabel={help.seeMoreItems}
          allowCollapse={false}
          showLessMoreClassnames="bottom-5"
          showEffect={false}
          content={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {mapHelpCategories(
                helpCats.data,
                announcements.data,
                faqs.data,
              ).map((item, index) => (
                <CardLink key={index} {...item} />
              ))}
            </div>
          }
        />
      </div>
    );

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-white shadow-card sm:grid-cols-2 lg:grid-cols-4">
      {mapHelpCategories(helpCats.data, announcements.data, faqs.data).map(
        (item, index) => (
          <></>
        ),
      )}
    </div>
  );
};

export default CardLinks;

function mapHelpCategories(
  categories: HelpCatsContentResponse['data'],
  announcements: AnnouncementsContentResponse['data'],
  faqs: FaqsContentResponse['data'],
) {
  categories.sort((a, b) => a.attributes.priority - b.attributes.priority);

  const mappedCategories = categories.map(({ attributes }) => {
    const { helps, title, icon, is_start } = attributes;
    const helpsLength = toPersianDigits(helps.data.length);
    const iconUrl = icon.data.attributes.url;

    if (is_start)
      return {
        title,
        description: `${helpsLength} ${global.solutionsForStart}`,
        image: iconUrl,
        is_start,
        href: `/help/${attributes.slug}`,
        variant: 'primary' as CardVariant,
      };

    return {
      title,
      description: `${helpsLength} ${help.articles}`,
      image: iconUrl,
      is_start,
      href: `/help/${attributes.slug}`,
      variant: 'normal' as CardVariant,
    };
  });

  const faqTabData = {
    title: faq.faqsTabAnnouncement,
    description: `${toPersianDigits(faqs.length)} ${help.questions}`,
    icon: 'QuestionList-TwoTone',
    href: '/faqs',
    is_start: false,
    variant: 'info' as CardVariant,
  };

  const announcementTabData = {
    title: announcement.arzinjaAnnouncements,
    description: `${toPersianDigits(announcements.length)} ${
      help.annoucements
    }`,
    is_start: false,
    icon: 'Announcement-TwoTone',
    href: '/announcement',
    variant: 'danger' as CardVariant,
  };

  const allCategories = [
    { ...faqTabData },
    { ...announcementTabData },
    ...mappedCategories,
  ];

  allCategories.sort((a, b) => Number(b.is_start) - Number(a.is_start));

  return allCategories;
}
