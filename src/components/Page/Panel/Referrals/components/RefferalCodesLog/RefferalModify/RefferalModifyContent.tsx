import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CheckBox,
  Chip,
  Icon,
  RangeSlider,
  ResponsivePageHeader,
} from '@/components/Common';
import clsx from 'classnames';
import { useBreakpoint, useLang } from '@/hooks';
import { useRouter } from 'next/router';
import { externalData, maxDecimal, toPersianDigits } from '@/utils';
import { useReferralLevels } from '@/requests/panel/referrals/getReferralLevels';
import { useReferralInfo } from '@/requests/panel/referrals/getReferralInfo';
import { IInviteCode } from '@/types/referral';
import { useUpdateInviteCode } from '@/requests/panel/referrals/updateInviteCode';
import { useRegisterInviteCode } from '@/requests/panel/referrals/registerInviteCode';

const RefferalModifyContent: React.FC = () => {
  const [referral] = useLang(['referral']);

  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const [rangeValue, setRangeValue] = useState<number>(30);
  const [data, setData] = useState<IInviteCode>();
  const [isDefault, setIsDefault] = useState(false);

  const { data: referralInfo } = useReferralInfo();
  const { data: levelsList } = useReferralLevels();

  const { mutateAsync: updateInviteCode, isPending: updateLoading } =
    useUpdateInviteCode();

  const { mutateAsync: registerInviteCode, isPending: registerLoading } =
    useRegisterInviteCode();

  const activeStep = useMemo(() => {
    return levelsList?.result.find(
      (level) => referralInfo?.result.current_level_id === level.level_id,
    );
  }, [referralInfo, levelsList]);

  const calculatedInviteePercent = () => {
    if (!activeStep) return 0;
    return (rangeValue * activeStep?.level_earn_percent) / 100;
  };

  useEffect(() => {
    if (!referralInfo || !levelsList) return;
    setData(externalData.get());
  }, [referralInfo, levelsList]);

  useEffect(() => {
    if (!data) return;
    setIsDefault(data?.is_default);
    setRangeValue(data?.invited_commission_percent ?? 0);
  }, [data]);

  const handleSubmit = async () => {
    if (!data) {
      const { success } = await registerInviteCode({
        is_default: isDefault,
        share_percent: rangeValue.toString(),
      });
      if (success) {
        router.push({
          pathname: '/panel/referrals',
        });
      }
    } else {
      const { success } = await updateInviteCode({
        id: data.invited_code_id.toString(),
        is_default: isDefault,
        share_percent: rangeValue.toString(),
      });

      if (success) {
        router.push({
          pathname: '/panel/referrals',
        });
      }
    }
  };

  return (
    <>
      <ResponsivePageHeader
        title={referral.newInviteCode}
        onBack={() => router.back()}
      />
      <div className="px-4 sm:px-8 lg:p-0">
        <div className="pb-[8rem] lg:pb-0 select-none">
          {isDesktop && (
            <div className="mb-8 flex items-center justify-between">
              <span
                className="flex cursor-pointer items-center"
                onClick={() => {
                  router.back();
                }}
              >
                <Icon
                  icon="Right-OutLined"
                  className="text-dark-200"
                  size={20}
                />
                <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
                  {referral.newInviteCode}
                </h1>
              </span>
            </div>
          )}
          <Card classNames="flex flex-col gap-6 lg:gap-36 lg:flex-row lg:py-8 lg:px-10 !bg-transparent lg:!bg-white">
            <div className="order-1 flex-1 lg:order-2">
              <Alert message={referral.newInviteNote} variant="info" />
            </div>
            <div className="order-2 flex-1 rounded-lg bg-white py-8 px-4 sm:px-8 lg:order-1 lg:p-0">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-sm text-dark-600">
                  {referral.currentRewardLevel}
                </span>
                <Chip
                  label={`٪${toPersianDigits(
                    activeStep?.level_earn_percent,
                  )} ${toPersianDigits(activeStep?.level_name)}`}
                  colorized
                />
              </div>
              <div className="mb-9 flex items-center justify-between">
                <span className="text-sm text-dark-600">
                  {referral.setFriendsShare}
                </span>
                <span className="text-[18px] font-medium text-dark-600">
                  ٪{toPersianDigits(rangeValue)}
                </span>
              </div>
              <div className="mb-6">
                <RangeSlider
                  value={rangeValue}
                  onChange={setRangeValue}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
              <div className="mb-6 flex items-center justify-between rounded-lg bg-dark-50 p-6">
                <div className="flex flex-col items-center justify-center">
                  <span className="mb-4 text-[18px] font-bold text-dark-600">
                    ٪{toPersianDigits(calculatedInviteePercent())}
                  </span>
                  <span className="text-xs font-medium text-dark-400">
                    {referral.friendsShare}
                  </span>
                </div>
                <span className="text-xl font-medium text-dark-600">=</span>
                <div className="flex flex-col items-center justify-center">
                  <span className="mb-4 text-[18px] font-bold text-dark-600">
                    ٪{toPersianDigits(activeStep?.level_earn_percent)}
                  </span>
                  <span className="text-xs font-medium text-dark-400">
                    {referral.yourRewardPercent}
                  </span>
                </div>
                <span className="text-xl font-medium text-dark-600">*</span>
                <div className="flex flex-col items-center justify-center">
                  <span className="mb-4 text-[18px] font-bold text-dark-600">
                    ٪{toPersianDigits(rangeValue)}
                  </span>
                  <span className="text-xs font-medium text-dark-400">
                    {referral.distributionCoefficient}
                  </span>
                </div>
              </div>

              <div className="mb-9 flex items-center justify-between">
                <span className="text-sm text-dark-600">
                  {referral.yourShare}
                </span>
                <span className="text-sm font-medium text-dark-600">
                  ٪
                  {toPersianDigits(
                    maxDecimal(
                      (activeStep?.level_earn_percent ?? 0) -
                        calculatedInviteePercent(),
                      2,
                    ),
                  )}
                </span>
              </div>
              <div className="mb-9 flex items-center justify-between">
                <span className="text-sm text-dark-600">
                  {referral.friendShare}
                </span>
                <span className="text-sm font-medium text-dark-600">
                  ٪{toPersianDigits(calculatedInviteePercent())}
                </span>
              </div>
              <CheckBox
                isDisabled={data?.is_default}
                isChecked={isDefault}
                handleInputChange={setIsDefault}
                className={clsx(data?.is_default && '[&>*]:!text-dark-300')}
                label={
                  <span
                    className={clsx(
                      'mr-2 text-sm text-dark-800',
                      data?.is_default && '!text-dark-300',
                    )}
                  >
                    {referral.setAsDefault}
                  </span>
                }
              />
              <Button
                size="lg"
                fullWidth
                className="mt-[26px]"
                onClick={handleSubmit}
                isLoading={updateLoading || registerLoading}
              >
                {data ? referral.saveChanges : referral.createInviteCode}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RefferalModifyContent;
