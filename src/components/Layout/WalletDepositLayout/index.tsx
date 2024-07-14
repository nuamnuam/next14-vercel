import { GuideButton, SwimTab } from '@/components/Common';
import { cryptoTransitionDetailsModalName } from '@/components/Common/Transaction/CryptoTransactionDetailsModal';
import { tomanTransitionDetailsModalName } from '@/components/Common/Transaction/TomanTransactionDetailsModal';
import { useBreakpoint } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import { getLang } from '@/utils';
import { useEffectOnce } from 'react-use';
interface Props {
  children: React.ReactNode;
}

const [menu] = getLang(['menu']);

const WalletDepositLayout: React.FC<Props> = ({ children }) => {
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
      {isDesktop && (
        <div className="flex items-center justify-between border-b border-dark-50 pl-10 bg-white rounded-t-lg shadow-sm">
          <SwimTab items={tabItems} className="w-96 border-b border-dark-50" />
          <GuideButton />
        </div>
      )}
      {children}
    </div>
  );
};

export default WalletDepositLayout;

const tabItems = [
  {
    id: 'tomanDeposit',
    label: menu.fastDeposit,
    href: '/panel/wallet/toman-deposit',
  },
  {
    id: 'idDeposit',
    label: menu.idDeposit,
    href: '/panel/wallet/id-deposit',
  },
  {
    id: 'cryptoDeposit',
    label: menu.coinDeposit,
    href: '/panel/wallet/crypto-deposit',
  },
];
