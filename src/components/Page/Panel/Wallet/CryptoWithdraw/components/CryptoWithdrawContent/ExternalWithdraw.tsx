import {
  Clipboard,
  FormGroup,
  FormInput,
  FormLabel,
  InputAlert,
} from '@/components/Common';
import NetworksInputModal from '../NetworksInputModal';
import WithdrawValueInput from '../WithdrawValueInput';
import { useCryptoWithdrawStore } from '@/store';
import { useEffect, useMemo } from 'react';
import { NetworkModel } from '@/types/wallet';
import { toPrice, toStraightNumber } from '@/utils';
import clsx from 'classnames';
import { useLang } from '@/hooks';

const ExternalWithdraw = () => {
  const [wallet] = useLang(['wallet']);

  const {
    selectedCoin,
    selectedNetwork,
    address,
    tag,
    withdrawValue,
    setSelectedNetwork,
    setAddress,
    setTag,
  } = useCryptoWithdrawStore();

  const validAddressNetwors = useMemo(() => {
    const validNetworks: NetworkModel[] = [];
    if (
      !address ||
      !selectedCoin?.networks ||
      !Object.keys(selectedCoin?.networks).length
    )
      return validNetworks;

    Object.values(selectedCoin.networks).forEach((network: NetworkModel) => {
      const addressRegex = new RegExp(network?.address_regex);
      if (network.is_withdrawable && addressRegex.test(address)) {
        validNetworks.push(network);
      }
    });

    return validNetworks;
  }, [selectedCoin, address]);

  const isValidAddress = useMemo(() => {
    if (!address || !selectedCoin?.networks || !selectedCoin?.networks)
      return false;

    return validAddressNetwors.length > 0;
  }, [address, selectedNetwork]);

  const isValidTag = useMemo(() => {
    if (!selectedNetwork?.memo_regex || !tag) return false;
    const memoRegex = new RegExp(selectedNetwork.memo_regex);
    return memoRegex.test(tag);
  }, [tag, selectedNetwork]);

  const coinNetworks = useMemo(() => {
    const networks: NetworkModel[] = [];
    if (!selectedCoin || !selectedCoin.networks) return networks;
    Object.values(selectedCoin.networks).forEach((network: NetworkModel) => {
      networks.push({
        ...network,
        is_selectable: validAddressNetwors.includes(network),
      });
    });
    return networks;
  }, [selectedCoin, address]);

  useEffect(() => {
    if (!validAddressNetwors.length) return;
    if (
      validAddressNetwors.length === 1 &&
      validAddressNetwors[0].is_withdrawable
    ) {
      setSelectedNetwork(validAddressNetwors[0]);
    }
  }, [validAddressNetwors, address]);

  useEffect(() => {
    if (selectedNetwork) setSelectedNetwork(undefined);
  }, [address]);

  return (
    <>
      <div className="mb-4">
        <FormGroup>
          <FormLabel htmlFor="address">
            <div className="flex w-full justify-between">
              {wallet.targetAddress}
            </div>
          </FormLabel>
          <FormInput
            name="address"
            placeholder={wallet.enterAddress}
            onChange={setAddress}
            value={address}
            className={clsx(isValidAddress && '[&_input]:bg-primary-50')}
            ltr
            error={!!address && !isValidAddress}
            success={isValidAddress}
            leftIcon={
              <Clipboard
                className="mr-2"
                type="paste"
                pasteCallback={setAddress}
              />
            }
            caption={
              isValidAddress ? (
                <InputAlert variant="success" message={wallet.validAddress} />
              ) : (
                !!address && (
                  <InputAlert
                    variant="danger"
                    message={wallet.invalidAddress}
                  />
                )
              )
            }
          />
        </FormGroup>
      </div>
      {isValidAddress && (
        <>
          <div className="mb-4">
            <NetworksInputModal
              showFee
              showIcon
              data={coinNetworks}
              selectedNetwork={selectedNetwork}
              onSelect={setSelectedNetwork}
              feeSymbol={selectedCoin?.symbol}
              withdraw
            />
          </div>
          {selectedNetwork && isValidAddress && (
            <>
              {selectedNetwork.has_tag && (
                <div className="mb-6">
                  <FormGroup>
                    <FormLabel htmlFor="tag">
                      <div className="flex w-full justify-between">
                        {wallet.tagMemo}
                      </div>
                    </FormLabel>
                    <FormInput
                      name="tag"
                      placeholder={wallet.enterTagMemo}
                      onChange={setTag}
                      value={tag}
                      className={clsx(isValidTag && '[&_input]:bg-primary-50')}
                      ltr
                      error={!!tag && !isValidTag}
                      success={isValidTag}
                      leftIcon={
                        <Clipboard
                          className="mr-2"
                          type="paste"
                          pasteCallback={setTag}
                        />
                      }
                      caption={
                        tag && !isValidTag ? (
                          <InputAlert
                            variant="danger"
                            message={wallet.invalidTag}
                          />
                        ) : null
                      }
                    />
                  </FormGroup>
                </div>
              )}
              <div className="mb-6">
                <WithdrawValueInput />
              </div>
              <div className="mb-2">
                <div className="flex w-full justify-between">
                  <span className="text-xs text-dark-300">
                    {wallet.networkFee}
                  </span>
                  <span className="text-xs font-medium text-dark-600">
                    {selectedCoin?.symbol}{' '}
                    {toPrice(selectedNetwork.withdrawal_fee ?? 0)}
                  </span>
                </div>
              </div>
              {!!Number(withdrawValue) && (
                <div className="mb-4">
                  <div className="flex w-full justify-between">
                    <span className="text-xs text-dark-300">
                      {wallet.earnAmount}
                    </span>
                    <span className="text-sm font-bold text-dark-600">
                      {selectedCoin?.symbol}{' '}
                      {(Number(withdrawValue) -
                        Number(selectedNetwork.withdrawal_fee) ?? 0) > 0
                        ? toPrice(
                            toStraightNumber(
                              Number(withdrawValue) -
                                Number(selectedNetwork.withdrawal_fee) ?? 0,
                            ),
                          )
                        : toPrice(0)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ExternalWithdraw;
