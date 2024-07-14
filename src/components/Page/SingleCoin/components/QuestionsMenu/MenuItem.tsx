import clsx from 'classnames';
import { styled } from '@mui/material/styles';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { colors } from '@/designTokens';
import { Icon } from '@/components/Common';

type IProps = {
  selected: number;
  onSelect: (v: number) => void;

  item: {
    id: number;
    question: string;
    answer: string;
  };
};

const MenuItem = ({ selected, onSelect, item }: IProps) => {
  const isSelected = item.id === selected;
  const ColorClass = isSelected ? '!text-primary-500' : 'text-dark-500';

  return (
    <Accordion expanded={isSelected} onChange={() => onSelect(item.id)}>
      <AccordionSummary
        className={clsx('hover:bg-dark-50', isSelected && 'active')}
      >
        <Icon icon="QuestionBox-OutLined" size={20} className={ColorClass} />

        <h5 className={clsx('mr-4 text-sm font-medium', ColorClass)}>
          {item.question}
        </h5>
      </AccordionSummary>
      <AccordionDetails>
        <div
          className="text-sm font-medium leading-8 text-dark-500"
          dangerouslySetInnerHTML={{ __html: item.answer }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default MenuItem;

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
    expandIcon={
      <Icon
        icon="Down-OutLined"
        size={12}
        className={
          props.className?.includes('active')
            ? 'text-primary-500'
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
  },
}));
