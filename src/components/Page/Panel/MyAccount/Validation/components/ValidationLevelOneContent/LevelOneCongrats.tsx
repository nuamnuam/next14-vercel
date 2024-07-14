import React from 'react';
import { Button, Icon } from '@/components/Common';
import List from '../List';
import CardRowItem from '../CardRowItem';
import Link from 'next/link';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useLang } from '@/hooks';

const LevelOneCongrats: React.FC = () => {
  const [global, kyc] = useLang(['global', 'kyc']);

  const { isDesktop } = useBreakpoint();

  const levelOneItems = [
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
  return (
    <>
      <div className="flex flex-col">
        <Icon
          icon={'ClockCircle-Filled'}
          className="mx-auto mb-8 [&>*]:fill-warning-500"
          size={64}
        />
        <p className="text-lg mb-8 text-center font-bold text-dark-700">
          {kyc.upgradeToLevelOnecongrats}
        </p>
        <p className="mb-8 text-dark-800">
          {kyc.upgradeToLevelOnecongratsMessage}
        </p>
        <div className="lg:mb-5">
          <List items={levelOneItems} ItemComponent={CardRowItem} />
        </div>
        <ModalFooter fullScreen>
          <div className="w-full flex gap-4">
            <Link href="/panel/my-account/validation" className="flex-1">
              <Button
                size="lg"
                variant="dark"
                fullWidth={!isDesktop}
                className="lg:px-10"
              >
                {global.return}
              </Button>
            </Link>
            <Link
              className="flex-1 lg:flex-auto"
              href={'/panel/my-account/validation/level-two'}
            >
              <Button size="lg" fullWidth>
                {kyc.levelTwoAuthentication}
              </Button>
            </Link>
          </div>
        </ModalFooter>
      </div>
    </>
  );
};

export default LevelOneCongrats;
