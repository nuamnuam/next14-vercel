import React, { useCallback, useMemo } from 'react';
import {
  FormGroup,
  FormInput,
  FormLabel,
  InputAlert,
} from '@/components/Common';
import { useDepositStore } from '@/store';
import { toPrice } from '@/utils';
import { useLang } from '@/hooks';

const DepositValueInput = () => {
  const [wallet] = useLang(['wallet']);

  const { selectedCoin, selectedNetwork, depositValue, setDepositValue } =
    useDepositStore((state) => ({
      selectedCoin: state.selectedCoin,
      selectedNetwork: state.selectedNetwork,
      depositValue: state.depositValue,
      setDepositValue: state.setDepositValue,
    }));

  const handleChange = useCallback(
    (value: string) => {
      setDepositValue(value);
    },
    [setDepositValue],
  );

  const hasError = useMemo(() => {
    return Boolean(
      !selectedNetwork ||
        (selectedNetwork.min_deposit &&
          Number(depositValue) > 0 &&
          Number(depositValue) < selectedNetwork.min_deposit),
    );
  }, [depositValue, selectedNetwork]);

  return (
    <FormGroup>
      <FormLabel htmlFor="deposit_value">
        <div className="flex w-full justify-between">
          {wallet.depositAmount}
        </div>
      </FormLabel>
      <FormInput
        name="deposit_value"
        placeholder={wallet.enterDepositAmount}
        onlyNumber
        seprator
        decimal={selectedCoin?.balance_decimal}
        value={depositValue}
        onChange={handleChange}
        leftIcon={selectedCoin?.symbol}
        error={hasError}
        caption={
          hasError && (
            <InputAlert
              message={`${wallet.minDeposit} ${toPrice(
                selectedNetwork?.min_deposit ?? 0,
              )} ${selectedCoin?.symbol} ${wallet.is}.`}
              variant="danger"
            />
          )
        }
      />
    </FormGroup>
  );
};

export default DepositValueInput;
