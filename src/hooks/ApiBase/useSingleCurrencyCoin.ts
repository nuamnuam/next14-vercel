import { useCurrencyList } from '@/requests/getCurrencyList';

export default function useSingleCurrencyCoin(symbol: string) {
  const { data } = useCurrencyList({
    q: symbol?.toUpperCase(),
  });

  return data?.result.find(
    (coin) => coin.symbol.toUpperCase() === symbol?.toUpperCase(),
  );
}
