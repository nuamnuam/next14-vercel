import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import { MARKET } from '../endpoints';

export type SuccussCancelOrderResponse = {
  message: string;
  result: any;
  success: boolean;
};

export type ErrorCancelOrderResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type CancelOrderModel = {
  order_id: number;
  order_type: string;
};

export function cancelOrder({ order_id, order_type }: CancelOrderModel) {
  const payload = { order_id };
  if (order_type === 'P2P')
    return Request.post<SuccussCancelOrderResponse>(
      MARKET.DELETE_P2P_ORDER,
      payload,
    );
  return Request.post<SuccussCancelOrderResponse>(MARKET.DELETE_ORDER, payload);
}

export function useCancelOrderMutation() {
  return useMutation<
    SuccussCancelOrderResponse,
    ErrorCancelOrderResponse,
    CancelOrderModel
  >({
    mutationFn: async (data) => await cancelOrder(data)(),
    mutationKey: ['cancel-order'],
  });
}
