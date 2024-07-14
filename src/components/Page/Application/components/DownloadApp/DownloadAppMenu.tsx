import CustomPopover from '@/components/Common/Popover';
import DownloadAppMenuContent from './DownloadAppMenuContent';

interface Props {
  triggerElement: React.ReactNode;
  qrCodeImage: string;
}

export const DownloadAppMenu: React.FC<Props> = ({
  triggerElement,
  qrCodeImage,
}) => {
  return (
    <div>
      <CustomPopover id="download_menu" anchor={triggerElement}>
        <DownloadAppMenuContent qrCodeImage={qrCodeImage} />
      </CustomPopover>
    </div>
  );
};

export default DownloadAppMenu;
