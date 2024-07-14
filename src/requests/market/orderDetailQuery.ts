import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { MARKET } from '../endpoints';

type ITradeType = {
  trade_commission: string;
  trade_create_at: string;
  trade_price: string;
  trade_qty: string;
  trade_total: string;
};

export type ISingleOrderDetail = {
  commission: string;
  commission_asset: string;
  commission_discount: string;
  commission_percent: string;
  from_asset_amount: string;
  from_asset_symbol: string;
  from_asset_title: string;
  order_id: number;
  price: string;
  price_unit: string;
  side: 'BUY' | 'SELL';
  status: number;
  to_asset_amount: string;
  to_asset_symbol: string;
  to_asset_title: string;
  total_qty: string;
  trade_count: number;
  trade_fill_percent: string;
  trades: ITradeType[];
  type: 'MARKET' | 'LIMIT';
  created_at?: string;
  ticket_id?: number | string;
  receiving_qty?: string;
  ticket_default_subject_id?: string;
  ticket_department_id?: string;
  trade_fill_amount: string;
  base_asset?: string;
  quote_asset?: string;
};

export type SuccessOrderDetailResponse = {
  code: number;
  success: boolean;
  message: string;
  result: ISingleOrderDetail;
};

export type ErrorOrderDetailResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

type OrderDetailParams = {
  order_id: number;
};

export async function getOrderDetail({ order_id }: OrderDetailParams) {
  const response = await Request.get<SuccessOrderDetailResponse>(
    MARKET.ORDER_DETAIL(order_id),
  )();
  return response;
}

export function useOrderDetail(order_id: number) {
  return useQuery({
    queryKey: ['get-order-history-detail'],
    queryFn: async () => {
      return await getOrderDetail({ order_id });
    },
    gcTime: 0,
    staleTime: 0,
  });
}
