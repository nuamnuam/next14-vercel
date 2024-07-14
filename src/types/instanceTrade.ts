export interface IOrderResult {
  order_id: string;
  type: 'MARKET' | 'LIMIT';
  side: 'BUY' | 'SELL';
  price: number;
  price_unit: string;
  commission: number;
  commission_asset: string;
  commission_discount: number;
  commission_percent: number;
  status: 0 | 1;
  from_asset_amount: string;
  from_asset_symbol: string;
  from_asset_title: string;
  to_asset_amount: string;
  to_asset_symbol: string;
  total_qty: string;
}
