import getLang from '@/utils/get-lang';

const [kyc] = getLang(['kyc']);

export const levelZeroItems = [
  {
    title: kyc.unlimitedDeposit,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.tomanDeposit,
    icon: 'CloseCircle-OutLined',
  },
  {
    title: kyc.unlimitedTrading,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.withDrawToman,
    icon: 'CloseCircle-OutLined',
  },
  {
    title: kyc.withDrawBitcoin,
    icon: 'CloseCircle-OutLined',
  },
];

export const levelZeroSteps = [
  {
    title: kyc.registerArzinja,
    className: '[&>*]:fill-primary-500',
    accepted: true,
    icon: 'CheckCircle-Filled',
  },
  {
    title: kyc.confirmMobileNumber,
    className: '[&>*]:fill-primary-500',
    accepted: true,
    icon: 'CheckCircle-Filled',
  },
];

export const levelOneItems = [
  {
    title: kyc.unlimitedDeposit,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.maxDepositAmount,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.unlimitedTrading,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.withDrawToman,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.withDrawBitcoin,
    icon: 'CloseCircle-OutLined',
  },
];

export const levelTwoItems = [
  {
    title: kyc.unlimitedDeposit,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.unlimitedTomanDeposit,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.unlimitedTrading,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.withDrawToman,
    icon: 'CheckCircle-OutLined',
  },
  {
    title: kyc.withDrawBitcoin,
    icon: 'CheckCircle-OutLined',
  },
];
