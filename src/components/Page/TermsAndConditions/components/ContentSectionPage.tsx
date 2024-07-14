import { useState } from 'react';
import clsx from 'classnames';

import { Spinner } from '@/components/Common';

import ArzinjaRulesContent from './ArzinjaRulesContent';
import { useTermsContent } from '@/requests/termsAndConditions';
import { assetsUrl } from '@/utils';

interface IData {
  label: string;
  value: string;
}

const ContentSectionPage = () => {
  const [activeTab, setActiveTab] = useState('arinjaRules');
  const { data: termsContent, isLoading } = useTermsContent();
  if (!termsContent?.data || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { BlogPost_Post } = termsContent.data.attributes;

  return (
    <section className="flex items-start justify-between rounded-md rounded-tr-md rounded-br-md bg-white ">
      <article className="flex flex-col lg:flex-row relative">
        <div className="hidden w-[264px] rounded-tr-md rounded-br-md lg:block sticky right-0 top-0 !h-[450px]">
          {BlogPost_Post.map((item, index) => (
            <div
              onClick={() => {
                setActiveTab(String(item.id));
              }}
              className={clsx(
                'flex cursor-pointer items-center justify-start gap-x-4 border-b-2 border-b-dark-50 py-3 px-6',
                activeTab === String(item.id) && 'bg-dark-100',
                index === 0 && 'rounded-tr-md',
                index === BlogPost_Post?.length - 1 && '!border-b-0',
              )}
            >
              <img
                src={assetsUrl(item.media.data.attributes.url)}
                className="size-5"
              />
              <p className="text-sm font-medium leading-6 text-dark-500">
                {item.title}
              </p>
            </div>
          ))}
        </div>
        <div className="flex-1 lg:border-r-2 lg:border-r-dark-100">
          <ArzinjaRulesContent activeTab={activeTab} />
        </div>
      </article>
    </section>
  );
};

export default ContentSectionPage;
