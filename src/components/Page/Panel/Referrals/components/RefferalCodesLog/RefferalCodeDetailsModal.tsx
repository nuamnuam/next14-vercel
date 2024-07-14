import {
  Button,
  Clipboard,
  Icon,
  LabelValue,
  Modal,
  Switch,
} from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import React, { useEffect, useMemo, useState } from 'react';
import { shareRefferalCodeModalName } from '../RefferalCode/ShareRefferalCodeModal';
import { externalData, toPersianDigits, toPrice } from '@/utils';
import { IInviteCode } from '@/types/referral';
import { useUpdateInviteCode } from '@/requests/panel/referrals/updateInviteCode';
import { useRouter } from 'next/router';
import { useLang } from '@/hooks';

export const refferalCodeDetailsModalName = 'efferal-code-details-modal';
const RefferalCodeDetailsModal = () => {
  const [referral] = useLang(['referral']);

  const router = useRouter();

  const { closeSyncModal, isSyncModalOpen } = useModal(
    refferalCodeDetailsModalName,
  );
  const { showSyncModal } = useModal(shareRefferalCodeModalName);
  const [isDefault, setIsDefault] = useState(false);

  const { mutateAsync, isPending: isLoading } = useUpdateInviteCode();

  const [data, setData] = useState<IInviteCode>();

  useEffect(() => {
    if (!isSyncModalOpen) return;
    setData(externalData.get());
  }, [isSyncModalOpen]);

  useEffect(() => {
    if (!data) return;
    setIsDefault(data?.is_default);
  }, [data]);

  const handleSetDefault = async (status: boolean) => {
    setIsDefault(status);
    await mutateAsync({
      id: data?.invited_code_id.toString()!,
      is_default: status,
    });
  };

  const items = useMemo(() => {
    return [
      {
        label: referral.inviteCode,
        value: (
          <div className="flex items-center">
            <Clipboard text={data?.invited_code ?? ''} size="sm" />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {data?.invited_code}
            </span>
          </div>
        ),
      },
      {
        label: referral.earnedReward,
        value: `IRT ${toPrice(data?.code_rewarded_earned_irt ?? 0)}`,
      },
      {
        label: referral.inviteds,
        value: `${toPersianDigits(data?.code_usage)} ${referral.person}`,
      },
      {
        label: referral.yourShare,
        value: `٪${toPersianDigits(data?.inviter_commission_percent)}`,
      },
      {
        label: referral.friendShare,
        value: `٪${toPersianDigits(data?.invited_commission_percent)}`,
      },
      {
        label: referral.defaultInviteCode,
        value: (
          <Switch
            checked={isDefault}
            isDisabled={isDefault || isLoading}
            onChange={(e) => {
              handleSetDefault(e.target.checked);
            }}
            className="[&_.MuiFormControlLabel-root]:!m-0"
          />
        ),
      },
    ];
  }, [data, isDefault]);

  const onClickEdit = () => {
    closeSyncModal();
    externalData.set(data);
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        refferal_modify: 'new',
      },
    });
  };

  return (
    <Modal
      sync
      name={refferalCodeDetailsModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
    >
      <div>
        <span className="block border-b-2 border-dark-50 pb-2 text-center font-medium text-dark-700">
          {referral.inviteCode}
        </span>
        {items.map((item) => (
          <LabelValue
            key={item.label}
            label={item.label}
            value={item.value}
            classNames="py-[13px] border-b border-dark-50"
            labelClassNames="font-medium !text-dark-700 text-sm"
          />
        ))}
        {!isDefault && (
          <Button
            fullWidth
            variant="dark"
            className="mt-6"
            isLoading={isLoading}
            onClick={onClickEdit}
          >
            {referral.edit}
          </Button>
        )}
        <Button
          fullWidth
          onClick={() => {
            externalData.set(data);
            showSyncModal();
          }}
          className="mt-6"
          isLoading={isLoading}
          startIcon={
            !isLoading ? (
              <Icon icon="Share-OutLined" size={16} className="text-white" />
            ) : (
              <></>
            )
          }
        >
          {referral.inviteCodeSharing}
        </Button>
      </div>
    </Modal>
  );
};

export default RefferalCodeDetailsModal;
