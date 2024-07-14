import { Request, externalData } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { ISmallAssetsResult } from '@/types/wallet';
import { WALLET } from '@/requests/endpoints';
import { useSmallAssetsStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import { confirmSmallAssetsModalName } from '@/components/Page/Panel/Wallet/MyWallet/components/SmallConvertContent/ConfirmSmallAssetsModal';
import { smallAssetsSuccessModalName } from '@/components/Page/Panel/Wallet/MyWallet/components/SmallConvertContent/SmallAssetsSuccessModal';
import { smallAssetsFailedModalName } from '@/components/Page/Panel/Wallet/MyWallet/components/SmallConvertContent/SmallAssetsFailedModal';

type RequestBody = {
  currency_ids?: number[];
  destination_currency?: string;
  convert_all?: boolean;
};

export type SuccussConvertSmallAssetsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: ISmallAssetsResult;
};

export type ErrorGetSmallAssetsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { amount?: string; destination_currency: string; user_id: string };
};

export function convertSmallAssets() {
  const { target, selectedAssets, selectAll } = useSmallAssetsStore.getState();

  const payload: RequestBody = {
    currency_ids: selectedAssets.map((item) => item.currency_id),
    destination_currency: target === 'USDT' ? 'USDT' : 'IRT',
    convert_all: selectAll,
  };

  return Request.post<SuccussConvertSmallAssetsResponse>(
    WALLET.CONVERT_SMALL_ASSETS,
    payload,
  );
}

export function useConvertSmallAssetsMutation() {
  const { closeSyncModal: closeConfirmModal } = useModal(
    confirmSmallAssetsModalName,
  );

  const { showSyncModal: showSuccessModal } = useModal(
    smallAssetsSuccessModalName,
  );

  const { showSyncModal: showFailedModal } = useModal(
    smallAssetsFailedModalName,
  );

  return useMutation<
    SuccussConvertSmallAssetsResponse,
    ErrorGetSmallAssetsResponse
  >({
    mutationFn: async () => await convertSmallAssets()(),
    mutationKey: ['convert-small-assets'],
    onSuccess: (res) => {
      externalData.set(res.message);
      closeConfirmModal(() => showSuccessModal());
    },
    onError: (error) => {
      const firstError = error?.result
        ? Object.values(error.result)?.[0]
        : null;
      if (firstError) externalData.set(firstError);
      closeConfirmModal(() => showFailedModal());
    },
  });
}
