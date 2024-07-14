import CustomPopover from '@/components/Common/Popover';
import MarketsMenuContent from './MarketsMenuContent';

interface Props {
  triggerElement: React.ReactNode;
}

export const MarketsMenu: React.FC<Props> = ({ triggerElement }) => {
  return (
    <div>
      <CustomPopover id="markets_menu" anchor={triggerElement}>
        <div style={{ width: '300px' }}>
          <MarketsMenuContent />
        </div>
      </CustomPopover>
    </div>
  );
};

export default MarketsMenu;
