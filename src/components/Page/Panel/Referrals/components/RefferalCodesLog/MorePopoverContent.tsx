import React from 'react';
import { Clipboard, Icon } from '@/components/Common';
import { IInviteCode } from '@/types/referral';
import { useModal } from '@/hooks/useModal';
import { shareRefferalCodeModalName } from '../RefferalCode/ShareRefferalCodeModal';
import { externalData } from '@/utils';
import { useUpdateInviteCode } from '@/requests/panel/referrals/updateInviteCode';
import { useRouter } from 'next/router';
import { useReferralInfo } from '@/requests/panel/referrals/getReferralInfo';
import { useLang } from '@/hooks';

const MorePopoverContent: React.FC<{ data: IInviteCode }> = ({ data }) => {
  const [referral] = useLang(['referral']);
  const router = useRouter();
  const { showSyncModal } = useModal(shareRefferalCodeModalName);
  const { mutateAsync } = useUpdateInviteCode();
  const { data: referralInfo } = useReferralInfo();

  const onShareClick = () => {
    externalData.set(data);
    showSyncModal();
  };

  const onEditClick = () => {
    externalData.set(data);
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        refferal_modify: 'new',
      },
    });
  };

  const onSetDefaultClick = () => {
    mutateAsync({
      id: data.invited_code_id.toString(),
      is_default: true,
    });
  };

  return (
    <div className="w-[265px] px-4 py-2 text-sm font-medium text-dark-700">
      <div
        className="flex cursor-pointer items-center rounded-lg py-3 px-2 hover:bg-dark-50"
        onClick={onShareClick}
      >
        <Icon icon="Share-OutLined" size={20} className="text-dark-200" />
        <span className="mr-4 text-sm">{referral.share}</span>
      </div>
      <div className="flex cursor-pointer items-center rounded-lg py-3 px-2 hover:bg-dark-50">
        <Clipboard
          type="copy"
          text={`${referralInfo?.result.invite_base_url}${data.invited_code}`}
        >
          <Icon icon="Copy-OutLined" size={20} className="text-dark-200" />
          <span className="mr-4 text-sm">{referral.copyRegLink}</span>
        </Clipboard>
      </div>
      <div className="flex cursor-pointer items-center rounded-lg py-3 px-2 hover:bg-dark-50">
        <Clipboard type="copy" text={data.invited_code}>
          <Icon icon="Copy-OutLined" size={20} className="text-dark-200" />
          <span className="mr-4 text-sm">{referral.copyRefLink}</span>
        </Clipboard>
      </div>
      <div
        className="flex cursor-pointer items-center rounded-lg py-3 px-2 hover:bg-dark-50"
        onClick={onEditClick}
      >
        <Icon icon="Edit-OutLined" size={20} className="text-dark-200" />
        <span className="mr-4 text-sm">{referral.edit}</span>
      </div>
      {!data.is_default && (
        <div
          className="flex cursor-pointer items-center rounded-lg py-3 px-2 hover:bg-dark-50"
          onClick={onSetDefaultClick}
        >
          <Icon
            icon="CheckCircle-OutLined"
            size={20}
            className="text-dark-200"
          />
          <span className="mr-4 text-sm">{referral.defaultCode}</span>
        </div>
      )}
    </div>
  );
};

export default MorePopoverContent;
