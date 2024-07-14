import { type Dispatch, type SetStateAction } from 'react';

import { Chip, Icon, IconButton } from '@/components/Common';
import { useBanks, useBreakpoint, useLang } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import { type IResponseCard } from '@/types/wallet';
import { maskCardNumber } from '@/utils/card-number';
import { getShebaInfo } from '@persian-tools/persian-tools';
import MoreMenu from './MoreButtonMenu';
import { toPersianDigits } from '@/utils';
interface IType {
  type: string;
  reFetchCards: (type: 'card' | 'iban') => void;
  cardType: string;
  iban?: string;
  bank_name: string;
  setDeleteId: Dispatch<SetStateAction<number>>;
  deleteId?: number;
}

const menuModalName = 'cardActions';

const AccountItem = (props: IResponseCard & IType) => {
  const [global, wallet] = useLang(['global', 'wallet']);

  const { getCardLogo, getCardLogoFromBankName } = useBanks();

  const {
    card_number,
    id,
    iban,
    status,
    is_default = false,
    cardType,
    setDeleteId,
    deleteId,
    reFetchCards,
  } = props;

  const { isMobile, isDesktop } = useBreakpoint();

  const { showSyncModal: showMenuModal, closeModal: closeMenuModal } =
    useModal(menuModalName);

  const getStatus = () => {
    switch (status) {
      case 'accept':
        return isMobile ? (
          <Icon
            className="[&>*]:fill-primary-500"
            icon="CheckCircle-Filled"
            size={24}
          />
        ) : (
          <Chip variant="success" label={global.confirmed} />
        );
      case 'reject':
        return isMobile ? (
          <Icon
            className="[&>*]:fill-danger-500"
            icon="CloseCircle-Filled"
            size={24}
          />
        ) : (
          <Chip variant="danger" label={global.rejected} />
        );
      case 'pending':
        return isMobile ? (
          <Icon
            className="[&>*]:fill-warning-600"
            icon="ClockCircle-Filled"
            size={24}
          />
        ) : (
          <Chip variant="warning" label={global.pending} />
        );
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between [&:not(:last-child)]:border-b-2 border-dark-50 py-4 lg:py-6">
        <div className="flex items-center justify-start gap-x-2 sm:gap-x-3">
          {card_number ? (
            <Icon icon={getCardLogo(card_number)} size={18} />
          ) : (
            <Icon
              icon={getCardLogoFromBankName(
                getShebaInfo(iban)?.persianName ?? '',
              )}
              size={18}
            />
          )}

          {card_number ? (
            <div className="flex flex-col">
              <p dir="ltr" className="text-sm font-medium text-dark-600">
                {toPersianDigits(maskCardNumber(card_number) ?? '')}
              </p>
              {is_default ? (
                <span className="text-xs font-medium text-dark-200 mt-1">
                  {wallet.defaultCard}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col">
              <p dir="ltr" className="text-sm font-medium text-dark-600">
                {toPersianDigits(iban ?? '')}
              </p>
              {is_default ? (
                <span className="text-xs font-medium text-dark-200 mt-1">
                  {wallet.defaultIban}
                </span>
              ) : null}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-x-2 sm:gap-x-3">
          {getStatus()}
          {is_default ? (
            <IconButton
              icon={
                <Icon
                  size={20}
                  icon="More-OutLined"
                  className="text-dark-500"
                />
              }
              className="!border-dark-100 [&>*]:text-dark-100 [&>*]:hover:!text-dark-100 hover:!cursor-not-allowed"
              size="lg"
            />
          ) : (
            <MoreMenu
              cardType={cardType}
              isModalMenu={!isDesktop}
              closeMenuModal={closeMenuModal}
              id={id}
              reFetchCards={reFetchCards}
              deleteId={deleteId}
              setDeleteId={setDeleteId}
              triggerElement={
                <IconButton
                  icon={
                    <Icon
                      size={20}
                      icon="More-OutLined"
                      className="text-dark-500"
                    />
                  }
                  className="!border-dark-200"
                  size="lg"
                  onClick={() => {
                    !isDesktop ? showMenuModal() : null;
                  }}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AccountItem;
