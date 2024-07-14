import React, { useState } from 'react';
import { EmptyTable, Icon } from '@/components/Common';
import { externalData, toPersianDigits } from '@/utils';
import { useModal } from '@/hooks/useModal';
import RefferalCodeDetailsModal, {
  refferalCodeDetailsModalName,
} from './RefferalCodeDetailsModal';
import { IInviteCode } from '@/types/referral';
import { shareRefferalCodeModalName } from '../RefferalCode/ShareRefferalCodeModal';
import { useLang } from '@/hooks';

interface Props {
  data?: IInviteCode[];
}

const ResponsiveTable: React.FC<Props> = ({ data }) => {
  const [referral] = useLang(['referral']);

  const [showAll, setShowAll] = useState(false);

  const { showSyncModal } = useModal(refferalCodeDetailsModalName);
  const { showSyncModal: showShareModal } = useModal(
    shareRefferalCodeModalName,
  );

  return (
    <div className="px-4">
      {data?.length ? (
        data
          .slice(0, showAll ? data.length : 5)
          ?.map((row: any, rowIndex: number) => (
            <div key={rowIndex} className="border-b border-dark-50 py-2">
              <div className="mb-1 flex items-center justify-between">
                <span
                  className="text-xs font-medium  text-dark-700"
                  onClick={() => {
                    externalData.set(row);
                    showSyncModal();
                  }}
                >
                  {row.is_default
                    ? `${row.invited_code} ${referral.defCode}`
                    : row.invited_code}
                </span>
                <span className="text-xs leading-5 text-dark-400">
                  {toPersianDigits(row.code_usage)} {referral.peopleInvited}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center"
                  onClick={() => {
                    externalData.set(row);
                    showSyncModal();
                  }}
                >
                  <Icon
                    icon="InfoCircle-OutLined"
                    size={16}
                    className="text-dark-400"
                  />
                  <span className="mr-2 text-xs text-dark-400">
                    {`٪${toPersianDigits(row.invited_commission_percent)}`}{' '}
                    {referral.friendsShare}{' '}
                    {`${toPersianDigits(row.inviter_commission_percent)}٪`}{' '}
                    {referral.yourShare}
                  </span>
                </div>
                <div
                  onClick={() => {
                    externalData.set(row);
                    showShareModal();
                  }}
                >
                  <Icon
                    icon="Share-OutLined"
                    size={12}
                    className="text-dark-400"
                  />
                </div>
              </div>
            </div>
          ))
      ) : (
        <EmptyTable />
      )}
      {!showAll && data && data?.length > 5 ? (
        <div className="p-4" onClick={() => setShowAll(true)}>
          <span className="flex items-center justify-center text-sm font-medium text-dark-400">
            <span className="ml-2">{referral.showAll}</span>
            <Icon
              icon="ArrowLeft-TwoTone"
              size={24}
              className="[&>*]:fill-dark-400"
            />
          </span>
        </div>
      ) : null}
      <RefferalCodeDetailsModal />
    </div>
  );
};

export default ResponsiveTable;
