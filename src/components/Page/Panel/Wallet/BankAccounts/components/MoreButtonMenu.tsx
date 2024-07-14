import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import clsx from 'classnames';

import { Icon, IconButton, ClickablePopover } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { type ICardAction } from '@/types/wallet';
import { useSetDefaultCardMutation } from '@/requests/panel/wallet/setDefaultCard';
import { useSetDefaultIbanMutation } from '@/requests/panel/wallet/setDefaultIban';
import { useBreakpoint, useLang } from '@/hooks';
import { cardDeleteModal } from './DeleteCardModal';
import { ibanDeleteModal } from './DeleteIbanModal';
import { cardsOptionsMenuModal } from './CardsOptionsModal';
import { ibansOptionsMenuModal } from './IbansOptionsModal';

interface Props {
  isModalMenu?: boolean;
  triggerElement?: React.ReactNode;
  closeMenuModal?: () => void;
  id: number;
  reFetchCards: (type: 'card' | 'iban') => void;
  cardType: string;
  setDeleteId: Dispatch<SetStateAction<number>>;
  deleteId?: number;
}

export const MoreButtonMenu: React.FC<Props> = ({
  triggerElement,
  isModalMenu,
  id,
  cardType,
  reFetchCards,
  setDeleteId,
}) => {
  const [myAccount] = useLang(['myAccount']);

  const { isDesktop } = useBreakpoint();
  const [type, setType] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { showSyncModal: showDeleteCardModal } = useModal(cardDeleteModal);
  const { showSyncModal: showDeleteIbanModal } = useModal(ibanDeleteModal);
  const {
    showSyncModal: showCardsOptionsMenuModal,
    closeSyncModal: closeCardsOptionsMenuModal,
  } = useModal(cardsOptionsMenuModal);

  const {
    showSyncModal: showIbansOptionsMenuModal,
    closeSyncModal: closeIbansOptionsMenuModal,
  } = useModal(ibansOptionsMenuModal);

  const { mutateAsync: mutatesetDefaultCardAsync } =
    useSetDefaultCardMutation();
  const { mutateAsync: mutatesetDefaultIbanAsync } =
    useSetDefaultIbanMutation();

  const handleSetDefault = async () => {
    if (cardType === 'card') {
      const { success } = await mutatesetDefaultCardAsync(id);
      if (success) {
        reFetchCards('card');
      }
    } else {
      const { success } = await mutatesetDefaultIbanAsync(id);
      if (success) {
        reFetchCards('iban');
      }
    }
    if (!isDesktop) {
      closeCardsOptionsMenuModal();
      closeIbansOptionsMenuModal();
    }
  };
  const items: ICardAction[] = [
    {
      icon: 'CheckCircle-OutLined',
      iconClassName: '[&>*]:fill-dark-200',
      title:
        (type || cardType) === 'iban'
          ? myAccount.defaultIban
          : myAccount.defaultCard,
      className: 'text-dark-700 font-medium text-sm',
    },
    {
      icon: 'Trash-OutLined',
      iconClassName: '[&>*]:fill-danger-400',
      title:
        (type || cardType) === 'iban'
          ? myAccount.deleteIban
          : myAccount.deleteCard,

      className: 'text-danger-400 font-medium text-sm',
    },
  ];

  useEffect(() => {
    if (type !== null) {
      if (cardType === 'card') {
        showCardsOptionsMenuModal();
      } else {
        showIbansOptionsMenuModal();
      }
    }
  }, [type]);

  const customPopoverOnClick = (index: number) => {
    if (index === 0) handleSetDefault();
    else {
      setDeleteId(id);
      if (cardType === 'card') showDeleteCardModal();
      else showDeleteIbanModal();
    }
  };

  return (
    <div>
      {isModalMenu ? (
        <IconButton
          icon={
            <Icon size={20} icon="More-OutLined" className="text-dark-500" />
          }
          className="!border-dark-200"
          size="lg"
          onClick={() => {
            setDeleteId(id);
            setType(cardType);
          }}
        />
      ) : (
        <ClickablePopover
          id="coins_dropdown"
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          hideBackdrop={false}
          open={open}
          setOpen={setOpen}
          anchor={triggerElement}
        >
          <div className="p-4">
            {items.map((item, index) => (
              <div
                onClick={() => {
                  customPopoverOnClick(index);
                }}
                className={clsx(
                  'flex items-center justify-start gap-x-2 p-2 cursor-pointer hover:bg-dark-50 rounded-lg',
                )}
              >
                <Icon
                  size={18}
                  icon={item.icon}
                  className={item.iconClassName}
                />
                <p className={item.className}>{item.title}</p>
              </div>
            ))}
          </div>
        </ClickablePopover>
      )}
    </div>
  );
};

export default MoreButtonMenu;
