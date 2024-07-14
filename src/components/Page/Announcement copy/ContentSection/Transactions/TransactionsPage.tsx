import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import {
  FaqsContentResponse,
  useFaqsContentByCategoryId,
} from '@/requests/faqs';

import { Button, Card, Icon, Spinner, Pagination } from '@/components';
import { useBreakpoint, useLang } from '@/hooks';

import FaqRow from './TransactionRow';

export interface FaqContent {
  title: string;
  name: string;
  generateIcon: (isActive?: boolean) => React.ReactNode;
  children: Array<{ title: string; name: string }>;
  categories: FaqsContentResponse['data'][number]['attributes']['faq_categories'];
  id: number;
}

interface Props {
  categoryId?: number;
  name?: string;
}

function mapQuestions(
  questions: FaqsContentResponse,
  name: string | undefined,
) {
  return questions.data.map(({ attributes, id }) => ({
    title: attributes.question.trimStart().trimEnd(),
    name: attributes.question,
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionBox-OutLined"
        size={20}
        className={classNames(isActive ? 'text-primary-600' : 'text-dark-200')}
      />
    ),
    children: [
      {
        title: attributes.answer.trimStart().trimEnd(),
        name: 'questionsDesc',
      },
    ],
    categories: name === 'articles' ? attributes.faq_categories : { data: [] },
    id,
    updatedAt: attributes.updatedAt,
  }));
}

const TransactionsPage = ({ categoryId, name }: Props) => {
  const [faq] = useLang(['faq']);

  const [page, setPage] = useState(1);
  const { data: faqs, isLoading } = useFaqsContentByCategoryId(
    categoryId,
    page,
    name === 'articles' ? undefined : 10,
  );
  const [category, setCategory] = useState<string | string[] | undefined>();
  const [expanded, setExpanded] = useState<string | string[] | undefined>();
  const [pageData, setPageData] = useState<FaqContent[] | []>([]);
  const { isDesktop } = useBreakpoint();
  const router = useRouter();

  useEffect(() => {
    if (!faqs) return;

    const faqsData = [...mapQuestions(faqs, name)];

    if (
      !isDesktop &&
      (name === 'articles' || router.query.categoryId === 'articles')
    ) {
      setPageData(faqsData.slice(0, 10));
      setPage(1);
      return;
    }

    if (!isDesktop && !(page === 1)) {
      setPageData((prev) => [...prev, ...faqsData]);
      return;
    }

    if (!isDesktop) {
      setPageData(faqsData);
      return;
    }

    if (isDesktop) {
      setPageData(() =>
        name === 'articles' ? faqsData.slice(0, 10) : faqsData.slice(0, 10),
      );
    }
  }, [faqs, isLoading]);

  return (
    <Card classNames="shadow-card w-full lg:min-h-[585px] !rounded-lg">
      {!faqs?.data || isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="lg:min-h-[630px]">
            {pageData?.map((item: FaqContent) => (
              <FaqRow
                key={item.title}
                expanded={expanded}
                setExpanded={setExpanded}
                category={category}
                setCategory={setCategory}
                {...item}
              />
            ))}
          </div>
          {faqs.meta.pagination.total > 10 && name == undefined ? (
            <div className="p-5 flex items-center justify-center">
              <Pagination
                page={faqs.meta.pagination.page}
                count={faqs.meta.pagination.pageCount || 1}
                onChange={(page) => setPage(page)}
                classNames="mb-4 sm:mb-0 lg:block hidden"
              />

              {faqs.meta.pagination.pageCount === page ? null : (
                <Button
                  onClick={() => {
                    setPage((prev) => ++prev);
                  }}
                  endIcon={
                    <Icon
                      icon="ArrowLeft-TwoTone"
                      size={22}
                      className="[&>*]:fill-dark-400"
                    />
                  }
                  variant="text"
                  disabled={faqs.meta.pagination.pageCount === page}
                  className="!text-dark-400 text-sm lg:hidden block"
                >
                  {faq.loadMore}
                </Button>
              )}
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
};

export default TransactionsPage;

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
