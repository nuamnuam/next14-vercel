import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HelpContentResponse } from '@/requests/help';

import { Chip, Icon } from '@/components/Common';
import { HelpContent } from '@/store/useHelpStore';
import { useLang } from '@/hooks';

interface Props extends HelpContent {
  id: string | number;
  title: string;
  hasVideo?: boolean;
  categories: HelpContentResponse['data'][number]['attributes']['help_categories'];
  slug: string;
}

const ListItem: React.FC<Props> = ({
  id,
  title,
  hasVideo,
  categories,
  slug,
}) => {
  const [global] = useLang(['global']);

  const router = useRouter();

  const generatedLink = useMemo(() => {
    return `/help/${categories?.data?.[0]?.attributes?.slug}/${slug}`;
  }, [id]);

  return (
    <Link href={generatedLink} className="w-full">
      <div className="flex items-center justify-between border-b border-dark-50 p-4 transition-all duration-300 hover:bg-dark-50">
        <div className="flex items-center gap-4">
          <Icon icon="Note-OutLined" size={16} className="text-dark-200" />
          <span
            className="text-sm text-right font-medium leading-5 text-dark-600"
            dangerouslySetInnerHTML={{ __html: title.trimStart().trimEnd() }}
          />
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          {router.query.main === 'latest-help'
            ? categories.data.map((item) => (
                <Chip
                  variant="secondary"
                  label={item.attributes.title.trimStart().trimEnd()}
                />
              ))
            : null}
          {hasVideo && (
            <Chip
              label={global.video}
              variant="info"
              icon={
                <Icon
                  icon="VideoCamera-OutLined"
                  size={16}
                  className="text-blue-500"
                />
              }
            />
          )}
          <Icon
            icon="Left-OutLined"
            size={12}
            className="!hidden text-dark-200 lg:!block"
          />
        </div>
      </div>
    </Link>
  );
};

export default ListItem;
