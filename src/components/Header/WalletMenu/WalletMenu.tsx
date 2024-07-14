import CustomPopover from '@/components/Common/Popover';
import WalletMenuContent from './WalletMenuContent';

interface Props {
  triggerElement: React.ReactNode;
}

export const WalletMenu: React.FC<Props> = ({ triggerElement }) => {
  return (
    <div>
      <CustomPopover id="wallet_menu" anchor={triggerElement}>
        <div style={{ width: '300px' }}>
          <div className="px-3 py-1">
            <WalletMenuContent />
          </div>
        </div>
      </CustomPopover>
    </div>
  );
};

export default WalletMenu;
