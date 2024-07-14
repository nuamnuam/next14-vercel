import { Request, externalData } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { MARKET } from '@/requests/endpoints';
import { useInstanceTradeStore } from '@/store';
import { IOrderResult } from '@/types/instanceTrade';
import { useModal } from '@/hooks/useModal';
import { orderResultModalName } from '@/components/Page/Panel/FastOrder/OrderResultModal';

type Payload = {
  pair?: string;
  type?: 'LIMIT' | 'MARKET';
  side: 'BUY' | 'SELL';
  qty?: number | string;
  is_quote?: 0 | 1;
  user_price?: number;
};

export type SuccussOrderResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IOrderResult;
};

export type ErrorOrderResponse = {
  code: number;
  success: boolean;
  message: string;
  result: Record<string, string>;
};

export function submitOrder(data: Payload) {
  const { priceType, userPrice } = useInstanceTradeStore.getState();

  const payload: Payload = {
    ...data,
    type: priceType,
    ...(priceType === 'LIMIT' && { user_price: userPrice }),
  };

  return Request.post<SuccussOrderResponse>(MARKET.SUBMIT_ORDER, payload);
}

export function useOrderMutation() {
  const { showSyncModal } = useModal(orderResultModalName);

  return useMutation<SuccussOrderResponse, ErrorOrderResponse, Payload>({
    mutationFn: async (data) => await submitOrder(data)(),
    mutationKey: ['order-submit'],
    onSuccess: (res) => {
      showSyncModal();
      externalData.set(res.result);
    },
  });
}
