import React, { FC, useState } from 'react';

import {
  Alert,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
} from '@/components/Common';
import { useLang } from '@/hooks';
import { useSetReferralCode } from '@/requests/panel/referrals/setReferralCode';
import { toPersianDigits } from '@/utils';

type Props = {
  remainingHours: string;
};

const Inviter: FC<Props> = ({ remainingHours }) => {
  const [referral] = useLang(['referral']);

  const [value, setValue] = useState<string>();

  const { mutateAsync, isPending: isLoading } = useSetReferralCode();

  const handleSubmit = async () => {
    const { success } = await mutateAsync({
      referral_code: value,
    });

    if (success) {
      setValue(undefined);
    }
  };

  const handleChange = (e: string) => {
    const regex = /^[a-zA-Z0-9]*$/;
    if (regex.test(e) || e === '') setValue(e);
  };

  return (
    <div className="flex flex-col gap-8 rounded-lg bg-white px-4 py-6 lg:flex-row lg:px-10 lg:py-8">
      <div className="flex-1">
        <span className="mb-6 block text-dark-800">{referral.yourInviter}</span>
        <span className="mb-6 block text-xs leading-[18px] text-dark-400">
          {referral.inviterNote1}
        </span>
        <span className="block text-xs leading-[18px] text-dark-400">
          {referral.inverNote2}
        </span>
      </div>
      <div className="flex-1">
        {remainingHours ? (
          <Alert
            message={referral.inviteExpireDate.replace(
              '{{remainigHours}}',
              `${toPersianDigits(remainingHours)} ساعت`,
            )}
            className="mb-6"
            variant="info"
          />
        ) : (
          <></>
        )}

        <div className="flex items-end gap-4">
          <div className="w-1/2 lg:w-auto lg:flex-auto">
            <FormGroup>
              <FormLabel htmlFor="invite_code">
                {referral.friendInviteCode}
              </FormLabel>
              <FormInput
                name="invite_code"
                placeholder={referral.enterInviteCode}
                value={value}
                onChange={handleChange}
                maxLength={8}
                minLength={6}
                ltr
              />
            </FormGroup>
          </div>
          <Button
            size="lg"
            className="w-1/2 lg:w-auto min-w-[104px]"
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={!value || value.length < 6}
          >
            {referral.setInviter}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Inviter;
