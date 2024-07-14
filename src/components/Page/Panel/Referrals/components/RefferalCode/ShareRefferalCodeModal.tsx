'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'classnames';

import { Icon, Modal, StaticInput } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { IInviteCode } from '@/types/referral';
import { externalData } from '@/utils';
import { useReferralInfo } from '@/requests/panel/referrals/getReferralInfo';
import { useLang } from '@/hooks';

export const shareRefferalCodeModalName = 'share-refferal-code-modal';
const ShareRefferalCodeModal: React.FC = () => {
  const [referral] = useLang(['referral']);

  const [data, setData] = useState<IInviteCode>();
  const { closeSyncModal, isSyncModalOpen } = useModal(
    shareRefferalCodeModalName,
  );

  const { data: referralInfo } = useReferralInfo();

  useEffect(() => {
    if (!isSyncModalOpen) return;
    setData(externalData.get());
  }, [isSyncModalOpen]);

  const canShare =
    typeof window !== 'undefined'
      ? Boolean(navigator.share) && navigator.canShare()
      : false;

  const share = () => {
    navigator
      ?.share({
        title: referral.inviteCodeSharing,
        text: referral.referralNote,
        url: `${referralInfo?.result.invite_base_url}${data?.invited_code}`,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Sharing failed:', error));
  };

  return (
    <Modal
      sync
      name={shareRefferalCodeModalName}
      onClose={closeSyncModal}
      title={referral.inviteCodeSharing}
      headerIcon="Users-TwoTone"
    >
      <div className="mb-12">
        <StaticInput
          value={
            <div className="whitespace-normal">
              <span className="mb-1 block">{referral.referralNote}</span>
              <span className="block">
                {referralInfo?.result.invite_base_url}
                {data?.invited_code}
              </span>
            </div>
          }
          copyValue={`${referralInfo?.result.invite_base_url}${data?.invited_code}`}
          variant="secondary"
          className="[&_.content]:!h-auto [&_.content]:!p-4"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-dark-700">
          {referral.shareIn}
        </span>
        <div className="flex items-center gap-6">
          {socialItems.map((item, index) => (
            <div onClick={share}>
              <Icon
                key={index}
                icon={item.icon}
                size={20}
                className={clsx('text-dark-300', canShare && 'cursor-pointer')}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ShareRefferalCodeModal;

const socialItems = [
  {
    icon: 'Twitter-OutLined',
    href: '#',
  },
  {
    icon: 'Telegram-OutLined',
    href: '#',
  },
  {
    icon: 'Whatsapp-OutLined',
    href: '#',
  },
  {
    icon: 'Message-OutLined',
    href: '#',
  },
];
