import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  Button,
  Card,
  GuideButton,
  Icon,
  Spinner,
} from '@/components/Common';
import TetherIcon from '@/components/Icons/TetherIcon';
import TomanIcon from '@/components/Icons/TomanIcon';
import RadioGroup from '@/components/RadioGroup';
import { useBreakpoint, useLang } from '@/hooks';
import { toPersianDigits, toPrice, toStraightNumber } from '@/utils';
import { useRouter } from 'next/router';
import SmartConvertTable from './SmallConvertTable';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useGetSmallAssets } from '@/requests/panel/wallet/getSmallAssets';
import { useSmallAssetsStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import ConfirmSmallAssetsModal, {
  confirmSmallAssetsModalName,
} from './ConfirmSmallAssetsModal';
import { smallAssetsSuccessModalName } from './SmallAssetsSuccessModal';
import { smallAssetsFailedModalName } from './SmallAssetsFailedModal';

const SmallConvertContent: React.FC = () => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();
  const router = useRouter();

  const { showSyncModal: showConfirmModal, closeSyncModal: closeConfirmModal } =
    useModal(confirmSmallAssetsModalName);

  const { closeSyncModal: closeSuccessModal } = useModal(
    smallAssetsSuccessModalName,
  );

  const { closeSyncModal: closeFailedModal } = useModal(
    smallAssetsFailedModalName,
  );

  const { data, isLoading } = useGetSmallAssets();

  const { target, selectedAssets, setTarget, resetState } =
    useSmallAssetsStore();

  const sumValue = useMemo(() => {
    let sum = 0;
    if (target === 'USDT') {
      selectedAssets.forEach((coin) => {
        sum += +coin.estimated_usdt;
      });
      return Number(toStraightNumber(sum.toFixed(2)));
    }
    selectedAssets.forEach((coin) => {
      sum += +coin.estimated_irt;
    });
    return Number(toStraightNumber(sum.toFixed(0)));
  }, [selectedAssets, target]);

  const isDisabled = useMemo(() => {
    if (target === 'USDT') {
      return (
        !data?.result.min_conversion_usdt ||
        (!!data?.result.min_conversion_usdt &&
          sumValue < data.result.min_conversion_usdt)
      );
    }
    return (
      !data?.result.min_conversion_irt ||
      (!!data?.result.min_conversion_irt &&
        sumValue < data.result.min_conversion_irt)
    );
  }, [sumValue, data]);

  useEffect(() => {
    resetState();
    return () => {
      closeFailedModal(() => closeSuccessModal(() => closeConfirmModal()));
    };
  }, []);

  return (
    <div className="pb-[8rem] lg:pb-0">
      {isDesktop && (
        <div className="mb-8 flex items-center justify-between">
          <span
            className="flex cursor-pointer items-center"
            onClick={() => {
              router.back();
            }}
          >
            <Icon icon="Right-OutLined" className="text-dark-200" size={20} />
            <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
              {wallet.convertSmallAssets}
            </h1>
          </span>
          <GuideButton />
        </div>
      )}
      <div className="mx-auto max-w-[462px] lg:mx-0 lg:w-1/2">
        <Alert
          slug={{
            feature: 'wallet',
            section: 'my-wallet-change-small-asset',
            step: 'change-small-asset',
          }}
        />
        <Card classNames="py-6 px-4 sm:py-6 sm:px-8">
          <div className="mb-4 sm:mb-6">
            <RadioGroup
              defaultSelected="USDT"
              onChange={setTarget}
              switchTheme
              options={[
                {
                  value: 'USDT',
                  key: 'USDT',
                  label: (
                    <div className="flex items-center justify-center">
                      <TetherIcon />
                      <span className="mx-2 inline-block text-sm font-medium text-dark-700">
                        {wallet.tether}
                      </span>
                      <span className="inline-block text-xxs text-dark-500">
                        USDT
                      </span>
                    </div>
                  ),
                },
                {
                  key: 'IRT',
                  value: 'IRT',
                  label: (
                    <div className="flex items-center justify-center">
                      <TomanIcon />
                      <span className="mx-2 inline-block text-sm font-medium text-dark-700">
                        {wallet.toman}
                      </span>
                      <span className="inline-block text-xxs text-dark-500">
                        IRT
                      </span>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <>
              <SmartConvertTable items={data?.result.assets} />
              <Alert
                variant={isDisabled ? 'danger' : 'info'}
                className="my-[18px]"
                message={
                  target === 'USDT'
                    ? `${wallet.minConvertAmount} ${toPrice(
                        data?.result.min_conversion_usdt ?? 0,
                      )} ${wallet.isTether}`
                    : `${wallet.minConvertAmount} ${toPrice(
                        data?.result.min_conversion_irt ?? 0,
                      )} ${wallet.isToman}`
                }
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-300">
                  {wallet.estimatedAmount}
                  <span className="mx-1 font-medium text-dark-600">
                    {toPersianDigits(selectedAssets.length)}
                  </span>
                  {wallet.selectedCoin}
                </span>
                <span className="text-sm font-bold text-dark-600">
                  {toPrice(sumValue)}{' '}
                  {target === 'USDT' ? 'USDT' : wallet.toman}
                </span>
              </div>
            </>
          )}
          <ModalFooter fullScreen>
            <Button
              size={isDesktop ? 'lg' : 'md'}
              fullWidth
              disabled={isDisabled}
              onClick={() => showConfirmModal()}
              className="lg:mt-8"
            >
              {wallet.doConvert}
            </Button>
          </ModalFooter>
        </Card>
      </div>
      <ConfirmSmallAssetsModal data={data?.result} sum={sumValue} />
    </div>
  );
};

export default SmallConvertContent;
