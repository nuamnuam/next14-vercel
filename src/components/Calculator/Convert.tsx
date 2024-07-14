import { useBreakpoint, useLang } from '@/hooks';
import { ICurrencyModel } from '@/types/currency';
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
  convertSide: 'BUY' | 'SELL';
  isLoading: boolean;
  onQuoteValueChange: (amount: number) => void;
  onAssetValueChange: (amount: number) => void;
  onAssetSelect: (coin: ICurrencyModel) => void;
  onSwitchClick: (sourceTab: 'BUY' | 'SELL' | 'CONVERT') => void;
  setConvertSide: (side: 'BUY' | 'SELL') => void;
  onSubmit: () => void;
}

const Convert: React.FC<Props> = ({
  quote,
  quoteValue,
  quoteDecimal,
  asset,
  assetValue,
  assetDecimal,
  assetPrice,
  convertSide,
  isLoading,
  onQuoteValueChange,
  onAssetValueChange,
  onAssetSelect,
  onSwitchClick,
  onSubmit,
}) => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();

  const quoteInput = () => {
    return (
      <TwinInput
        label={convertSide === 'SELL' ? wallet.convertTo : wallet.convertFrom}
        value={quoteValue}
        setValue={onQuoteValueChange}
        decimal={quoteDecimal}
        selectedCoin={quote}
      />
    );
  };

  const assetInput = () => {
    return (
      <TwinInput
        type={isDesktop ? 'dropdown' : 'modal'}
        content="currency"
        label={convertSide === 'SELL' ? wallet.convertFrom : wallet.convertTo}
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
        ignoredCoins={['IRT', 'USDT']}
      />
    );
  };

  return (
    <div>
      {convertSide === 'SELL' ? assetInput() : quoteInput()}
      <div className="flex justify-center my-4">
        <IconButton
          className="border-dark-200"
          onClick={() => onSwitchClick('CONVERT')}
          icon={
            <Icon
              icon="ConvertReverse-Filled"
              size={16}
              className="text-dark-200"
            />
          }
        />
      </div>
      {convertSide === 'SELL' ? quoteInput() : assetInput()}
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
        {wallet.startConvert}
      </Button>
    </div>
  );
};

export default Convert;
