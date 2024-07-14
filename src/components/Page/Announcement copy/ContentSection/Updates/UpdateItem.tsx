import { styled } from '@mui/material/styles';

interface IProps {
  title: string;
  date: string;
  description: string;
  variant?: 'green' | 'gray';
  lastItem?: boolean;
}
const StatusBar = {
  green: 'green',
  gray: 'gray',
};

const UpdateItem = ({
  title,
  date,
  description,
  variant = 'gray',
  lastItem = false,
}: IProps) => {
  return (
    <div className="flex">
      <div className="w-[100px]">
        <StyledVerticalBar className={StatusBar[variant]} />
        <StyledHorizontalBar className={StatusBar[variant]}>
          <StyledCircle className={`large ${StatusBar[variant]} -mr-2`} />
          <StyledCircle className={`small ${StatusBar[variant]}`} />
        </StyledHorizontalBar>
        {!lastItem && <StyledVerticalBar className="gray" />}
      </div>
      <div className="flex-auto self-stretch pr-6 pt-11">
        <p className="mb-4 text-sm font-medium text-dark-400">{date}</p>
        <h2 className="text-md font-bold text-dark-700">{title}</h2>
        <p className="mt-4 text-sm font-medium leading-6 text-dark-500">
          {description}
        </p>
      </div>
    </div>
  );
};

const StyledVerticalBar = styled('div')(({ theme }) => ({
  '&.green': {
    background: 'linear-gradient(to bottom, #00DF9A 0%, #B0F5E0 100%)',
    height: '111px',
    width: '3px',
  },
  '&.gray': {
    height: '111px',
    width: '3px',
    background: '#c8cad5',
    [theme.breakpoints.down('sm')]: {
      height: '70%',
    },
  },
}));
const StyledHorizontalBar = styled('div')(({ theme }) => ({
  '&.green': {
    background: '#00DF9A',
    width: '80px',
    height: '1.5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '40px',
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

export default UpdateItem;
