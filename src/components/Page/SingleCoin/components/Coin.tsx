import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useCoinIcon, useSingleCurrencyMarket } from '@/hooks';
import { toPrice } from '@/utils';

import { renderChip } from '../../Market/CoinsTable/Market';

type Props = {
  symbol: string;
};

const Coin: FC<Props> = ({ symbol }) => {
  const getCoinIcon = useCoinIcon();

  const { data, isLoading } = useSingleCurrencyMarket({
    baseAsset: symbol,
    providerType: 'otc',
  });

  if (isLoading) return <></>;

  return (
    <Link
      key={data.pair_id}
      href={`/${data.baseAssetSlug.toLowerCase()}`}
      className="flex gap-2 py-4 border-t border-t-dark-100"
    >
      <Image
        height={32}
        width={32}
        src={getCoinIcon(data.baseAsset)}
        alt={data.baseAsset}
        onError={(e) => {
          //@ts-ignore
          e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
        }}
      />
      <div className="flex flex-col flex-1 justify-center gap-2">
        <h3 className="flex items-center justify-start gap-x-2 text-sm font-medium text-dark-700">
          {data.faBaseAsset}
          <span className="text-xs font-normal text-dark-500">
            {data.baseAsset}
          </span>
        </h3>
        <span className="text-xs font-normal text-dark-500">
          {data.enBaseAsset}
        </span>
      </div>
      <div className="flex flex-col justify-between items-end gap-2">
        {data.stats?.['24h_ch'] ? renderChip(data.stats?.['24h_ch']) : null}
        <div className="flex gap-1 items-end">
          <span className="text-sm text-dark-700">
            {toPrice(data.stats?.lastPrice)}
          </span>
          <span className="text-xxs font-normal text-dark-500">IRT</span>
        </div>
      </div>
    </Link>
  );
};

export default Coin;
