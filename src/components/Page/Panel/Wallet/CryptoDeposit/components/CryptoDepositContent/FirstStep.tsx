import React, { useEffect, useMemo } from 'react';
import QRCode from 'react-qr-code';
import {
  Alert,
  Icon,
  IconButton,
  InputAlert,
  ResponsivePageHeader,
  Spinner,
} from '@/components/Common';
import NetworksInputModal from '../NetworksInputModal';
import { toPrice, externalData } from '@/utils';
import { useDepositStore, useTransactionHistoryStore } from '@/store';
import SharedNetwork from './SharedNetwork';
import OnetimeNetwork from './OnetimeNetwork';
import { useDepositAddress } from '@/requests/panel/wallet/deposit/getDepositAddress';
import { NetworkModel, type BalanceCoinModel } from '@/types/wallet';
import {
  useBreakpoint,
  useCoinIcon,
  useLang,
  useSingleBalanceCoin,
} from '@/hooks';
import DedicatedNetwork from './DedicatedNetwork';
import RestrictAlertCTA, {
  NO_KYC_REASON,
} from '@/components/Common/RestrictAlertCTA';
import { useUserLimitations } from '@/requests/panel/wallet/getUserLimitations';
import CryptoDepositHistoryTable from '../CryptoDepositHistoryTable';
import CoinsInputModal from '@/components/Common/Coins/CoinsInputModal';
import { useRouter } from 'next/router';

