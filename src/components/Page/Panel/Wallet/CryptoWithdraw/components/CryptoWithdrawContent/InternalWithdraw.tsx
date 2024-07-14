import {
  Clipboard,
  FormGroup,
  FormInput,
  FormLabel,
  InputAlert,
} from '@/components/Common';
import WithdrawValueInput from '../WithdrawValueInput';
import { useCryptoWithdrawStore } from '@/store';
import { isMobileNumber, toPrice, toStraightNumber } from '@/utils';
import { useEffect } from 'react';
import { useLang } from '@/hooks';

const InternalWithdraw = () => {
  const [wallet] = useLang(['wallet']);

  const {
    selectedCoin,
    mobileNumber,
    withdrawValue,
    setMobileNumber,
    setWithdrawValue,
  } = useCryptoWithdrawStore();

  useEffect(() => {
    setWithdrawValue(undefined);
  }, [mobileNumber]);

  return (
    <>
      <div className="mb-4">
        <FormGroup>
          <FormLabel htmlFor="mobile">
            <div className="flex w-full justify-between">{wallet.mobile}</div>
          </FormLabel>
          <FormInput
            name="mobile"
            placeholder={wallet.receiverMobile}
            ltr
            value={mobileNumber}
            onChange={setMobileNumber}
            onlyNumber
            maxLength={11}
            leftIcon={
              <Clipboard
                className="mr-2"
                type="paste"
                pasteCallback={setMobileNumber}
              />
            }
            error={!!mobileNumber && !isMobileNumber(mobileNumber)}
            success={isMobileNumber(mobileNumber)}
            caption={
              !!mobileNumber &&
              !isMobileNumber(mobileNumber) && (
                <InputAlert variant="danger" message={wallet.invalidMobile} />
              )
            }
          />
        </FormGroup>
      </div>
      {isMobileNumber(mobileNumber) && (
        <div className="mb-6">
          <WithdrawValueInput />
        </div>
      )}
      {isMobileNumber(mobileNumber) && Number(withdrawValue) > 0 ? (
        <div className="mb-4">
          <div className="flex w-full justify-between">
            <span className="text-xs text-dark-300">{wallet.earnAmount}</span>
            <span className="text-xs font-medium text-dark-600">
              {Number(withdrawValue) > 0
                ? toPrice(toStraightNumber(withdrawValue ?? 0))
                : toPrice(0)}{' '}
              {selectedCoin?.symbol}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default InternalWithdraw;
