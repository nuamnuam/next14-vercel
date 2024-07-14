import { type FC, useState } from 'react';
import {
  AccordionDetails,
  AccordionSummary,
  CustomMuiAccordion,
} from './style';

interface Props {
  title: string;
  description: string;
  isExpanded?: boolean;
  extraClassName?: string;
}

const Accordion: FC<Props> = ({
  title,
  description,
  isExpanded = false,
  extraClassName,
}) => {
  const [expanded, setExpanded] = useState<string | false>(
    isExpanded ? 'panel' : false,
  );

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div className={extraClassName}>
      <CustomMuiAccordion
        expanded={expanded === 'panel'}
        onChange={handleChange('panel')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          {title}
        </AccordionSummary>
        <AccordionDetails>{description}</AccordionDetails>
      </CustomMuiAccordion>
    </div>
  );
};

export default Accordion;
