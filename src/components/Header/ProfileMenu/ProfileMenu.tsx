import CustomPopover from '@/components/Common/Popover';
import ProfileMenuContent from '@/components/Header/ProfileMenu/ProfileMenuContent';

interface Props {
  triggerElement: React.ReactNode;
}

export const ProfileMenu: React.FC<Props> = ({ triggerElement }) => {
  return (
    <div>
      <CustomPopover id="profile_menu" anchor={triggerElement}>
        <div style={{ width: '300px' }}>
          <ProfileMenuContent />
        </div>
      </CustomPopover>
    </div>
  );
};

export default ProfileMenu;
