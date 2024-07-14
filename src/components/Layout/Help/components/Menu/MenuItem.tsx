import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'classnames';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import { queryClient } from '@/requests';

import { colors } from '@/designTokens';
import { Icon } from '@/components/Common';

type IProps = {
  isActive: boolean;
  isAccordionActive: boolean;
  activeFilter: string;
  name: string;
  title: string;
  generateIcon?: (isActive?: boolean) => React.ReactNode;
  href?: string;
  children?: Array<{
    title: string;
    name: string | string[];
    href: string;
  }>;
};

const MenuItem = ({
  isActive = false,
  isAccordionActive = false,
  activeFilter,
  title,
  href,
  name,
  children,
  generateIcon = () => null,
}: IProps) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(isActive);

  useEffect(() => {
    setExpanded(isActive);
  }, [isActive]);

  if (children?.length) {
    return (
      <Accordion
        expanded={expanded}
        onChange={(e, exp) => {
          setExpanded(exp);
        }}
      >
        <AccordionSummary
          className={clsx(
            isAccordionActive ? 'active !bg-dark-100' : '',
            'hover:bg-dark-50',
          )}
        >
          {generateIcon(isAccordionActive)}
          <span
            className={clsx(
              'mr-4 text-sm text-dark-500',
              name === 'faq' && 'text-blue-500',
              name === 'announcement' && 'text-danger-600',
            )}
          >
            {title}
          </span>
        </AccordionSummary>
        <AccordionDetails>
          {children.map((subItem) => (
            <Link
              href={subItem.href}
              className={clsx(
                'panel-menuItem-title hover:bg-dark-50',
                activeFilter === subItem.name
                  ? 'text-primary-600'
                  : 'text-dark-500',
              )}
            >
              {subItem.title}
            </Link>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  }

  return href ? (
    <Link
      className="w-full"
      onClick={() => {
        queryClient.refetchQueries({
          queryKey: ['get-help-cat', name === 'latest-help' ? undefined : name],
        });
      }}
      href={href ?? '/help'}
    >
      <span
        className={clsx(
          'flex items-center border-b border-dark-50 py-3 pl-6 pr-3 text-sm text-dark-500 hover:bg-dark-50 font-medium',
          isActive && 'bg-dark-100',
        )}
      >
        {generateIcon && generateIcon(isActive)}
        <span
          className={clsx(
            'mr-4',
            name === 'faq' && 'text-blue-500',
            name === 'announcement' && 'text-danger-600',
          )}
        >
          {title}
        </span>
      </span>
    </Link>
  ) : (
    <button
      className="w-full"
      onClick={() => {
        router.push(href ?? '/help');
      }}
    >
      <span
        className={clsx(
          'flex items-center border-b border-dark-50 py-3 pl-6 pr-3 text-sm text-dark-500 hover:bg-dark-50 font-medium',
          isActive && 'bg-dark-100',
        )}
      >
        {generateIcon && generateIcon(isActive)}
        <span
          className={clsx(
            'mr-4',
            name === 'faq' && 'text-blue-500',
            name === 'announcement' && 'text-danger-600',
          )}
        >
          {title}
        </span>
      </span>
    </button>
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

const AccordionSummary = styled(
  ({ className, ...rest }: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={
        <Icon
          icon="Down-OutLined"
          size={12}
          className={
            className?.includes('active') ? 'text-dark-300' : 'text-dark-100'
          }
        />
      }
      {...rest}
      className={className}
    />
  ),
)(({ theme }) => ({
  backgroundColor: 'white',
  flexDirection: 'row',
  padding: '0 12px 0 24px',
  minHeight: '48px',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {},
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
}));
