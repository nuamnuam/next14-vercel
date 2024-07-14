import CustomPopover from '@/components/Common/Popover';
import TradeMenuContent from './TradeMenuContent';

interface Props {
  triggerElement: React.ReactNode;
}

export const TradeMenu: React.FC<Props> = ({ triggerElement }) => {
  return (
    <div>
      <CustomPopover id="trade_menu" anchor={triggerElement}>
        <div style={{ width: '300px' }}>
          <TradeMenuContent />
        </div>
      </CustomPopover>
    </div>
  );
};

export default TradeMenu;
