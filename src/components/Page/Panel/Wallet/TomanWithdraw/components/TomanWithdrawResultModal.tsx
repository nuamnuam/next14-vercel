import React from 'react';
import { Modal, Icon, Button, LabelValue } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import BitcoinIcon from '@/components/Icons/BitcoinIcon';
import { useRouter } from 'next/router';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useLang } from '@/hooks';
import useFiatWithdrawStore from '@/store/useFiatWithdrawStore';
import { toPrice } from '@/utils';

interface Props {
  calculatedFee: number;
  resultValue: number;
}

export const tomanWithdrawResultModalName = 'toman-withdraw-result-modal';
const TomanWithdrawResultModal: React.FC<Props> = ({
  calculatedFee,
  resultValue,
}) => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();
  const { closeSyncModal } = useModal(tomanWithdrawResultModalName);
  const router = useRouter();
  const { transactionId, withdrawValue } = useFiatWithdrawStore();

  return (
    <Modal
      sync
      name={tomanWithdrawResultModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
    >
      <div>
        <div className="flex flex-col items-center border-b-2 border-dark-50">
          <Icon
            icon="CheckMessage-Filled"
            size={48}
            className="[&>*]:fill-warning-500"
          />
          <h2 className="py-4 text-center font-bold text-dark-500">
            {wallet.confirmTomanWithdrawRequest}
          </h2>
        </div>
        <LabelValue
          label={wallet.transId}
          value={transactionId}
          classNames="py-2"
          valueClassNames="!text-dark-700 !text-sm !font-normal"
        />
        <LabelValue
          label={wallet.commission}
          value={`${toPrice(calculatedFee)} ${wallet.toman}`}
          classNames="py-2"
          valueClassNames="!text-dark-700 !text-sm !font-normal"
        />
        <LabelValue
          label={wallet.withdrawAmount}
          value={`${toPrice(withdrawValue ?? 0)} ${wallet.toman}`}
          classNames="py-2"
          valueClassNames="!text-dark-700 !text-sm !font-normal"
        />
        <LabelValue
          label={wallet.earnedAmount}
          value={`${toPrice(resultValue ?? 0)} ${wallet.toman}`}
          classNames="py-2"
          valueClassNames="!text-dark-700 !text-sm !font-normal"
        />
      </div>
      <ModalFooter>
        <Button
          size={isDesktop ? 'lg' : 'md'}
          fullWidth
          className="lg:mt-2"
          onClick={async () => await router.replace('/panel/wallet/my-wallet')}
        >
          {wallet.goToWallet}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TomanWithdrawResultModal;
