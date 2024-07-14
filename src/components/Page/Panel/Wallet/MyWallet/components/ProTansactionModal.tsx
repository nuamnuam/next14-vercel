import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import {
  Chip,
  DoubleCoin,
  DoubleText,
  EmptyTable,
  Icon,
  ListLoader,
  Modal,
} from '@/components';
import { useModal } from '@/hooks/useModal';
import { fixFloatingNum, toPrice } from '@/utils';
import { useCoinIcon, useInfinitescroll } from '@/hooks';
import { BalanceCoinModel, IAdvanceMarkeResponse } from '@/types/wallet';
import { useInfinitePairsQuery } from '@/requests/advance-market/pairsQuery';

export const proTransactionModalName = 'pro-tranaction-modal';

const ProTansactionModal: React.FC<{ data?: BalanceCoinModel }> = ({
  data,
}) => {
  const { isSyncModalOpen, closeSyncModal } = useModal(proTransactionModalName);
  const [pairs, setPairs] = useState<IAdvanceMarkeResponse[] | undefined>([]);
  const getCoinIcon = useCoinIcon();
  const router = useRouter();

  const pairQueryParams = useMemo(() => {
    if (!data?.symbol) return {};
    return {
      exists_symbol: data.symbol,
    };
  }, [data]);

  const {
    data: pairsData,
    isLoading,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useInfinitePairsQuery({ ...pairQueryParams, enabled: isSyncModalOpen });

  const { ref, page } = useInfinitescroll(
    pairsData?.pages?.[0].pagination.total_pages || 1,
  );

  useEffect(() => setPairs(pairsData?.pages), [pairsData]);

  useEffect(() => {
    if (hasNextPage) fetchNextPage();
  }, [page]);

  const transformedData = useCallback(() => {
    return pairs
      ?.map((pair) => {
        return pair.result.map((item, idx) => {
          const { enName, faName, stats, baseAsset, quoteAsset } =
            Object.values(item)?.[0];
          return (
            <div
              className="flex items-center justify-between border-b border-dark-50 py-4 cursor-pointer"
              key={idx}
              onClick={async () =>
                await router.push(
                  `/panel/advance-trade/${baseAsset}${quoteAsset}`,
                )
              }
            >
              <div className="flex items-center gap-2 w-1/4">
                <DoubleCoin
                  size="md"
                  topIcon={
                    <Image
                      src={getCoinIcon(baseAsset)}
                      width={24}
                      height={24}
                      alt={baseAsset}
                      onError={(e) => {
                        //@ts-ignore
                        e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                      }}
                    />
                  }
                  bottomIcon={
                    <Image
                      src={getCoinIcon(quoteAsset)}
                      width={24}
                      height={24}
                      alt={quoteAsset}
                      onError={(e) => {
                        //@ts-ignore
                        e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                      }}
                    />
                  }
                />
                <DoubleText
                  firstText={baseAsset}
                  secondText={quoteAsset}
                  size="md"
                  classNames="[&>div]:!text-dark-700 !text-dark-700"
                />
              </div>
              <span className="flex-1 text-center text-sm font-medium text-dark-700 w-1/2">
                {toPrice(fixFloatingNum(stats.lastPrice, 4))}
              </span>
              <div className="flex justify-end w-1/4">
                <Chip
                  classNames="px-[10px] w-fit"
                  label={
                    <div className="flex items-center !font-normal">
                      <span className="ml-1 dir-ltr">
                        ٪{toPrice(fixFloatingNum(stats['24h_ch'], 2))}
                      </span>
                      <Icon
                        icon={
                          stats['24h_ch'] > 0
                            ? 'ArrowTop-TwoTone'
                            : 'ArrowDown-TwoTone'
                        }
                        size={16}
                        className={
                          stats['24h_ch'] > 0
                            ? '[&>*]:fill-primary-500'
                            : '[&>*]:fill-danger-400'
                        }
                      />
                    </div>
                  }
                  variant={stats['24h_ch'] > 0 ? 'success' : 'danger'}
                />
              </div>
            </div>
          );
        });
      })
      .flat(1);
  }, [pairs, isLoading]);

  return (
    <Modal
      sync
      name={proTransactionModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!pt-8"
    >
      <>
        {transformedData()}
        {(hasNextPage || isFetching) && (
          <div className="flex justify-center py-20">
            <ListLoader ref={ref} />
          </div>
        )}
        {!transformedData()?.length && !isFetching && <EmptyTable />}
      </>
    </Modal>
  );
};

export default ProTansactionModal;
