import React from 'react';
import QRCode from 'react-qr-code';
import { useDepositAddress } from '@/requests/panel/wallet/deposit/getDepositAddress';
import { useDepositStore } from '@/store';
import { Alert, Spinner, StaticInput } from '@/components/Common';
import { useCoinIcon, useLang } from '@/hooks';

const DedicatedNetwork = () => {
  const [wallet] = useLang(['wallet']);

  const getCoinIcon = useCoinIcon();

  const { address, tag, selectedCoin, selectedNetwork } = useDepositStore(
    (state) => ({
      address: state.address,
      tag: state.tag,
      selectedCoin: state.selectedCoin,
      selectedNetwork: state.selectedNetwork,
      depositValue: state.depositValue,
      expiredAt: state.expiredAt,
      setSelectedCoin: state.setSelectedCoin,
      setSelectedNetwork: state.setSelectedNetwork,
      setDepositValue: state.setDepositValue,
    }),
  );

  const { isPending: isLoading, mutateAsync: getDepositAddress } =
    useDepositAddress();

  if (selectedNetwork && isLoading)
    return (
      <div className="mt-10 flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      {selectedNetwork && (
        <>
          <Alert
            message={`${wallet.sendCryptoExecpt} ${selectedCoin?.symbol} ${wallet.lossCrypto}`}
            variant="danger"
            className="mb-8 block lg:hidden"
            hasClose={false}
          />
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
              slug={{
                feature: 'wallet',
                section: 'crypto-deposit',
                step: 'set-blockchain-dedicated',
              }}
              className="lg:hidden"
            />
          )}
        </>
      )}
    </>
  );
};

export default DedicatedNetwork;
