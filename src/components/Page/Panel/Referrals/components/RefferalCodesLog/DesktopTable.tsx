import React, { useCallback, useMemo, useState } from 'react';

import { Chip, Icon } from '@/components/Common';
import { chunkArray, getLang, toPersianDigits } from '@/utils';
import { Pagination, ClickablePopover, Table } from '@/components';
import { IInviteCode } from '@/types/referral';
import { type TableHeaderItem } from '@/components/TableLayout/types';

import MorePopoverContent from './MorePopoverContent';
import { useLang } from '@/hooks';

interface Props {
  data?: IInviteCode[];
}

const [referral] = getLang(['referral']);

const DesktopTable: React.FC<Props> = ({ data }) => {
  const [referral] = useLang(['referral']);

  const [page, setPage] = useState(1);

  const chunkedData = useMemo(() => {
    if (!data) return [];
    return chunkArray(data, 5);
  }, [data, page]);

  const transformedData = useCallback(() => {
    return chunkedData[page - 1]?.map((item, index) => ({
      index: toPersianDigits(index + 1 + (page - 1) * 5),
      inviteCode: item.is_default
        ? `${item.invited_code} ${referral.defCode}`
        : item.invited_code,
      inviterPercent: `٪${toPersianDigits(item.inviter_commission_percent)}`,
      invitedPercent: `٪${toPersianDigits(item.invited_commission_percent)}`,
      codeUsage: (
        <Chip
          label={`${toPersianDigits(item.code_usage)} ${referral.person}`}
          variant="secondary"
          size="sm"
          colorized
          classNames="w-fit px-6"
        />
      ),
      totalReward: toPersianDigits(item.code_rewarded_earned_irt),
      actions: <ExtraMenu data={item} />,
    }));
  }, [data, page, chunkedData]);

  return (
    <div>
      <Table data={transformedData() || []} headerItems={headerItems} />
      {data?.length && (
        <Pagination
          count={chunkedData.length}
          page={page}
          onChange={setPage}
          classNames="flex justify-center p-[14px]"
        />
      )}
    </div>
  );
};

export default DesktopTable;

const ExtraMenu: React.FC<{ data: IInviteCode }> = ({ data }) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickablePopover
      id="refferals_extramenu"
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      anchorOrigin={{ vertical: 18, horizontal: 'right' }}
      hideBackdrop={false}
      open={open}
      setOpen={setOpen}
      anchor={
        <Icon
          icon="More-OutLined"
          size={20}
          className="cursor-pointer text-dark-500"
        />
      }
    >
      <MorePopoverContent data={data} />
    </ClickablePopover>
  );
};

const headerItems: TableHeaderItem[] = [
  {
    title: (
      <Icon icon="ArrowChangeSort-Filled" className="text-dark-400" size={20} />
    ),
    name: 'index',
    width: 'w-[10%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-400 text-center',
  },
  {
    title: referral.inviteCode,
    name: 'inviteCode',
    width: 'w-[15%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-400 text-center',
  },
  {
    title: referral.yourShare,
    name: 'inviterPercent',
    width: 'w-[15%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-400 text-center',
  },
  {
    title: referral.friendsShare,
    name: 'invitedPercent',
    width: 'w-[15%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-400 text-center',
  },
  {
    title: referral.inviteds,
    name: 'codeUsage',
    width: 'w-[20%]',
    classNames: 'text-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: referral.earnedReward,
    name: 'totalReward',
    width: 'w-[15%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-400 text-center',
  },
  {
    title: '',
    name: 'actions',
    width: 'w-[10%]',
    columnClassNames: 'flex justify-center',
  },
];
