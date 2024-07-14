import Link from 'next/link';
import { useModal } from '@/hooks/useModal';
import { Button, Icon, Modal } from '@/components/Common';
import { externalData } from '@/utils';
import { useEffect, useState } from 'react';
import { useLang } from '@/hooks';

export const smallAssetsSuccessModalName = 'small-assets-success-modal';
const SmallAssetsSuccessModal: React.FC = () => {
  const [wallet] = useLang(['wallet']);

  const { closeSyncModal, isSyncModalOpen } = useModal(
    smallAssetsSuccessModalName,
  );
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!isSyncModalOpen) return;
    setMessage(externalData.get() ?? wallet.requestFailedMsg);
  }, [isSyncModalOpen]);

  return (
    <Modal
      sync
      name={smallAssetsSuccessModalName}
      onClose={closeSyncModal}
      contentAddtionalClassNames="!pt-0 -mt-3"
      titleWrapperClassName="!pt-8 z-[1]"
    >
      <div className="flex flex-col gap-4 items-center">
        <div className="p-4 rounded-xl bg-primary-50 flex items-center justify-center">
          <Icon
            icon="CheckCircle-OutLined"
            size={24}
            className="text-primary-500"
          />
        </div>
        <span className="text-dark-700 font-bold text-center">
          {wallet.successConvert}
        </span>
        <p className="border-t-2 border-dark-50 w-full text-dark-700 text-sm pb-6 pt-10 text-center">
          {message}
        </p>
        <Link href="/panel/wallet/my-wallet" className="w-full">
          <Button size="lg" variant="primary" fullWidth>
            {wallet.goToWallet}
          </Button>
        </Link>
      </div>
    </Modal>
  );
};

export default SmallAssetsSuccessModal;