const FirstStep: React.FC = () => {
  const [wallet] = useLang(['wallet']);

  const {
    selectedCoin,
    selectedNetwork,
    address,
    setSelectedCoin,
    setSelectedNetwork,
    setDepositValue,
    setAddress,
    setTag,
    setExpiredAt,
    resetState,
  } = useDepositStore();

  const { mutateAsync: getDepositAddress } = useDepositAddress();
  const { isLoading, cryptoLimitations } = useUserLimitations();

  const { isDesktop } = useBreakpoint();

  const { data: selectedCoinApiData, isLoading: selectedCoinLoading } =
    useSingleBalanceCoin(selectedCoin?.symbol ?? 'BTC', 1);

  useEffect(() => {
    resetState();
  }, []);

  useEffect(() => {
    const externalCoin = externalData.get();
    if (!externalCoin) return;
    if (externalCoin.symbol === 'IRT') {
      externalData.set(undefined);
      return;
    }
    const resetSelectedCoin = new Promise((resolve) => {
      setSelectedCoin(externalCoin);
      resolve('');
    });

    resetSelectedCoin.then(() => {
      isDesktop && externalData.set(undefined);
    });
  }, []);

  useEffect(() => {
    if (!selectedCoinApiData) return;
    setSelectedCoin(selectedCoinApiData);
  }, [selectedCoinApiData?.symbol]);

  useEffect(() => {
    setSelectedNetwork(undefined);
    setDepositValue(undefined);
    setAddress(undefined);
    setTag(undefined);
    setExpiredAt(undefined);
  }, [selectedCoin]);

  useEffect(() => {
    setDepositValue(undefined);
    setAddress(undefined);
    setTag(undefined);
    setExpiredAt(undefined);
  }, [selectedNetwork]);

  useEffect(() => {
    switch (selectedNetwork?.deposit_type) {
      case NETWORK_TYPES.SHARED:
        setDepositValue(undefined);
        break;
      case NETWORK_TYPES.DEDICATED:
      case NETWORK_TYPES.ONETIME:
        getDepositAddress();
        break;
      default:
        break;
    }
  }, [selectedNetwork]);

  const showQrCode = useMemo(() => {
    return (
      selectedNetwork?.deposit_type === NETWORK_TYPES.ONETIME ||
      selectedNetwork?.deposit_type === NETWORK_TYPES.DEDICATED
    );
  }, [selectedNetwork]);

  const showQrCodeWarning = useMemo(() => {
    return selectedNetwork?.deposit_type === NETWORK_TYPES.ONETIME;
  }, [selectedNetwork]);

  const depositIsEnabled = useMemo(() => {
    return selectedCoin && selectedCoin.is_depositable && selectedCoin.networks;
  }, [selectedCoin]);

  const coinNetworks = useMemo(() => {
    const networks: NetworkModel[] = [];
    if (!selectedCoin || !selectedCoin.networks) return networks;
    Object.values(selectedCoin.networks).forEach((network: NetworkModel) => {
      networks.push({
        ...network,
        is_selectable: true,
      });
    });
    return networks;
  }, [selectedCoin]);

  if (isLoading)
    return (
      <>
        <PageHeader />
        <div className="flex items-center justify-center py-12 bg-transparent lg:bg-white shadow-sm rounded-b-lg">
          <Spinner className="mt-6" />
        </div>
      </>
    );

  if (!cryptoLimitations?.deposit.status) {
    return (
      <>
        <PageHeader />
        <div className="mx-auto lg:mx-0 sm:w-[462px] lg:w-full my-6 lg:my-0 lg:px-10 lg:py-8 bg-transparent lg:bg-white shadow-sm rounded-b-lg">
          {cryptoLimitations?.deposit.reason === NO_KYC_REASON ? (
            <RestrictAlertCTA />
          ) : (
            <Alert variant="danger" message={cryptoLimitations?.deposit.text} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader />
      <div className="flex w-full pb-[6rem] lg:pb-0 lg:bg-white lg:shadow-sm rounded-b-lg px-4 lg:px-0">
        <div className="mx-auto mt-6 w-full sm:w-[462px] lg:mx-0 lg:mt-0 lg:w-1/2 lg:py-8 lg:px-10">
          <Alert
            slug={{
              feature: 'wallet',
              section: 'crypto-deposit',
              step: 'set-coin',
            }}
          />
          <div className="rounded-lg bg-white py-8 px-4 lg:rounded-none lg:bg-transparent lg:p-0">
            <div className="mb-4">
              <CoinsInputModal
                selectedCoin={selectedCoin}
                onChange={setSelectedCoin}
                type="deposit"
                showAllItem={false}
              />
            </div>
            {selectedCoinLoading && !selectedCoin && (
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            )}
            {!depositIsEnabled && selectedCoin && !selectedCoinLoading && (
              <div className="mb-4">
                <Alert
                  slug={{
                    feature: 'wallet',
                    section: 'crypto-deposit-error',
                    step: 'error',
                  }}
                />
              </div>
            )}
            {depositIsEnabled && selectedCoin?.networks && (
              <>
                <div className="mb-4">
                  <NetworksInputModal
                    deposit
                    showFee={false}
                    showIcon={false}
                    data={coinNetworks}
                    selectedNetwork={selectedNetwork}
                    onSelect={setSelectedNetwork}
                    caption={
                      <div className="flex flex-col items-start gap-2">
                        {selectedNetwork && selectedNetwork.min_deposit > 0 ? (
                          <InputAlert
                            message={`${wallet.minDeposit} ${toPrice(
                              selectedNetwork.min_deposit,
                            )} ${selectedCoin.symbol} ${wallet.is}`}
                            className="mt-2"
                          />
                        ) : null}
                        {selectedNetwork && +selectedNetwork.deposit_fee > 0 ? (
                          <InputAlert
                            message={`${wallet.depositFee} ${toPrice(
                              selectedNetwork.deposit_fee,
                            )} ${selectedCoin.symbol} ${wallet.is}`}
                          />
                        ) : null}
                      </div>
                    }
                  />
                </div>
              </>
            )}
            {
              {
                [NETWORK_TYPES.SHARED]: <SharedNetwork />,
                [NETWORK_TYPES.DEDICATED]: <DedicatedNetwork />,
                [NETWORK_TYPES.ONETIME]: <OnetimeNetwork />,
              }[selectedNetwork?.deposit_type || NETWORK_TYPES.SHARED]
            }
          </div>
        </div>
        {isDesktop && showQrCode && (
          <div className="w-1/2 py-8 px-10">
            <QrCodeScan
              address={address}
              selectedCoin={selectedCoin}
              showWarning={showQrCodeWarning}
            />
          </div>
        )}
      </div>
      {isDesktop && <CryptoDepositHistoryTable />}
    </>
  );
};

const QrCodeScan: React.FC<{
  address?: string;
  selectedCoin?: BalanceCoinModel;
  showWarning?: boolean;
}> = ({ address, selectedCoin, showWarning }) => {
  const [wallet] = useLang(['wallet']);

  const getCoinIcon = useCoinIcon();

  if (!address || !selectedCoin) return <></>;
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="mb-4 block lg:hidden">
        <Alert
          message={`${wallet.sendCryptoExecpt} ${selectedCoin.symbol} ${wallet.lossCrypto}`}
          variant="danger"
        />
      </div>
      <div className="rounded-lg border border-dark-100 p-6 relative">
        <QRCode size={152} value={address || ''} />
        <div className="absolute w-full h-full left-0 top-0 flex items-center justify-center">
          <div className="rounded-3xl border-[4px] border-white">
            <img
              src={getCoinIcon(selectedCoin)}
              width={32}
              height={32}
              alt={selectedCoin?.symbol || ''}
              onError={(e) => {
                //@ts-ignore
                e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
              }}
            />
          </div>
        </div>
      </div>
      <span className="mt-2 text-xs text-dark-600 lg:mb-4">
        {wallet.scanAddress}
      </span>
      <div>
        <Alert
          message={`${wallet.sendCryptoExecpt} ${selectedCoin.symbol} ${wallet.lossCrypto}`}
          variant="danger"
          className="mb-4"
          hasClose={false}
        />
        <Alert
          slug={{
            feature: 'wallet',
            section: 'crypto-deposit',
            step: 'set-blockchain-dedicated',
          }}
        />
        {showWarning && (
          <Alert
            slug={{
              feature: 'wallet',
              section: 'crypto-deposit',
              step: 'set-blockchain-onetime',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FirstStep;

export const NETWORK_TYPES = {
  SHARED: 'shared',
  DEDICATED: 'dedicated',
  ONETIME: 'onetime',
};

const PageHeader = () => {
  const [wallet] = useLang(['wallet']);

  const router = useRouter();
  const { set_type, setOperation } = useTransactionHistoryStore();

  return (
    <ResponsivePageHeader
      title={wallet.depositCrypto}
      onBack={() => router.back()}
      extra={
        <IconButton
          className="border-dark-200 text-dark-600"
          size="lg"
          icon={<Icon icon="History-OutLined" size={16} />}
          onClick={() => {
            setOperation('deposit');
            set_type('crypto');
            router.push('/panel/wallet/transactions-list');
          }}
        />
      }
    />
  );
};
