import { styled } from '@mui/material/styles';
import clsx from 'classnames';
import { Card, Chip } from '@/components/Common';
import { formatedDate } from '@/utils/date-format';
import { useLang } from '@/hooks';

interface IProps {
  title: string;
  date: string;
  description: string;
  variant?: 'green' | 'gray';
  lastItem?: boolean;
  direction?: string;
  update?: {
    title?: string;
    description?: string;
    updatedAt?: string;
  };
  cardClassName?: string;
  firstItem?: boolean;
  onMouseEnter?: () => void;
  active?: boolean;
  lastUpdate: string;
  section?: number;
}
const StatusBar = {
  green: 'green',
  gray: 'gray',
};

const ResponsiveStatusBlock = ({
  variant = 'gray',
  direction,
  update,
  cardClassName,
  firstItem,
  lastUpdate,
  active,
  section,
}: IProps) => {
  const [aboutUs] = useLang(['aboutUs']);
  return (
    <div
      id={`div` + section}
      className={clsx(
        'relative flex justify-center',
        direction === 'to-top'
          ? 'right-[3px] flex-col items-start'
          : 'relative right-[4px] flex-col items-start	',
      )}
    >
      {firstItem && (
        <Chip
          label={lastUpdate}
          variant="success"
          classNames="absolute right-[-162px] bottom-[0px]"
        />
      )}
      {update != null && (
        <Card
          classNames={clsx(
            ' left-[-410px] absolute px-6 py-5 w-[397px] min-h-[280px] max-h-[280px] overflow-y-auto overflow-x-hidden',
            cardClassName,
            direction !== 'to-top'
              ? 'top-[125px] right-[-480px]'
              : 'top-[110px]',
            active ? '!bg-white' : '!bg-transparent shadow-none',
          )}
        >
          {update.updatedAt ? (
            <p className="text-xs font-medium text-dark-300">
              {aboutUs.updatedAt}:{' '}
              {formatedDate({
                date: update.updatedAt,
                locale: 'fa',
                withExtra: false,
              })}
            </p>
          ) : null}
          {active && (
            <div
              className={clsx(
                'absolute  top-1/2 h-3 w-3 -translate-x-1/2 rotate-45 transform bg-white',
                direction !== 'to-top' ? 'left-0' : 'right-[-12px]',
              )}
            ></div>
          )}
          <p className="text-base	font-bold text-dark-700	mt-4">
            {update?.title}
          </p>
          {update?.description ? (
            <p
              className="mt-4	max-w-[196px] text-sm	font-medium text-dark-500"
              dangerouslySetInnerHTML={{ __html: update?.description }}
            />
          ) : null}
        </Card>
      )}
      <StyledVerticalBar
        className={clsx(StatusBar[variant], active && ' active')}
      />
      <div
        className={clsx(
          'flex flex-row items-center justify-center',
          direction !== 'to-top'
            ? 'relative right-[-59px] flex-row-reverse'
            : 'relative left-[7px]',
        )}
      >
        <StyledCircle
          className={clsx(`large ${StatusBar[variant]}`, active && ' active')}
        />
        <StyledHorizontalBar
          className={clsx(StatusBar[variant], active && ' active')}
        />
        <StyledCircle
          className={clsx(`small ${StatusBar[variant]}`, active && ' active')}
        />
      </div>
    </div>
  );
};

const StyledVerticalBar = styled('div')(({ theme }) => ({
  '&.green': {
    background: 'linear-gradient(to bottom, #00DF9A 0%, #00DF9A 100%)',
    height: '250px',
    width: '3px',
  },
  '&.gray': {
    height: '250px',
    width: '3px',
    background: '#c8cad5',
    [theme.breakpoints.down('sm')]: {
      height: '70%',
    },
  },
  '&.active': {
    background: 'linear-gradient(to bottom, #00DF9A 0%, #00DF9A 100%)',
    height: '250px',
    width: '3px',
  },
}));
const StyledHorizontalBar = styled('div')(({ theme }) => ({
  '&.green': {
    background: '#00DF9A',
    width: '40px',
    height: '2px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '40px',
    },
  },
  '&.gray': {
    background: '#D3D6E3',
    width: '40px',
    height: '2px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '40px',
    },
  },
  '&.active': {
    background: '#00DF9A',
    width: '40px',
    height: '2px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '40px',
    },
  },
}));
const StyledCircle = styled('div')(({ theme }) => ({
  '&.small': {
    '&.green': {
      background: '#00df9a',
      height: '10px',
      width: '10px',
      color: '#00df9a',
      borderRadius: '50%',
    },
    '&.gray': {
      background: '#D3D6E3',
      height: '10px',
      width: '10px',
      color: '#00df9a',
      borderRadius: '50%',
    },
    '&.active': {
      background: '#00df9a',
      height: '10px',
      width: '10px',
      color: '#00df9a',
      borderRadius: '50%',
    },
  },
  '&.large': {
    '&.green': {
      background: '#00df9a',
      height: '25px',
      width: '24px',
      color: '#00df9a',
      border: '5px solid rgba(204,250,236)',
      borderRadius: '50%',
      marginRight: '-3px',
    },
    '&.gray': {
      background: '#fff',
      height: '20px',
      width: '20px',
      color: '#00df9a',
      border: '2px solid #80859E',
      borderRadius: '50%',
      marginRight: '-1px',
    },
    '&.active': {
      background: '#00df9a',
      height: '25px',
      width: '24px',
      color: '#00df9a',
      border: '5px solid rgba(204,250,236)',
      borderRadius: '50%',
      marginRight: '-3px',
    },
  },
}));

export default ResponsiveStatusBlock;
