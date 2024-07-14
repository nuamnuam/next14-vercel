import React from 'react';
import clsx from 'classnames';

import { CheckBox, EmptyTable } from '@/components';
import { toPrice, toStraightNumber } from '@/utils';
import { ISmallAssetItem } from '@/types/wallet';
import { useSmallAssetsStore } from '@/store';
import { useLang } from '@/hooks';

interface Props {
  items?: ISmallAssetItem[];
}
export type CoinType = {
  name: string;
  symbol: string;
  label: string;
  value: number;
  usdtValue: number;
};

const SmartConvertTable: React.FC<Props> = ({ items }) => {
  const [wallet] = useLang(['wallet']);

  const { target, selectAll, selectedAssets, setSelectedAssets, setSelectAll } =
    useSmallAssetsStore((state) => ({
      target: state.target,
      selectedAssets: state.selectedAssets,
      selectAll: state.selectAll,
      setSelectedAssets: state.setSelectedAssets,
      setSelectAll: state.setSelectAll,
    }));

  const handleSelectAll = (status: boolean) => {
    setSelectAll(status);
    if (status && items) {
      setSelectedAssets(items);
    } else {
      setSelectedAssets([]);
    }
  };

  const handleChangeSingle = (status: boolean, item: ISmallAssetItem) => {
    const currentAssets = [...selectedAssets];
    if (status) currentAssets.push(item);
    else {
      const indexOfItem = currentAssets.findIndex(
        (i) => i.currency_id === item.currency_id,
      );
      indexOfItem > -1 && currentAssets.splice(indexOfItem, 1);
    }
    setSelectedAssets(currentAssets);

    if (items && currentAssets.length === items.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  return (
    <div
      className={clsx('h-[310px] overflow-y-auto', !items?.length && '!h-fit')}
    >
      <table className="w-full">
        <thead className="sticky top-0 z-[1]">
          <tr className="h-12 bg-dark-50 px-2">
            <th className="w-4/12 pr-2 pl-1 text-right text-xs font-normal text-dark-600 md:w-1/2">
              <CheckBox
                label={
                  <span className="mr-2 text-xs">{wallet.currencyName}</span>
                }
                isChecked={selectAll}
                handleInputChange={handleSelectAll}
              />
            </th>
            <th className="w-4/12 px-2 text-xs font-normal text-dark-600 md:w-1/4">
              {wallet.available}
            </th>
            <th className="w-4/12 px-2 text-xs font-normal text-dark-600 md:w-1/4">
              {wallet.estimate}/{target === 'USDT' ? 'USDT' : wallet.toman}
            </th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => (
            <tr
              className="h-16 border-b border-dark-50 font-normal"
              key={index}
            >
              <td className="pr-2 pl-1 text-right">
                <CheckBox
                  name={item.symbol}
                  isChecked={selectedAssets.includes(item) || selectAll}
                  label={
                    <div className="mr-2 flex flex-col">
                      <span className="text-sm font-medium leading-6 text-dark-700">
                        {item.symbol}
                      </span>
                      <span className="text-xs leading-5 text-dark-500">
                        {item.title?.length > 7
                          ? item.title?.slice(0, 7) + ' ...'
                          : item.title}
                      </span>
                    </div>
                  }
                  handleInputChange={(status) => {
                    handleChangeSingle(status, item);
                  }}
                />
              </td>
              <td className="px-1 text-center text-xs text-dark-400">
                {toPrice(item.balance_available)}
              </td>
              <td className="text-center text-xs text-dark-400">
                {toPrice(
                  target === 'USDT'
                    ? toStraightNumber(
                        Number(item?.estimated_usdt).toFixed(2) || 0,
                      )
                    : toStraightNumber(
                        Number(item?.estimated_irt).toFixed(0) || 0,
                      ),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items?.length ? <EmptyTable /> : null}
    </div>
  );
};

export default SmartConvertTable;
