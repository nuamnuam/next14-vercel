import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';

import { Button, Icon, IconButton, Modal, Spinner } from '@/components/Common';
import { showToast } from '@/components/ToastProvider';
import { useFavoriteCurrencyMutation } from '@/requests/market/favoriteCurrenyMutation';
import { useModal } from '@/hooks/useModal';
import { useCurrencySingle } from '@/requests/single-coin';
import { useLang } from '@/hooks';

import SingleCoinContent from '.';

export const singleCoinDetailModalName = 'single-coin-detail-modal';

type Props = {
  asset: string;
  slug: string;
};

const SingleCoinContentModal: React.FC<Props> = ({ asset, slug }) => {
  const [market] = useLang(['market']);

  const [favorite, setFavorite] = useState<boolean>(false);

  const router = useRouter();

  const { closeModal } = useModal(singleCoinDetailModalName);

  const { mutateAsync } = useFavoriteCurrencyMutation();
  const { data, isLoading } = useCurrencySingle(asset);

  const coin = useMemo(() => {
    return data?.result;
  }, [data]);

  useEffect(() => {
    if (coin) setFavorite(coin?.favorite);
  }, [coin?.favorite]);

  const toggleFavorite = async () => {
    try {
      mutateAsync({ symbol: asset });
      setFavorite(!favorite);
    } catch (error) {
      showToast.error(market.errorOccured);
    }
  };

  return (
    <Modal
      name={singleCoinDetailModalName}
      onClose={closeModal}
      hasCloseAction={false}
      contentAddtionalClassNames="md:!px-4 md:!pt-4 !px-0 !pt-0"
      headerClassNames="text-dark-600 !px-2 !py-4"
      fullScreen
      hasHelp={false}
      title={`${market.details}  ${asset}`}
      extra={
        <div className="flex gap-4">
          <IconButton
            icon={
              <Icon
                icon={favorite ? 'Star-Filled' : 'Star-OutLined'}
                size={20}
                color={false ? '#00CB8C' : '#373B4F'}
                className={clsx(
                  favorite
                    ? 'text-primary-600 [&>*]:text-primary-600'
                    : 'text-dark-600 [&>*]:text-dark-600',
                )}
              />
            }
            size="lg"
            className={clsx(
              'border-dark-200 hover:!border-dark-200',
              favorite && 'border-primary-600 hover:!border-primary-600',
            )}
            onClick={toggleFavorite}
          />
          <Button
            variant="secondary"
            onClick={() => window.open(`/${slug}`, '_blank')}
          >
            {market.about} {asset}
          </Button>
        </div>
      }
      footer={
        <div className="flex gap-4">
          <Button
            fullWidth
            className="flex-1"
            onClick={async () =>
              await router.push(`/panel/instant-trade/buy?asset=${asset}`)
            }
          >
            {market.buy}
          </Button>
          <Button
            fullWidth
            className="bg-danger-500 border-danger-500 hover:bg-danger-600 focus:border-danger-600 focus:bg-danger-600 hover:border-danger-600 flex-1"
            onClick={async () =>
              await router.push(`/panel/instant-trade/sell?asset=${asset}`)
            }
          >
            {market.sell}
          </Button>
          <Button
            fullWidth
            className="flex-1"
            variant="dark"
            onClick={async () =>
              await router.push(`/panel/instant-trade/convert?asset=${asset}`)
            }
          >
            {market.convert}
          </Button>
        </div>
      }
    >
      {coin ? (
        <div className="flex flex-col gap-4">
          <SingleCoinContent coin={coin} isLoading={isLoading} />
        </div>
      ) : (
        <div className="flex w-full justify-center items-center p-4">
          <Spinner />
        </div>
      )}
    </Modal>
  );
};

export default SingleCoinContentModal;
