import { styled } from '@mui/material/styles';
import clsx from 'classnames';
import { Card, Chip } from '@/components/Common';
import { timestampToPersianDate } from '@/utils/date-format';
import { useLang } from '@/hooks';

export type StatusVariant = 'green' | 'gray';

interface IProps {
  title: string;
  date: string;
  description: string;
  variant?: StatusVariant;
  lastItem?: boolean;
  currentItem: number;
  item: number;
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
}
const StatusBar = {
  green: 'green',
  gray: 'gray',
};

const StatusBlock = ({
  title,
  date,
  description,
  variant = 'gray',
  lastUpdate,
  direction,
  item,
  currentItem,
  update,
  cardClassName,
  firstItem,
  onMouseEnter,
  active,
}: IProps) => {
  const [application] = useLang(['application']);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onClick={onMouseEnter}
      className={clsx(
        'relative flex justify-center',
        direction === 'to-top'
          ? 'items-end'
          : 'relative top-[118px] flex-col items-end	',
      )}
    >
      {firstItem && (
        <Chip
          label={lastUpdate}
          variant="success"
          classNames="absolute left-[-50px] bottom-[-50px]"
        />
      )}

      {update != null && (
        <Card
          classNames={clsx(
            'left-[-255px] absolute px-6 py-5',
            cardClassName,
            direction !== 'to-top' ? 'top-[20px]' : 'top-[-80px]',
            active ? '!bg-white shadow-card' : 'shadow-none !bg-transparent',
          )}
        >
          {active && (
            <div className="absolute right-[-12px] top-1/2 h-3 w-3 -translate-x-1/2 rotate-45 transform bg-white"></div>
          )}

          <p className="text-base	font-bold text-dark-700	">{title}</p>
          <p
            className="mt-4	max-w-[196px] text-sm	font-medium text-dark-500"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <p className="mt-4 text-sm font-medium text-dark-300">
            {application.updatedAt}: {timestampToPersianDate(date)}
          </p>
        </Card>
      )}
      <StyledHorizontalBar
        className={clsx(
          StatusBar[variant],
          firstItem && '!w-[61px]',
          item < currentItem + 1 && '!bg-primary-500',
        )}
      />
      <div
        className={clsx(
          'flex flex-col items-center justify-center',
          direction !== 'to-top'
            ? active
              ? 'relative top-[-15px] flex-col-reverse'
              : 'relative top-[-12px] flex-col-reverse'
            : 'relative top-[8px]',
        )}
      >
        <StyledCircle
          className={clsx(`small ${StatusBar[variant]}`, active && ' active')}
        />
        <StyledVerticalBar
          className={clsx(StatusBar[variant], active && ' active')}
        />
        <StyledCircle
          className={clsx(
            `large ${StatusBar[variant]} -mr-2`,
            active && ' active',
          )}
        />
      </div>
    </div>
  );
};

const StyledVerticalBar = styled('div')(({ theme }) => ({
  '&.green': {
    background: 'linear-gradient(to bottom, #00DF9A 0%, #00DF9A 100%)',
    height: '90px',
    width: '1.5px',
  },
  '&.gray': {
    height: '90px',
    width: '1.5px',
    background: '#c8cad5',
    [theme.breakpoints.down('sm')]: {
      height: '70%',
    },
  },
  '&.active': {
    background: 'linear-gradient(to bottom, #00DF9A 0%, #00DF9A 100%)',
    height: '90px',
    width: '1.5px',
  },
}));
const StyledHorizontalBar = styled('div')(({ theme }) => ({
  '&.green': {
    background: '#00DF9A',
    width: '150px',
    height: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '40px',
    },
  },
  '&.gray': {
    background: '#D3D6E3',
    width: '150px',
    height: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '40px',
    },
  },
  '&.active': {
    background: '#00DF9A',
    width: '150px',
    height: '3px',
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
      marginRight: '0px',
      marginBottom: '-6px',
    },
    '&.gray': {
      background: '#fff',
      height: '20px',
      width: '20px',
      color: '#00df9a',
      border: '2px solid #80859E',
      borderRadius: '50%',
      marginRight: '1px',
    },
    '&.active': {
      background: '#00df9a',
      height: '25px',
      width: '24px',
      color: '#00df9a',
      border: '5px solid rgba(204,250,236)',
      borderRadius: '50%',
      marginRight: '0px',
      marginBottom: '-6px',
    },
  },
}));

export default StatusBlock;
