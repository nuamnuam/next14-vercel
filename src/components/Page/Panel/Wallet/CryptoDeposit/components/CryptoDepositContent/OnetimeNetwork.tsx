import React, { useCallback, useMemo, useState } from 'react';
import QRCode from 'react-qr-code';
import { useDepositAddress } from '@/requests/panel/wallet/deposit/getDepositAddress';
import { useDepositStore } from '@/store';
import {
  Alert,
  Button,
  CountDown,
  Spinner,
  StaticInput,
} from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useCoinIcon, useLang } from '@/hooks';

const OnetimeNetwork = () => {
  const [wallet] = useLang(['wallet']);

  const getCoinIcon = useCoinIcon();
  const [showRetry, setShowRetry] = useState(false);

  const { address, tag, selectedCoin, selectedNetwork, expiredAt } =
    useDepositStore((state) => ({
      address: state.address,
      tag: state.tag,
      selectedCoin: state.selectedCoin,
      selectedNetwork: state.selectedNetwork,
      depositValue: state.depositValue,
      expiredAt: state.expiredAt,
      setSelectedCoin: state.setSelectedCoin,
      setSelectedNetwork: state.setSelectedNetwork,
      setDepositValue: state.setDepositValue,
    }));

  const { isPending: isLoading, mutateAsync: getDepositAddress } =
    useDepositAddress();

  const countDownSeconds = useMemo(() => {
    if (!expiredAt) return 60 * 60;
    const expiredMiliseconds = new Date(expiredAt).getTime();
    const nowMiliseconds = new Date().getTime();
    return Math.trunc((expiredMiliseconds - nowMiliseconds) / 1000);
  }, [expiredAt, isLoading]);

  const handleNewAddress = useCallback(() => {
    getDepositAddress();
    setShowRetry(false);
  }, []);

  if (selectedNetwork && isLoading)
    return (
      <div className="mt-10 flex justify-center">
        <Spinner />
      </div>
    );

  if (selectedNetwork && showRetry) {
    return (
      <ModalFooter fullScreen>
        <Button
          className="lg:mt-6"
          size="lg"
          fullWidth
          onClick={handleNewAddress}
        >
          {wallet.createOnetimeAddress}
        </Button>
      </ModalFooter>
    );
  }

  return (
    <>
      {selectedNetwork && address ? (
        <>
          <Alert
            message={`${wallet.sendCryptoExecpt} ${selectedCoin?.symbol} ${wallet.lossCrypto}`}
            variant="danger"
            className="mb-8 block lg:hidden"
            hasClose={false}
          />
          {address && countDownSeconds ? (
            <div className="mt-6 mb-8">
              <CountDown
                onFinished={() => setShowRetry(true)}
                initialTime={countDownSeconds}
              />
            </div>
          ) : null}
          <div className="flex flex-col items-center lg:hidden">
            <div className="rounded-lg border border-dark-100 p-6 relative">
              <QRCode size={152} value={address || ''} />
              {selectedCoin && (
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
              )}
            </div>
            <span className="mt-2 text-xs text-dark-600 mb-4 block">
              {wallet.scanAddress}
            </span>
          </div>
          {address && (
            <div className="mb-4">
              <StaticInput
                value={address}
                align="left"
                label={wallet.arzinjaAddress}
                multiLine
              />
            </div>
          )}
          {tag && (
            <div className="mb-4">
              <StaticInput
                value={tag}
                align="left"
                label={wallet.tagMemo}
                multiLine
              />
            </div>
          )}
          {address && (
            <Alert
              message={
                <span>
                  {wallet.transformedCrypto}{' '}
                  <span className="!text-danger-600">{wallet.auto}</span>{' '}
                  {wallet.willSendYourWallet}
                </span>
              }
              variant="info"
              className="mb-4 block lg:hidden"
              hasClose={false}
            />
          )}
          {address && (
            <Alert
              slug={{
                feature: 'wallet',
                section: 'crypto-deposit',
                step: 'set-blockchain-onetime',
              }}
              className="block lg:hidden"
            />
          )}
        </>
      ) : null}
    </>
  );
};

export default OnetimeNetwork;
