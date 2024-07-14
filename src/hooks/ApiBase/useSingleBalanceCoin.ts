import { useBalances } from '@/requests/panel/wallet/getBalances';

export default function useSingleBalanceCoin(
  symbol: string,
  with_network: 0 | 1 = 0,
  type: 'deposit' | 'withdraw' = 'deposit',
) {
  const { data, isLoading } = useBalances(
    {
      q: symbol?.toUpperCase(),
      non_zero_balances: 0,
      with_network,
      type,
    },
    !!symbol,
  );

  return {
    data: data?.result.find(
      (coin) => coin.symbol.toUpperCase() === symbol?.toUpperCase(),
    ),
    isLoading,
  };
}
