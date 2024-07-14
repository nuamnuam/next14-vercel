import CustomPopover from '@/components/Common/Popover';
import DownloadAppMenuContent from './DownloadAppMenuContent';

interface Props {
  triggerElement: React.ReactNode;
}

export const DownloadAppMenu: React.FC<Props> = ({ triggerElement }) => {
  return (
    <div>
      <CustomPopover id="download_menu" anchor={triggerElement}>
        <div style={{ width: '220px' }}>
          <DownloadAppMenuContent />
        </div>
      </CustomPopover>
    </div>
  );
};

export default DownloadAppMenu;
