import React from 'react';
import Link from 'next/link';
import { getShebaInfo } from '@persian-tools/persian-tools';

import { Modal, Button, Spinner, Icon } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { toPersianDigits } from '@/utils';
import { useBankIbansQuery } from '@/requests/panel/wallet/getBankIbans';
import { IResponseIban } from '@/types/wallet';
import { useBanks, useLang } from '@/hooks';

interface Props {
  onSelect: (item: IResponseIban) => void;
}

export const ibansModalName = 'ibans-modal';
const IbansModal: React.FC<Props> = ({ onSelect = () => {} }) => {
  const [global] = useLang(['global']);

  const { getCardLogoFromBankName } = useBanks();

  const { closeSyncModal } = useModal(ibansModalName);

  const { isLoading, data } = useBankIbansQuery();

  const handleSelect = (item: IResponseIban) => {
    closeSyncModal();
    onSelect(item);
  };

  return (
    <Modal
      sync
      name={ibansModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      maxWidth={'382px'}
      contentAddtionalClassNames=" !px-6"
    >
      <div className="flex flex-col">
        <h2 className="pb-6 text-center font-medium text-dark-500 border-b-2 border-dark-50">
          {global.ibanSelection}
        </h2>
        <div>
          {isLoading ? (
            <div className="py-12 flex items-center justify-center">
              <Spinner />
            </div>
          ) : data?.result?.length ? (
            data?.result?.map((item, index) => (
              <div
                className="flex cursor-pointer items-center justify-between pt-6 border-dark-50 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-6"
                key={index}
                onClick={() => handleSelect(item)}
              >
                <span className="dir-ltr flex-auto text-left font-medium text-dark-700">
                  {toPersianDigits(item.iban)}
                </span>
                <Icon
                  size={24}
                  className="mr-12"
                  icon={getCardLogoFromBankName(
                    getShebaInfo(item.iban)?.persianName ?? '',
                  )}
                />
              </div>
            ))
          ) : (
            <div className="mt-6">
              <span className="text-dark-700 font-medium block text-center mb-6">
                {global.ibanNotRegister}
              </span>
              <Link href="/panel/wallet/bank-accounts">
                <Button fullWidth onClick={() => closeSyncModal()}>
                  + {global.addIban}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default IbansModal;
