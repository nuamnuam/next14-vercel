import { getBankNameFromCardNumber } from '@persian-tools/persian-tools';

import { type TBank, useBanksQuery } from '@/requests/banks';
import { getLang } from '@/utils';

const useBanks = () => {
  const [global] = getLang(['global']);

  const { data, isLoading } = useBanksQuery();

  const getCardLogo = (value: string) => {
    if (data?.result.length && !isLoading) {
      const bankName = getBankNameFromCardNumber(value?.split(' ').join(''))
        ?.replace(global.bank, '')
        .trim();

      const bankObj: TBank | undefined = data.result.find(({ fa_name }) =>
        fa_name.includes(bankName || ''),
      );
      if (bankObj) {
        return bankObj.logo.colored.replace('azico-', '').trim();
      }
      return '';
    }
    return '';
  };

  const getCardLogoFromBankName = (value: string) => {
    if (data?.result.length && !isLoading) {
      const bankObj: TBank | undefined = data.result.find(({ fa_name }) =>
        fa_name.trim().includes(value.replace(global.bank, '').trim()),
      );
      if (bankObj) {
        return bankObj.logo.colored.replace('azico-', '').trim();
      }
      return '';
    }
    return '';
  };

  const getBanksWithQuickWithdraw = () => {
    if (data?.result.length && !isLoading) {
      return data.result.filter(({ quick_withdrawal }) =>
        Boolean(quick_withdrawal),
      );
    }
    return [];
  };

  return { getCardLogo, getCardLogoFromBankName, getBanksWithQuickWithdraw };
};

export default useBanks;
