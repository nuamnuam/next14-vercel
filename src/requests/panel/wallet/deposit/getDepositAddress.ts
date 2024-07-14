import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type DepositAddressModel } from '@/types/wallet';
import { useDepositStore } from '@/store';
import { NETWORK_TYPES } from '@/components/Page/Panel/Wallet/CryptoDeposit/components/CryptoDepositContent/FirstStep';

import { WALLET } from '../../../endpoints';

type RequestBody = {
  pb_id: string;
};

export type SuccessBalancesDetailResponse = {
  result: DepositAddressModel;
  message: string;
  success: boolean;
};

export type ErrorBalancesDetailResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export async function getDepositAddress(): Promise<SuccessBalancesDetailResponse | null> {
  const { selectedNetwork } = useDepositStore.getState();

  if (selectedNetwork?.pb_id) {
    try {
      const data: RequestBody = {
        pb_id: String(selectedNetwork.pb_id),
      };
      const request = Request.post<SuccessBalancesDetailResponse>(
        WALLET.GET_DEPOSIT_ADDRESS,
        data,
      );
      const result = await request();
      return result;
    } catch (error) {
      return null;
    }
  }
  return null;
}

export function useDepositAddress() {
  const router = useRouter();
  const { selectedNetwork, setAddress, setTag, setExpiredAt } = useDepositStore(
    (state) => ({
      selectedNetwork: state.selectedNetwork,
      setAddress: state.setAddress,
      setTag: state.setTag,
      setExpiredAt: state.setExpiredAt,
    }),
  );
  return useMutation<
    SuccessBalancesDetailResponse,
    ErrorBalancesDetailResponse
  >({
    mutationFn: async () => {
      const response = await getDepositAddress();
      if (response) {
        return response;
      } else {
        throw new Error('Failed to fetch deposit address');
      }
    },
    mutationKey: ['get-deposit-address'],
    onSuccess: (res) => {
      setAddress(res.result.deposit_address);
      setTag(res.result.deposit_tag);

      if (res.result.expired_at) {
        setExpiredAt(res.result.expired_at);
      }

      if (selectedNetwork?.deposit_type === NETWORK_TYPES.SHARED) {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            step: 2,
          },
        });
      }
    },
  });
}
