import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type ISubmitP2POrderModel } from '@/types/market';

import { MARKET } from '../endpoints';
import { ISingleOrderDetail } from '../market/orderDetailQuery';

export type SuccessResponse = {
  message: string;
  result: ISingleOrderDetail;
  success: boolean;
};

export type ErrorResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postP2POrder(data: ISubmitP2POrderModel) {
  return Request.post<SuccessResponse>(MARKET.SUBMIT_P2P_Order, data);
}

export function useSubmitP2POrderMutation() {
  return useMutation<SuccessResponse, ErrorResponse, ISubmitP2POrderModel>({
    mutationFn: async (data) => await postP2POrder(data)(),
  });
}
