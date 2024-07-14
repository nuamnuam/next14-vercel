import React, { useCallback, useMemo } from 'react';
import {
  FormGroup,
  FormInput,
  FormLabel,
  InputAlert,
} from '@/components/Common';
import { useCryptoWithdrawStore } from '@/store';
import { toPrice, toStraightNumber } from '@/utils';
import { CRYPTO_WITHDRAW_TYPES } from './CryptoWithdrawContent';
import { useLang } from '@/hooks';

const WithdrawValueInput = () => {
  const [wallet] = useLang(['wallet']);

  const {
    withdrawType,
    selectedCoin,
    mobileNumber,
    selectedNetwork,
    withdrawValue,
    setWithdrawValue,
  } = useCryptoWithdrawStore();

  const handleChange = useCallback(
    (value: string) => {
      setWithdrawValue(value);
    },
    [setWithdrawValue],
  );

  const hasError = useMemo(() => {
    return !!(
      Number(withdrawValue) > 0 &&
      (!selectedCoin ||
        (selectedCoin &&
          Number(withdrawValue) > Number(selectedCoin.balance_available)) ||
        (withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL &&
          selectedNetwork?.min_withdrawal &&
          Number(withdrawValue) < selectedNetwork.min_withdrawal))
    );
  }, [
    withdrawValue,
    selectedNetwork,
    mobileNumber,
    selectedCoin,
    withdrawType,
  ]);

  const errorMessage = useMemo(() => {
    let errorMessage = '';
    if (!selectedCoin) return errorMessage;
    else if (Number(withdrawValue) > Number(selectedCoin?.balance_available)) {
      errorMessage = `${wallet.balance} ${selectedCoin?.symbol} ${wallet.isNorEnough}.`;
    } else if (
      withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL &&
      Boolean(
        !selectedNetwork ||
          (selectedNetwork.min_withdrawal &&
            Number(withdrawValue) > 0 &&
            Number(withdrawValue) < selectedNetwork.min_withdrawal),
      )
    ) {
      errorMessage = `${wallet.minWithdraw} ${toPrice(
        selectedNetwork?.min_withdrawal ?? 0,
      )} ${selectedCoin?.symbol} ${wallet.is}.`;
    } else if (
      withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL &&
      Boolean(
        !selectedNetwork ||
          (selectedNetwork.max_withdrawal &&
            Number(withdrawValue) > 0 &&
            Number(withdrawValue) > selectedNetwork.max_withdrawal),
      )
    ) {
      errorMessage = `${wallet.maxWithdraw} ${toPrice(
        selectedNetwork?.max_withdrawal ?? 0,
      )} ${selectedCoin?.symbol} ${wallet.is}.`;
    }

    return errorMessage;
  }, [
    withdrawValue,
    selectedNetwork,
    mobileNumber,
    selectedCoin,
    withdrawType,
  ]);

  return (
    <FormGroup>
      <FormLabel htmlFor="withdraw_value">
        <div className="flex w-full justify-between">
          <span>{wallet.withdrawAmount}</span>
          <span
            className="font-normal text-primary-600 cursor-pointer"
            onClick={() => {
              if (
                selectedCoin?.balance_available &&
                Number(selectedCoin?.balance_available) > 0
              )
                setWithdrawValue(
                  toStraightNumber(selectedCoin.balance_available),
                );
            }}
          >
            {wallet.allBalance}:{' '}
            {toPrice(toStraightNumber(selectedCoin?.balance_available!) ?? 0) ||
              '۰'}
          </span>
        </div>
      </FormLabel>
      <FormInput
        name="withdraw_value"
        placeholder={
          withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL
            ? `${wallet.minWithdraw} ${toPrice(
                selectedNetwork?.min_withdrawal ?? 0,
              )}`
            : ''
        }
        onlyNumber
        seprator
        decimal={
          withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL
            ? Number(selectedNetwork?.withdraw_decimals ?? 0)
            : Number(selectedCoin?.balance_decimal || 0)
        }
        value={withdrawValue}
        onChange={handleChange}
        leftIcon={
          <span className="text-sm font-medium text-dark-200">
            {selectedCoin?.symbol}
          </span>
        }
        error={hasError}
        caption={
          hasError && <InputAlert message={errorMessage} variant="danger" />
        }
      />
    </FormGroup>
  );
};

export default WithdrawValueInput;
