import { IPagination } from './wallet';

export interface IOrderHistorysResponse {
  result: ISingleOrderHistory[];
  pagination: IPagination;
  code: number;
  success: boolean;
  message: string;
}

export interface ISingleOrderHistory {
  order_id: number;
  side: 'BUY' | 'SELL';
  status: 0 | 1;
  type: 'MARKET' | 'LIMIT';
  order_type: 'OTC' | 'CONVERT' | 'P2P';
  trade_fill_percent: number;
  total: string;
  created_at: string;
  amount: string;
  amount_unit: string;
  base_asset: string;
  price: string;
  quote_asset: string;
}

export interface ISubmitP2POrderModel {
  pair: string;
  type: 'MARKET' | 'LIMIT';
  side: 'BUY' | 'SELL';
  qty: string;
  user_price?: string;
}
