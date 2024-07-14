import { Card, GuideButton, SwimTab } from '@/components/Common';
import { cryptoTransitionDetailsModalName } from '@/components/Common/Transaction/CryptoTransactionDetailsModal';
import { tomanTransitionDetailsModalName } from '@/components/Common/Transaction/TomanTransactionDetailsModal';
import { useBreakpoint } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import { getLang } from '@/utils';
import { useEffectOnce } from 'react-use';

interface Props {
  children: React.ReactNode;
}

const [wallet] = getLang(['wallet']);

const WalletWithdrawLayout: React.FC<Props> = ({ children }) => {
  const { isDesktop } = useBreakpoint();

  const { closeSyncModal: closeCryptoDetailsModal } = useModal(
    cryptoTransitionDetailsModalName,
  );
  const { closeSyncModal: closeTomanDetailsModal } = useModal(
    tomanTransitionDetailsModalName,
  );

  useEffectOnce(() => {
    closeCryptoDetailsModal();
    closeTomanDetailsModal();
  });

  return (
    <div>
      <Card classNames="!bg-transparent">
        {isDesktop && (
          <div className="flex items-center justify-between border-b border-dark-50 pl-10 lg:rounded-t-lg lg:bg-white">
            <SwimTab
              items={tabItems}
              className="w-96 border-b border-dark-50"
            />
            <GuideButton />
          </div>
        )}
        {children}
      </Card>
    </div>
  );
};

export default WalletWithdrawLayout;

const tabItems = [
  {
    id: 'tomanWithdraw',
    label: wallet.tomanWithdraw,
    href: '/panel/wallet/toman-withdraw',
  },
  {
    id: 'cryptoWithdraw',
    label: wallet.cryptoWithdraw,
    href: '/panel/wallet/crypto-withdraw',
  },
];
