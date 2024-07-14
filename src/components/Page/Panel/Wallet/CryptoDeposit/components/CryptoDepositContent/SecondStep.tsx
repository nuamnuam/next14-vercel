import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';

import {
  Alert,
  Button,
  Clipboard,
  FormGroup,
  FormInput,
  FormLabel,
  Icon,
  IconButton,
  InputAlert,
  ResponsivePageHeader,
  StaticInput,
} from '@/components';
import { useModal } from '@/hooks/useModal';
import { useBreakpoint, useCoinIcon, useLang } from '@/hooks';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useDepositStore, useTransactionHistoryStore } from '@/store';
import { toPrice } from '@/utils';
import { type BalanceCoinModel } from '@/types/wallet';
import { usePostDeposit } from '@/requests/panel/wallet/deposit/postDeposit';

import CryptoDepoitResultModal, {
  cryptoDepositResultModalName,
} from '../CryptoDepoitResultModal';

const SecondStep = () => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const getCoinIcon = useCoinIcon();
  const { showSyncModal, closeSyncModal, isSyncModalOpen } = useModal(
    cryptoDepositResultModalName,
  );
  const { isPending: isLoading, mutateAsync: postDeposit } =
    usePostDeposit(showSyncModal);

  const { set_type, setOperation } = useTransactionHistoryStore();

  useEffect(() => {
    closeSyncModal();
  }, []);

  const {
    selectedCoin,
    selectedNetwork,
    depositValue,
    address,
    tag,
    txid,
    setTxid,
    setSelectedCoin,
  } = useDepositStore();

  useEffect(() => {
    if (selectedCoin) return;
    router.push('/panel/wallet/crypto-deposit');
  }, []);

  useEffect(() => {
    // RESET TXID ON MOUNT AND UNMOUNTING
    // RESET SELECTED COIN ON UNMOUNTING TOO
    setTxid('');
    return () => {
      setTxid('');
      setSelectedCoin(undefined);
    };
  }, []);

  useEffect(() => {
    if (isSyncModalOpen || !txid) return undefined;
    router.back();
  }, [isSyncModalOpen]);

  const submitDepost = useCallback(() => {
    postDeposit();
  }, []);

  return (
    <>
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
      <div className="flex pb-[6rem] lg:pb-0 bg-transparent lg:bg-white lg:shadow-sm rounded-b-lg">
        <div className="mx-auto mt-8 w-full rounded-lg bg-white py-8 px-4 sm:w-[462px] lg:mx-0 lg:mt-0 lg:w-1/2 lg:rounded-none lg:bg-transparent lg:px-10">
          <div className="mb-4">
            <StaticInput
              value={`${wallet.transferCryptoAmount} ${toPrice(
                Number(depositValue),
              )} ${selectedCoin?.symbol} ${wallet.iss}`}
              variant="secondary"
              hasCopy={false}
              rightIcon={
                <Image
                  src={selectedCoin ? getCoinIcon(selectedCoin) : ''}
                  width={24}
                  height={24}
                  alt={selectedCoin?.symbol || 'coin'}
                  onError={(e) => {
                    //@ts-ignore
                    e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                  }}
                />
              }
            />
          </div>
          <div className="mb-4">
            <StaticInput
              value={`${wallet.yourSelectedNetwork} ${selectedNetwork?.title}`}
              variant="secondary"
              hasCopy={false}
              rightIcon={
                <Image
                  src={selectedNetwork ? getCoinIcon(selectedNetwork.slug) : ''}
                  width={24}
                  height={24}
                  alt={selectedNetwork?.slug || ''}
                  onError={(e) => {
                    //@ts-ignore
                    e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                  }}
                />
              }
            />
          </div>

          {!isDesktop && (
            <div className="mb-4">
              <QrCodeScan address={address} selectedCoin={selectedCoin} />
            </div>
          )}
          <div className="mb-4">
            <StaticInput
              value={address}
              align="left"
              label={wallet.arzinjaAddress}
              multiLine
            />
          </div>
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
          <div className="mb-0 lg:mb-8">
            <FormGroup>
              <FormLabel htmlFor="txid" tooltip={wallet.tooltip}>
                <div className="flex w-full justify-between">
                  {wallet.txidHash}
                </div>
              </FormLabel>
              <FormInput
                name="txid"
                placeholder={wallet.enterTxid}
                ltr
                value={txid}
                onChange={setTxid}
                leftIcon={
                  <Clipboard
                    className="mr-2"
                    type="paste"
                    pasteCallback={setTxid}
                  />
                }
                caption={
                  <InputAlert variant="danger" message={wallet.requiredTxid} />
                }
              />
            </FormGroup>
          </div>
          <ModalFooter fullScreen>
            <div className="flex gap-4">
              <Button
                variant="dark"
                size={isDesktop ? 'lg' : 'md'}
                className="w-1/2 lg:w-auto lg:flex-initial lg:px-10 min-w-[140px]"
                isLoading={isLoading}
                onClick={() => {
                  router.back();
                }}
              >
                {wallet.prevStep}
              </Button>
              <Button
                size={isDesktop ? 'lg' : 'md'}
                className="w-1/2 lg:w-auto lg:flex-auto lg:px-10"
                disabled={!txid}
                isLoading={isLoading}
                onClick={submitDepost}
              >
                {wallet.iSentToARzinja}
              </Button>
            </div>
          </ModalFooter>
        </div>
        {isDesktop && (
          <div className="w-1/2 py-8 px-10">
            <QrCodeScan address={address} selectedCoin={selectedCoin} />
          </div>
        )}
      </div>
      {/* {isDesktop && <CryptoDepositHistoryTable />} */}
      <CryptoDepoitResultModal />
    </>
  );
};

const QrCodeScan: React.FC<{
  address?: string;
  selectedCoin?: BalanceCoinModel;
}> = ({ address, selectedCoin }) => {
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
        <QRCode size={152} value={address} />
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
      <span className="mt-2 text-xs text-dark-600 lg:mb-4">
        {wallet.scanAddress}
      </span>
      <div className="hidden lg:block">
        <Alert
          message={`${wallet.sendCryptoExecpt} ${selectedCoin.symbol} ${wallet.lossCrypto}`}
          variant="danger"
          hasClose={false}
        />
      </div>
    </div>
  );
};

export default SecondStep;
