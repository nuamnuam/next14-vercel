export type ICommissionLevel = {
  id: number;
  title: string;
  min_trade_range: number;
  max_trade_range: number;
  p2p_transaction_commission: {
    maker: string;
    taker: string;
  };
  otc_transaction_commission_discount: string;
  convert_commission_discount: string;
};
