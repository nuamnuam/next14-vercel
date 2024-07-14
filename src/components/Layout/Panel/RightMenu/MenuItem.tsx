import Link from 'next/link';
import clsx from 'classnames';
import { styled } from '@mui/material/styles';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { colors } from '@/designTokens';
import { Icon } from '@/components/Common';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { MenuItemType } from '.';

interface ItemType {
  title: string;
  name: string;
  href: string | string[];
}

type IProps = {
  data: {
    title: string;
    name: string;
    generateIcon?: (isActiveAccordion?: boolean) => React.ReactNode;
    href?: string | string[];
    children?: ItemType[];
  };
  onClick: (item: MenuItemType) => void;
  isActive: boolean;
};

const MenuItem: React.FC<IProps> = ({ data, onClick, isActive }) => {
  const { title, href, children, generateIcon } = data;
  const { pathname } = useRouter();

  const checkPathname = (href?: string | string[]) => {
    if (!href) return false;
    if (Array.isArray(href)) {
      return href.some((i) => pathname.startsWith(i));
    }
    return pathname.startsWith(href);
  };

  const isActiveAccordion = useMemo(() => {
    return children?.some((item) => checkPathname(item.href));
  }, [pathname]);

  const isActiveSubItem = useCallback(
    (href: string | string[]) => {
      if (!href) return false;
      if (Array.isArray(href)) {
        return href.some((i) => pathname.startsWith(i));
      }
      return pathname.startsWith(href);
    },
    [pathname],
  );

  if (children?.length) {
    return (
      <Accordion
        className="border-b border-dark-50"
        expanded={isActive}
        onChange={() => onClick(data)}
      >
        <AccordionSummary
          className={clsx(
            isActiveAccordion ? 'active !bg-dark-100' : '',
            'hover:bg-dark-100 hover:bg-opacity-20 !mr-0 !pr-6',
          )}
        >
          <div>
            {generateIcon != null && generateIcon(isActiveAccordion)}
            <span className="mr-4 text-sm text-dark-500">{title}</span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {children.map((subItem) => (
            <div className="hover:bg-dark-100 hover:bg-opacity-20 pr-14 pl-6">
              <Link
                href={
                  Array.isArray(subItem.href) ? subItem.href[0] : subItem.href
                }
                onClick={() => onClick(subItem)}
                className={clsx(
                  'h-10 relative pr-4 text-sm after:absolute after:top-5 after:right-0 after:h-1 after:w-1 after:rounded-lg after:bg-dark-500 flex items-center',
                  isActiveSubItem(subItem.href)
                    ? 'text-primary-600'
                    : 'text-dark-500',
                )}
              >
                {subItem.title}
              </Link>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  }
  return (
    <Link
      href={href ? (Array.isArray(href) ? href[0] : href) : href!}
      onClick={() => onClick(data)}
      className={clsx(
        'flex items-center border-b border-dark-50 py-3 px-6 text-sm text-dark-500',
        isActiveSubItem(href!)
          ? 'bg-dark-100'
          : 'hover:bg-dark-100 hover:bg-opacity-20',
      )}
    >
      {generateIcon != null && generateIcon(checkPathname(href))}
      <span className="mr-4">{title}</span>
    </Link>
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
            ? 'text-dark-300'
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
  minHeight: '48px',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {},
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
}));
