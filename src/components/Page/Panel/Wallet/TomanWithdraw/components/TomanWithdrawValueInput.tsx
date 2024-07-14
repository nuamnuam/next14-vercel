import React, { useMemo } from 'react';
import {
  FormGroup,
  FormInput,
  FormLabel,
  InputAlert,
} from '@/components/Common';
import useFiatWithdrawStore from '@/store/useFiatWithdrawStore';
import { toPrice } from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';

interface Props {
  min: string;
  max: string;
  userCredit: string;
}

const TomanWithdrawValueInput: React.FC<Props> = ({ min, max, userCredit }) => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();

  const { withdrawValue, setWithdrawValue } = useFiatWithdrawStore((state) => ({
    withdrawValue: state.withdrawValue,
    setWithdrawValue: state.setWithdrawValue,
  }));

  const hasError = useMemo(() => {
    return (
      Number(withdrawValue) == 0 ||
      Number(withdrawValue) > +max ||
      Number(withdrawValue) < +min ||
      Number(withdrawValue) > +max
    );
  }, [withdrawValue, min, max]);

  const errorMessage = useMemo(() => {
    if ((!min && !max) || Number(withdrawValue) == 0) return;
    if (Number(withdrawValue) > +max)
      return `${wallet.maxWithdraw} ${toPrice(max)} ${wallet.iisToman}`;
    if (Number(withdrawValue) < +min)
      return `${wallet.minWithdraw} ${toPrice(min)} ${wallet.iisToman}`;
  }, [min, max, withdrawValue]);

  return (
    <FormGroup>
      <FormLabel htmlFor="withdraw_value">
        <div className="flex w-full justify-between">
          <span>{wallet.withdrawAmount}</span>
          <span
            className="font-normal text-primary-600 cursor-pointer text-left"
            onClick={() => setWithdrawValue(userCredit)}
          >
            {wallet.allBalance}: {toPrice(userCredit?.toLocaleString())}
          </span>
        </div>
      </FormLabel>
      <FormInput
        name="withdraw_value"
        placeholder={
          isDesktop
            ? `${wallet.enterWithdrawAmount}                                ${
                wallet.min
              } ${toPrice(min || 50000)}`
            : `${wallet.enterWithdrawAmount} `
        }
        ltr
        onlyNumber
        seprator
        value={withdrawValue}
        onChange={setWithdrawValue}
        error={hasError}
        leftIcon={
          <span className="text-sm font-medium text-dark-200">
            {wallet.toman}
          </span>
        }
        caption={
          errorMessage ? (
            <InputAlert message={errorMessage} variant="danger" />
          ) : null
        }
      />
    </FormGroup>
  );
};

export default TomanWithdrawValueInput;
