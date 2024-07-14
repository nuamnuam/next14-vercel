import { useRouter } from 'next/router';

import {
  HelpCatsContentResponse,
  useHelpCatsContent,
} from '@/requests/help/cats';
import { type MenuItemType } from './menuItems';
import { ROUTES } from '@/constants/routes';
import { Icon, Spinner } from '@/components/Common';
import { assetsUrl, getLang } from '@/utils';
import { useLang } from '@/hooks';

import MenuItem from './MenuItem';

const RightMenu = () => {
  const [global] = useLang(['global']);

  const { query } = useRouter();

  const isActive = (item: MenuItemType) => {
    if (!query.main) return false;
    return query.main === item.name;
  };

  const { data: helpCategories, isLoading } = useHelpCatsContent();

  const isAccordionActive = (item: MenuItemType) => {
    if (!query.main || item.children == null) return false;

    const childrenNames = item.children.map((i) => i.name);

    return childrenNames.includes(String(query.main));
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-10">
        <Spinner />
      </div>
    );

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-card">
      <div style={{ width: '306px' }}>
        {!helpCategories?.data || helpCategories.data.length <= 0 ? (
          <div>
            <span className="text-dark-500 py-6 text-center">
              {global.emptyCategories}
            </span>
          </div>
        ) : (
          mapHelpCategories(helpCategories.data).map((item) => {
            return (
              <MenuItem
                key={item.href}
                title={item.title}
                href={item.href}
                name={item.name}
                generateIcon={item.generateIcon}
                isActive={isActive(item)}
                isAccordionActive={isAccordionActive(item)}
                activeFilter={String(query.main)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default RightMenu;

const [announcement, faq, help] = getLang(['announcement', 'faq', 'help']);

export function mapHelpCategories(categories: HelpCatsContentResponse['data']) {
  categories
    .sort((a, b) => {
      const dateA = a.attributes.updatedAt.split('T')[0];
      const dateB = b.attributes.updatedAt.split('T')[0];

      return Date.parse(dateB) - Date.parse(dateA);
    })
    .sort((a, b) => a.attributes.priority - b.attributes.priority)
    .sort(
      (a, b) => Number(b.attributes.is_start) - Number(a.attributes.is_start),
    );

  const mappedDataCategories = categories.map(({ attributes, id }) => {
    const { title, icon, is_start } = attributes;
    const iconUrl = icon.data.attributes.url;

    if (is_start)
      return {
        title,
        name: String(attributes.slug),
        generateIcon: () => (
          <img src={assetsUrl(iconUrl)} className="w-5 h-5" alt="media" />
        ),
        href: ROUTES.help(String(attributes.slug)),
      };

    return {
      title: attributes.title,
      name: String(attributes.slug),
      generateIcon: () => (
        <img src={assetsUrl(iconUrl)} className="w-5 h-5" alt="media" />
      ),
      href: ROUTES.help(String(attributes.slug)),
    };
  });

  const latestHelp = {
    title: help.latestHelps,
    href: ROUTES.help(String('latest-help')),
    name: 'latest-help',
    generateIcon: (isActive = false) => (
      <Icon icon="Article-TwoTone" className="[&>*]:fill-dark-200" size={20} />
    ),
  };

  const faqTabData = {
    title: faq.faqsTabAnnouncement,
    href: '/faqs',
    name: 'faq',
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionList-TwoTone"
        className="[&>*]:fill-blue-500"
        size={20}
      />
    ),
  };

  const announcementTabData = {
    title: announcement.arzinjaAnnouncements,
    href: '/announcement',
    name: 'announcement',
    generateIcon: (isActive = false) => (
      <Icon
        icon="Announcement-TwoTone"
        className="[&>*]:fill-danger-600"
        size={20}
      />
    ),
  };

  return [
    { ...latestHelp },
    ...mappedDataCategories,
    { ...faqTabData },
    { ...announcementTabData },
  ];
}
