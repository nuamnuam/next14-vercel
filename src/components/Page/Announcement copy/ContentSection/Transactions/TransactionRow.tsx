import { useContext } from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';
import { styled } from '@mui/material/styles';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { colors } from '@/designTokens';
import { Chip, Icon } from '@/components/Common';

import { FaqContent, FaqContext } from './TransactionsPage';

interface Props extends FaqContent {
  expanded?: string | string[] | undefined;
  setExpanded: (value: string | string[] | undefined) => void;
  category?: string | string[] | undefined;
  setCategory: (value: string | string[] | undefined) => void;
}

const FaqRow = ({
  category,
  setCategory,
  categories,
  children,
  generateIcon,
  name,
  title,
  id,
}: Props) => {
  const router = useRouter();
  const isActive = router.query.question === String(id);
  const { setFaqId, activeId } = useContext(FaqContext);

  const isShowQuestion = activeId === id;

  if (children?.length) {
    return (
      <Accordion
        expanded={isShowQuestion}
        onChange={() => {
          if (isActive) {
            router.push('/faqs');
          }

          setCategory(name);
          setFaqId(id);
        }}
      >
        <AccordionSummary
          className={clsx(
            'flex items-center justify-between w-full',
            isShowQuestion ? 'active' : '',
            'hover:bg-dark-50',
          )}
        >
          <div className="flex items-center">
            {generateIcon && generateIcon(isShowQuestion)}
            <span
              className={`${clsx(
                'mr-4 text-sm font-medium text-dark-500',
                isShowQuestion ? '!text-primary-600' : '',
              )}`}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          <div className="gap-4 ml-4 lg:flex hidden">
            {categories.data.map((item) => (
              <Chip label={item.attributes.title} variant="secondary" />
            ))}
          </div>
          {}
        </AccordionSummary>
        <AccordionDetails>
          {children.map((subItem) => (
            <p
              className="text-sm font-medium text-dark-500 px-8 pt-2 pb-8"
              dangerouslySetInnerHTML={{ __html: subItem.title }}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    );
  }
  return (
    <span
      className={clsx(
        'flex items-center border-b border-dark-50 py-3 pl-6 pr-3 text-sm text-dark-500 hover:bg-dark-50',
        category === name && 'bg-dark-100',
      )}
    >
      {generateIcon && generateIcon(category === name)}
      <span className="mr-4">{title}</span>
    </span>
  );
};

export default FaqRow;

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: `1px solid ${colors.dark[50]}`,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    className="flex justify-between"
    expandIcon={
      <Icon
        icon="Down-OutLined"
        size={12}
        className={
          props.className?.includes('active')
            ? 'text-primary-600'
            : 'text-dark-100 '
        }
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'white',
  flexDirection: 'row',
  padding: '0 12px 0 24px',
  minHeight: '61px',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {},
  '& .MuiAccordionSummary-content': {
    margin: 0,
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
}));
