import CustomPopover from '@/components/Common/Popover';
import NotificationsMenuContent from './NotificationsMenuContent';

interface Props {
  triggerElement: React.ReactNode;
}

export const NotificationsMenu: React.FC<Props> = ({ triggerElement }) => {
  return (
    <div>
      <CustomPopover id="notifications_menu" anchor={triggerElement}>
        <div style={{ width: '400px' }}>
          <NotificationsMenuContent />
        </div>
      </CustomPopover>
    </div>
  );
};

export default NotificationsMenu;
