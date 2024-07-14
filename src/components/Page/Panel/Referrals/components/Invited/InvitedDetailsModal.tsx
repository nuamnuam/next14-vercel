import React, { useEffect, useMemo, useState } from 'react';
import { Icon, LabelValue, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { externalData, toPersianDigits, toPrice } from '@/utils';
import { IInvitedUser } from '@/types/referral';
import moment from 'jalali-moment';
import { useLang } from '@/hooks';

export const invitedDetailsModalName = 'invited-details-modal';
const InvitedDetailsModal = () => {
  const [referral] = useLang(['referral']);

  const [data, setData] = useState<IInvitedUser>();

  const { closeSyncModal, isSyncModalOpen } = useModal(invitedDetailsModalName);

  useEffect(() => {
    if (!isSyncModalOpen) return;
    setData(externalData.get());
  }, [isSyncModalOpen]);

  const items = useMemo(() => {
    if (!data) return [];
    return [
      { label: referral.account, value: toPersianDigits(data.user_mobile_no) },
      {
        label: referral.regiterDate,
        value: toPersianDigits(
          moment(data.user_register_date)
            .locale('fa')
            .format('HH:mm:ss YYYY/M/D'),
        ),
      },
      { label: referral.inviteCode, value: data.invite_code },
      {
        label: referral.yourShare,
        value: `٪${toPersianDigits(data.inviter_commission_percent)}`,
      },
      {
        label: referral.friendShare,
        value: `٪${toPersianDigits(data.invited_commission_percent)}`,
      },
      {
        label: referral.reward,
        value: `IRT ${toPrice(data.code_rewarded_earned_irt)}`,
      },
      {
        label: referral.authentication,
        value: (
          <Icon
            icon={
              data.user_kyc_is_done
                ? 'CheckCircle-OutLined'
                : 'CloseCircle-OutLined'
            }
            size={16}
            className={
              data.user_kyc_is_done ? 'text-primary-500' : 'text-danger-500'
            }
          />
        ),
      },
    ];
  }, [data]);

  return (
    <Modal
      sync
      name={invitedDetailsModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
    >
      <div>
        <span className="block border-b-2 border-dark-50 pb-2 text-center font-medium text-dark-700">
          {referral.invitedDetails}
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
      </div>
    </Modal>
  );
};

export default InvitedDetailsModal;
