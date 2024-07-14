import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';
import { ICurrencyModel } from '@/types/currency';
import { ITransactionDetails, type BalanceCoinModel } from '@/types/wallet';

export default function useCoinIcon() {
  const currencyIconBaseUrl = useSettingValue(SETTINGS.CURRENCY_ICON_BASE_URL);

  return function getCoinIcon(
    coin: BalanceCoinModel | ITransactionDetails | ICurrencyModel | string,
  ) {
    if (!coin) return '';

    let coinSymbol = '';

    if (typeof coin !== 'string') {
      if ('symbol' in coin) {
        coinSymbol = coin.symbol;
      }
      if ('currency_symbol' in coin) {
        coinSymbol = coin.currency_symbol;
      }
    } else {
      coinSymbol = coin;
    }
    if (currencyIconBaseUrl) return `${currencyIconBaseUrl}/${coinSymbol}.svg`;
    return '';
  };
}
