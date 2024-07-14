import { Button, Icon, LabelValue, Modal } from '@/components/Common';
import TetherIcon from '@/components/Icons/TetherIcon';
import TomanIcon from '@/components/Icons/TomanIcon';
import { useModal } from '@/hooks/useModal';
import { useConvertSmallAssetsMutation } from '@/requests/panel/wallet/postSmallAssets';
import { useSmallAssetsStore } from '@/store';
import { ISmallAssetsResult } from '@/types/wallet';
import { toPrice, toStraightNumber } from '@/utils';
import { useCallback, useMemo } from 'react';
import SmallAssetsSuccessModal from './SmallAssetsSuccessModal';
import SmallAssetsFailedModal from './SmallAssetsFailedModal';
import { useLang } from '@/hooks';

interface Props {
  data?: ISmallAssetsResult;
  sum: number;
}

export const confirmSmallAssetsModalName = 'confirm-small-asset-modal';
const ConfirmSmallAssetsModal: React.FC<Props> = ({ data, sum }) => {
  const [wallet] = useLang(['wallet']);

  const { closeSyncModal: closeConfirmModal } = useModal(
    confirmSmallAssetsModalName,
  );

  const { target, selectedAssets, selectAll } = useSmallAssetsStore();

  const { isPending: submitFormLoading, mutateAsync: submitFormMutate } =
    useConvertSmallAssetsMutation();

  const fee = useMemo(() => {
    if (!data) return 0;
    return (+data?.commission_percent * +sum) / 100;
  }, [data, sum, target]);

  const usdtContent = useCallback(() => {
    return (
      <div className="border-t-2 border-dark-50 w-full">
        <LabelValue
          classNames="mt-3"
          label={wallet.convertTo}
          value={
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-500">USDT</span>
              <span className="font-medium text-dark-700">{wallet.tether}</span>
              <TetherIcon />
            </div>
          }
        />
        <LabelValue
          classNames="mt-4"
          label={wallet.convertFee}
          value={`${toPrice(toStraightNumber(fee.toFixed(2)))} USDT`}
        />
        <LabelValue
          classNames="mt-4"
          label={wallet.earnedInUsdt}
          value={`${toPrice(toStraightNumber((sum - fee).toFixed(2)))} USDT `}
        />
      </div>
    );
  }, [target, selectedAssets, selectAll]);

  const tomanContent = useCallback(() => {
    return (
      <div className="border-t-2 border-dark-50 w-full">
        <LabelValue
          classNames="mt-3"
          label={wallet.convertTo}
          value={
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-500">IRT</span>
              <span className="font-medium text-dark-700">{wallet.toman}</span>
              <TomanIcon />
            </div>
          }
        />
        <LabelValue
          classNames="mt-4"
          label={wallet.convertFee}
          value={`${toPrice(fee.toFixed(0))} IRT`}
        />
        <LabelValue
          classNames="mt-4"
          label={wallet.earnedInToman}
          value={`${toPrice((sum - fee).toFixed(0))} IRT `}
        />
      </div>
    );
  }, [target, selectedAssets, selectAll]);

  const handleSubmit = () => {
    submitFormMutate();
  };

  return (
    <>
      <Modal
        sync
        name={confirmSmallAssetsModalName}
        onClose={closeConfirmModal}
        contentAddtionalClassNames="!pt-0 -mt-3"
        titleWrapperClassName="!pt-8 z-[1]"
      >
        <div className="flex flex-col gap-4 items-center">
          <div className="p-4 rounded-xl bg-warning-50 flex items-center justify-center">
            <Icon
              icon="ExclamationCircle-OutLined"
              size={24}
              className="text-warning-500"
            />
          </div>
          <span className="text-dark-700 font-bold text-center">
            {wallet.confirmConvertRequest}
          </span>
          <div className="border-t-2 border-dark-50 w-full">
            {target === 'USDT' ? usdtContent() : tomanContent()}
          </div>
          <div className="flex gap-4 w-full">
            <Button
              size="lg"
              variant="dark"
              fullWidth
              isLoading={submitFormLoading}
              onClick={() => closeConfirmModal()}
            >
              {wallet.cancel}
            </Button>
            <Button
              size="lg"
              variant="primary"
              fullWidth
              isLoading={submitFormLoading}
              onClick={() => handleSubmit()}
            >
              {wallet.confirmConvert}
            </Button>
          </div>
        </div>
      </Modal>
      <SmallAssetsSuccessModal />
      <SmallAssetsFailedModal />
    </>
  );
};

export default ConfirmSmallAssetsModal;
