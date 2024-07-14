import React from 'react';
import Link from 'next/link';
import { getShebaInfo } from '@persian-tools/persian-tools';

import { Icon, ModalInput } from '@/components/Common';
import IbansModal, { ibansModalName } from '@/components/Common/IbansModal';
import { useModal } from '@/hooks/useModal';
import { IResponseIban } from '@/types/wallet';
import { toPersianDigits } from '@/utils';
import { useBanks, useLang } from '@/hooks';

interface Props {
  className?: string;
  caption?: React.ReactElement;
  selectedIban?: IResponseIban;
  onSelect: (item: IResponseIban) => void;
}

const IbansInputModal: React.FC<Props> = ({
  selectedIban,
  onSelect,
  className,
  caption,
}) => {
  const [wallet] = useLang(['wallet']);

  const { getCardLogoFromBankName } = useBanks();

  const { showSyncModal } = useModal(ibansModalName);

  return (
    <div className={className}>
      <ModalInput
        onClick={() => {
          showSyncModal();
        }}
        label={
          <div className="flex items-center justify-between">
            <span>{wallet.iban}</span>
            <Link
              href="/panel/wallet/bank-accounts?form=iban"
              className="text-sm text-primary-600"
            >
              + {wallet.add}
            </Link>
          </div>
        }
        placeholder={wallet.selectIban}
        align="left"
        value={
          selectedIban ? (
            <div className="flex items-center gap-3">
              <span className="text-dark-700 font-medium">
                {toPersianDigits(selectedIban?.iban ?? '')}
              </span>
              <Icon
                size={24}
                icon={getCardLogoFromBankName(
                  getShebaInfo(selectedIban.iban)?.persianName ?? '',
                )}
              />
            </div>
          ) : (
            ''
          )
        }
      />
      {caption != null && caption}
      <IbansModal onSelect={onSelect} />
    </div>
  );
};

export default IbansInputModal;
