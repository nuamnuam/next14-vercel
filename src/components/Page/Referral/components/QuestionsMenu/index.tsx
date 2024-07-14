import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaqsContentResponse, useFaqsContent } from '@/requests/faqs';

import Paper from '@/components/Common/Paper';
import { Icon, Spinner } from '@/components/Common';

import MenuItem from './MenuItem';
import { useReferralContent } from '@/requests/referral';
import { getLang } from '@/utils';
import { useLang } from '@/hooks';

type MenuItem = {
  title: string;
  name: string;
  generateIcon?: (isActive?: boolean) => React.ReactNode;
  children?: Array<{
    title: string;
    name: string;
  }>;
};

const [referral] = getLang(['referral']);

export const menuItems: MenuItem[] = [
  {
    title: referral.whatIsReferral,
    name: 'whatIsReferral',
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionBox-OutLined"
        size={20}
        className={
          isActive
            ? 'active-menuItem-icon [&>*]:fill-primary-600'
            : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: referral.questionsDesc,
        name: 'questionsDesc',
      },
    ],
  },
  {
    title: referral.howToReceiveEarnedReward,
    name: 'howToReceiveEarnedReward',
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionBox-OutLined"
        size={20}
        className={
          isActive
            ? 'active-menuItem-icon [&>*]:fill-primary-600'
            : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: referral.questionsDesc,
        name: 'questionsDesc',
      },
    ],
  },
  {
    title: referral.isMarketingReferralLegal,
    name: 'isMarketingReferralLegal',
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionBox-OutLined"
        size={20}
        className={
          isActive
            ? 'active-menuItem-icon [&>*]:fill-primary-600'
            : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: referral.questionsDesc,
        name: 'questionsDesc',
      },
    ],
  },
  {
    title: referral.isLimitationForEarningSystem,
    name: 'isLimitationForEarningSystem',
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionBox-OutLined"
        size={20}
        className={
          isActive
            ? 'active-menuItem-icon [&>*]:fill-primary-600'
            : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: referral.questionsDesc,
        name: 'questionsDesc',
      },
    ],
  },
  {
    title: referral.howToRemovePeople,
    name: 'howToRemovePeople',
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionBox-OutLined"
        size={20}
        className={
          isActive
            ? 'active-menuItem-icon [&>*]:fill-primary-600'
            : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: referral.questionsDesc,
        name: 'questionsDesc',
      },
    ],
  },
];

function mapFaqs(faqs: FaqsContentResponse['data']) {
  return faqs.map(({ attributes: { answer, question }, id }) => ({
    title: question,
    name: question,
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionBox-OutLined"
        size={20}
        className={
          isActive
            ? 'active-menuItem-icon [&>*]:fill-primary-600'
            : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: answer,
        name: answer,
      },
    ],
    id,
  }));
}

export const FaqContext = createContext<{
  activeId: number | null;
  setFaqId: (id: number | null) => void;
}>(
  null as any as {
    activeId: number | null;
    setFaqId: (id: number | null) => void;
  },
);

export const Context = ({ children }: PropsWithChildren) => {
  const { query, replace } = useRouter();
  const [activeId, setActiveId] = useState<number | null>(
    Number(query.question),
  );

  const setFaqId = (id: number | null) => {
    if (query.question) {
      replace('/faqs', {}, { shallow: true });
    }

    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <FaqContext.Provider value={{ activeId, setFaqId }}>
      {children}
    </FaqContext.Provider>
  );
};

const QuestionsMenu = () => {
  const [referral] = useLang(['referral']);

  const { query } = useRouter();
  const { data: referralContent } = useReferralContent();
  const [category, setCategory] = useState<string | string[] | undefined>();
  const [expanded, setExpanded] = useState<string | string[] | undefined>();
  const { data: faqsContent, isLoading } = useFaqsContent(
    referralContent?.data.attributes.faq_slug_cat,
  );

  const { mainItem, subItem } = query;

  useEffect(() => {
    setCategory(mainItem ?? 'dashboard');
    setExpanded(subItem);
  }, [query]);

  if (!faqsContent || isLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="mt-[72px] lg:-mb-24 w-full max-w-5xl shadow-medium">
      <Paper classNames="w-full ml-8 p-0 flex flex-col">
        <p className="w-full border-b-2 border-b-dark-50 p-4 text-right text-base font-bold text-dark-700">
          {referral.anyQuestions}
        </p>
        <div className="w-full overflow-hidden">
          <Context>
            {mapFaqs(faqsContent.data).map((item) => {
              return (
                <MenuItem
                  key={item.title}
                  category={category}
                  setCategory={setCategory}
                  {...item}
                />
              );
            })}
          </Context>
        </div>
      </Paper>
    </div>
  );
};

export default QuestionsMenu;
