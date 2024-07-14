import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { Chip, Icon } from '@/components/Common';
import { createSlug } from '@/utils';
import { useHelpStore } from '@/store';
import { HelpContent } from '@/store/useHelpStore';
import { useLang } from '@/hooks';

interface Props extends HelpContent {
  id: string | number;
  hasVideo?: boolean;
}

const AccordionItem: React.FC<Props> = ({
  id,
  title,
  hasVideo,
  media,
  description,
}) => {
  const [help] = useLang(['help']);

  const router = useRouter();
  const { setHelpDetails } = useHelpStore();

  const generatedLink = useMemo(() => {
    return `/help/${router.query.main}/${createSlug(title)}/${id}`;
  }, [id]);

  return (
    <button
      className="w-full"
      onClick={() => {
        setHelpDetails({ title, media, description });
        router.push(generatedLink);
      }}
    >
      <span className="flex items-center justify-between border-b border-dark-50 p-4 transition-all duration-300 hover:bg-dark-50">
        <div className="flex items-center gap-4">
          <Icon icon="Note-OutLined" size={16} className="text-dark-200" />
          <span className="text-sm font-medium leading-5 text-dark-600">
            {title}
          </span>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          {hasVideo && (
            <Chip
              label={help.videoContent}
              variant="info"
              icon={
                <Icon
                  icon="QuestionCircle-OutLined"
                  size={16}
                  className="text-blue-500"
                />
              }
            />
          )}
          <Icon
            icon="VideoCamera-OutLined"
            size={12}
            className="!hidden text-dark-200 lg:!block"
          />
        </div>
      </span>
    </button>
  );
};

export default AccordionItem;
