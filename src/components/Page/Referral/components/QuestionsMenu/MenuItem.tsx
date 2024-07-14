import clsx from 'classnames';
import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { colors } from '@/designTokens';
import { Icon } from '@/components/Common';
import { FaqContext } from '.';

type IProps = {
  title: string;
  name: string;
  generateIcon?: (isActive?: boolean) => React.ReactNode;
  category?: string | string[] | undefined;
  setCategory: (value: string | string[] | undefined) => void;
  children?: Array<{
    title: string;
    name: string;
  }>;
  id: number;
};

const MenuItem = (props: IProps) => {
  const { category, setCategory, id } = props;
  const { setFaqId, activeId } = useContext(FaqContext);

  if (props.children?.length) {
    return (
      <Accordion
        expanded={activeId === id}
        onChange={() => {
          setCategory(props.name);
          setFaqId(id);
        }}
      >
        <AccordionSummary
          className={clsx(
            '!pr-4',
            activeId === id ? 'active !bg-primary-50' : '',
            'hover:bg-dark-50',
          )}
        >
          {props.generateIcon != null && props.generateIcon(activeId === id)}
          <span
            className={clsx(
              'mr-4 text-sm font-medium text-dark-500',
              activeId === id && 'text-primary-600 font-medium',
            )}
            dangerouslySetInnerHTML={{ __html: props.title }}
          />
        </AccordionSummary>
        <AccordionDetails>
          {props.children.map((subItem) => (
            <p
              className={clsx(
                '!p-4 text-base font-medium	 text-dark-500 ',
                activeId === id ? 'text-primary-600' : 'text-dark-500',
              )}
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
        'flex items-center border-b border-dark-50 py-3 pl-6 !pr-4 text-sm text-dark-500 hover:bg-dark-50 	',
        activeId === id && 'bg-primary-50',
      )}
    >
      {props.generateIcon != null && props.generateIcon(activeId === id)}
      <span className="mr-4">{props.title}</span>
    </span>
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
            ? 'text-dark-300 [&>*]:fill-primary-600'
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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
}));
