import React from 'react';
import { Button, Icon } from '@/components/Common';
import List from '../List';
import CardRowItem from '../CardRowItem';
import Link from 'next/link';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useLang } from '@/hooks';

const LevelTwoCongrats: React.FC = () => {
  const [global, kyc] = useLang(['global', 'kyc']);

  const levelTwoItems = [
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
      icon: 'CheckCircle-OutLined',
    },
  ];

  return (
    <>
      <div className="flex flex-col pt-6 md:pt-0">
        <Icon
          icon={'ClockCircle-Filled'}
          className="mx-auto mb-8 [&>*]:fill-warning-500"
          size={64}
        />
        <p className="text-lg mb-8 text-center font-bold text-dark-700">
          {kyc.upgradeToLevelTwocongrats}
        </p>
        <p className="mb-8 text-dark-800">
          {kyc.upgradeToLevelTwocongratsMessage}
        </p>
        <div className="lg:mb-5">
          <List items={levelTwoItems} ItemComponent={CardRowItem} />
        </div>
        <ModalFooter fullScreen>
          <div className="flex lg:mt-8 w-full">
            <Link href="/panel/my-account/validation" className="w-full block">
              <Button size="lg" fullWidth>
                {global.return}
              </Button>
            </Link>
          </div>
        </ModalFooter>
      </div>
    </>
  );
};

export default LevelTwoCongrats;
