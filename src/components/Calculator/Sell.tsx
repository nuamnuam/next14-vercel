import { ICurrencyModel } from '@/types/currency';
import { useBreakpoint, useLang } from '@/hooks';
import { convertScientific, toPrice } from '@/utils';

import { Button, Icon, IconButton, Spinner } from '../Common';
import TwinInput from '../Common/TwinInput';

interface Props {
  quote?: ICurrencyModel;
  quoteValue?: number;
  quoteDecimal: number;
  asset?: ICurrencyModel;
  assetValue?: number;
  assetDecimal: number;
  assetPrice: number;
  isLoading: boolean;
  onQuoteValueChange: (amount: number) => void;
  onAssetValueChange: (amount: number) => void;
  onAssetSelect: (coin: ICurrencyModel) => void;
  onSwitchClick: (sourceTab: 'BUY' | 'SELL' | 'CONVERT') => void;
  onSubmit: () => void;
}

const Sell: React.FC<Props> = ({
  quote,
  quoteValue,
  quoteDecimal,
  asset,
  assetValue,
  assetDecimal,
  assetPrice,
  isLoading,
  onQuoteValueChange,
  onAssetValueChange,
  onAssetSelect,
  onSwitchClick,
  onSubmit,
}) => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();

  return (
    <div>
      <TwinInput
        type={isDesktop ? 'dropdown' : 'modal'}
        content="currency"
        label={`${wallet.sell}:`}
        hasList
        value={assetValue}
        setValue={onAssetValueChange}
        decimal={assetDecimal}
        otcTradeable={true}
        selectedCoin={{
          ...asset,
          title: asset?.title
            ? asset.title.length > 7
              ? `${asset.title.slice(0, 7)}...`
              : asset.title
            : '',
        }}
        setSelectedCoin={onAssetSelect}
        ignoredCoins={['IRT']}
      />
      <div className="flex justify-center my-4">
        <IconButton
          onClick={() => onSwitchClick('SELL')}
          icon={
            <Icon
              icon="ConvertReverse-Filled"
              size={16}
              className="text-dark-200"
            />
          }
        />
      </div>
      <TwinInput
        label={`${wallet.receivedAmount}:`}
        value={quoteValue}
        setValue={onQuoteValueChange}
        decimal={quoteDecimal}
        selectedCoin={quote}
      />

      <span className="flex justify-center text-xs text-dark-600 my-4 block text-center">
        {assetPrice && !isLoading ? (
          <span className="block dir-ltr transition-all duration-700">{`۱ ${
            asset?.symbol || ''
          } = ${toPrice(convertScientific(assetPrice ?? 0) || 0)} ${
            quote?.symbol || ''
          }`}</span>
        ) : (
          <Spinner type="secondary" />
        )}
      </span>
      <Button variant="dark" fullWidth onClick={onSubmit}>
        {wallet.startSell}
      </Button>
    </div>
  );
};

export default Sell;
