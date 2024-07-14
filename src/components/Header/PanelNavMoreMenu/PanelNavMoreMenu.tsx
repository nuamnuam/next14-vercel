import CustomPopover from '@/components/Common/Popover';
import PanelNavMoreMenuContent from './PanelNavMoreMenuContent';

interface Props {
  triggerElement: React.ReactNode;
}

export const PanelNavMoreMenu: React.FC<Props> = ({ triggerElement }) => {
  return (
    <div>
      <CustomPopover id="panel_nav_more_menu" anchor={triggerElement}>
        <div style={{ width: '300px' }}>
          <div className="py-2">
            <PanelNavMoreMenuContent />
          </div>
        </div>
      </CustomPopover>
    </div>
  );
};

export default PanelNavMoreMenu;
