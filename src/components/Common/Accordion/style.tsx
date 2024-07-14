import { styled } from '@mui/material/styles';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Icon from '../Icon';

export const CustomMuiAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  border: `1px solid #D0D0D0`,
  borderRadius: '8px !important',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <Icon icon="Down-OutLined" className="text-dark-grey scale-x-125" />
    }
    {...props}
  />
))(({ theme }) => ({
  paddingLeft: 16,
  fontSize: 14,
  color: '#222222',
  fontWeight: 500,
  borderTopLeftRadius: '8px !important',
  borderTopRightRadius: '8px !important',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  fontSize: 14,
  color: '#717171',
  padding: 16,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
