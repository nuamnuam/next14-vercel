import { styled } from '@mui/material/styles';
import { Card } from '@/components/Common';
import clsx from 'classnames';
import { formatedDate } from '@/utils';
import { useLang } from '@/hooks';

interface IProps {
  title: string;
  date: string;
  description: string;
  variant?: 'green' | 'gray';
  lastItem?: boolean;
  cardClassName?: string;
  className?: string;
  update?: {
    title?: string;
    description?: string;
    updatedAt?: string;
  };
}
const StatusBar = {
  green: 'green',
  gray: 'gray',
};

const ResponsiveStatusBar = ({
  variant = 'gray',
  lastItem = false,
  cardClassName,
  className,
  update,
}: IProps) => {
  const [aboutUs] = useLang(['aboutUs']);
  return (
    <div className={clsx('flex', className)}>
      <div className="w-[100px] relative">
        <StyledVerticalBar className={StatusBar[variant]} />
        <StyledHorizontalBar
          className={clsx(StatusBar[variant], 'horizontal-line')}
        >
          <StyledCircle className={`large ${StatusBar[variant]} -mr-2`} />
          <StyledCircle className={`small ${StatusBar[variant]}`} />
        </StyledHorizontalBar>
        {!lastItem && <StyledVerticalBar className="gray" />}
      </div>
      <Card
        classNames={clsx(
          'flex-auto self-stretch p-4 mt-10 !shadow-card relative after:absolute after:content-[""] after:w-3 after:h-3 after:top-1/2 after:right-0 after:bg-white after:translate-x-1.5 after:-translate-y-1 after:rotate-45 after:shadow-card',
          cardClassName,
        )}
      >
        {update?.updatedAt ? (
          <p className="mb-4 text-sm font-medium text-dark-400 ">
            {aboutUs.updatedAt}:{' '}
            {formatedDate({
              date: update.updatedAt,
              locale: 'fa',
              withExtra: false,
            })}
          </p>
        ) : null}
        <h2 className="text-md font-bold text-dark-700">{update?.title}</h2>
        <ul
          className="inside	mt-4 max-w-[300px] list-disc pr-4 text-xs	font-medium text-dark-500"
          dangerouslySetInnerHTML={{ __html: update?.description ?? '' }}
        ></ul>
      </Card>
    </div>
  );
};

const StyledVerticalBar = styled('div')(({ theme }) => ({
  '&.green': {
    background: 'linear-gradient(to bottom, #00DF9A 0%, #B0F5E0 100%)',
    height: '141px',
    width: '3px',
  },
  '&.gray': {
    height: '141px',
    width: '3px',
    background: '#c8cad5',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(50% + 20px)',
    },
  },
}));
const StyledHorizontalBar = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 'calc(50% + 20px)',

  '&.green': {
    background: '#00DF9A',
    width: '80px',
    height: '1.5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '50px',
    },
  },
  '&.gray': {
    background: '#D3D6E3',
    width: '80px',
    height: '1.5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '50px',
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
  },
  '&.large': {
    '&.green': {
      background: '#00df9a',
      height: '25px',
      width: '24px',
      color: '#00df9a',
      border: '5px solid rgba(204,250,236)',
      borderRadius: '50%',
      marginRight: '-10px',
    },
    '&.gray': {
      background: '#fff',
      height: '20px',
      width: '20px',
      color: '#00df9a',
      border: '2px solid #80859E',
      borderRadius: '50%',
    },
  },
}));

export default ResponsiveStatusBar;
