import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import clsx from 'classnames';

import CustomPopover from '@/components/Common/Popover';
import { Icon, Button, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { type ICardAction } from '@/types/wallet';
import { useDeleteCardMutation } from '@/requests/panel/wallet/deleteCard';
import { useSetDefaultCardMutation } from '@/requests/panel/wallet/setDefaultCard';
import { useSetDefaultIbanMutation } from '@/requests/panel/wallet/setDefaultIban';
import { useDeleteIbanMutation } from '@/requests/panel/wallet/deleteIban';
import { type ICardIbanId } from '@/types/myAccount';
import { useBreakpoint, useLang } from '@/hooks';

interface Props {
  isModalMenu?: boolean;
  triggerElement?: React.ReactNode;
  closeMenuModal?: () => void;
  id: number;
  reFetchCards: () => void;
  cardType: string;
  setDeleteId: Dispatch<SetStateAction<number>>;
  deleteId?: number;
}

const cardDeleteModal = 'cardDeleteModal1';
const ibanDeleteModal = 'ibanDeleteModal1';
const optionsMenuModal = 'optionsMenuModal1';

export const MoreButtonMenu: React.FC<Props> = ({
  triggerElement,
  isModalMenu,
  id,
  cardType,
  reFetchCards,
  deleteId,
  setDeleteId,
}) => {
  const [global, myAccount] = useLang(['global', 'myAccount']);

  const { isDesktop } = useBreakpoint();
  const [type, setType] = useState<string | null>(null);

  const {
    showSyncModal: showDeleteCardModal,
    closeSyncModal: closeDeleteCardModal,
    isSyncModalOpen: isCardModalOpen,
  } = useModal(cardDeleteModal);
  const {
    showSyncModal: showDeleteIbanModal,
    closeSyncModal: closeDeleteIbanModal,
    isSyncModalOpen: isIbanModalOpen,
  } = useModal(ibanDeleteModal);
  const {
    showSyncModal: showOptionsMenuModal,
    closeSyncModal: closeOptionsMenuModal,
    isSyncModalOpen,
  } = useModal(optionsMenuModal);
  const { mutateAsync: mutateDeleteCardAsync } = useDeleteCardMutation();
  const { mutateAsync: mutateDeleteIbanAsync } = useDeleteIbanMutation();

  const { mutateAsync: mutatesetDefaultCardAsync } =
    useSetDefaultCardMutation();
  const { mutateAsync: mutatesetDefaultIbanAsync } =
    useSetDefaultIbanMutation();

  const handleDelete = async (modalType: string) => {
    const body: ICardIbanId = {
      id: deleteId,
    };

    if (modalType === 'card') {
      const { result, success } = await mutateDeleteCardAsync(body);
      if (success) {
        closeDeleteCardModal();
        if (!isDesktop) closeOptionsMenuModal();
        reFetchCards();
      }
    } else {
      const { result, success } = await mutateDeleteIbanAsync(body);
      if (success) {
        closeDeleteCardModal();
        if (!isDesktop) closeOptionsMenuModal();
        reFetchCards();
      }
    }
    if (!isDesktop) closeOptionsMenuModal();
  };

  const handleSetDefault = async (type: string) => {
    if (cardType === 'card') {
      const { result, success } = await mutatesetDefaultCardAsync(id);
      if (success) {
        reFetchCards();
      }
    } else {
      const { result, success } = await mutatesetDefaultIbanAsync(id);
      if (success) {
        reFetchCards();
      }
    }
    if (!isDesktop) closeOptionsMenuModal();
  };
  const items: ICardAction[] = [
    {
      icon: 'CheckCircle-OutLined',
      iconClassName: '[&>*]:fill-dark-200',
      title:
        (type || cardType) === 'iban'
          ? myAccount.defaultIban
          : myAccount.defaultCard,
      className: 'text-dark-700 font-medium text-sm cursor-pointer',
    },
    {
      icon: 'Trash-OutLined',
      iconClassName: '[&>*]:fill-danger-400',
      title:
        (type || cardType) === 'iban'
          ? myAccount.deleteIban
          : myAccount.deleteCard,

      className: 'text-danger-400 font-medium text-sm cursor-pointer',
    },
  ];
  useEffect(() => {
    if (type !== null) {
      showOptionsMenuModal();
    }
  }, [type]);

  const getOptionsModalTitle = () =>
    (type || cardType) === 'card' ? myAccount.bankCard : myAccount.bankIban;

  const handleRowAction = (index: number) => {
    if (index == 0) handleSetDefault(cardType === 'iban' ? 'iban' : 'card');
    else {
      if (cardType === 'card') showDeleteCardModal();
      else showDeleteIbanModal();
    }
  };

  const customPopoverOnClick = (index: number) => {
    if (index === 0) handleSetDefault(cardType);
    else {
      setDeleteId(id);
      if (cardType === 'card') showDeleteCardModal();
      else showDeleteIbanModal();
    }
  };

  return (
    <div>
      {isSyncModalOpen && type && (
        <Modal
          sync
          name={optionsMenuModal}
          onClose={() => {
            closeOptionsMenuModal();
            setType(null);
          }}
          title={getOptionsModalTitle()}
          headerIcon="DeleteItem-TwoTone"
        >
          <div className=" px-4">
            {items.map((item, index) => (
              <div
                key={item.title}
                onClick={() => {
                  handleRowAction(index);
                }}
                className={clsx(
                  'flex items-center justify-start gap-x-2 border-b-2 border-b-dark-50 py-4',
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
        </Modal>
      )}
      {isCardModalOpen && (
        <Modal
          sync
          name={cardDeleteModal}
          onClose={() => {
            closeDeleteCardModal();
            setType(null);
          }}
          title={myAccount.deleteBankcard}
          headerIcon="DeleteItem-TwoTone"
          footer={
            <div className="flex w-full justify-between">
              <Button
                className="w-5/12 bg-dark-500"
                onClick={() => {
                  closeDeleteCardModal();
                  setType(null);
                }}
              >
                {global.cancel}
              </Button>
              <Button
                className="w-5/12"
                onClick={async () => {
                  await handleDelete('card');
                }}
              >
                {global.delete}
              </Button>
            </div>
          }
        >
          {myAccount.sureToDeleteBankCard}
        </Modal>
      )}
      {isIbanModalOpen && (
        <Modal
          sync
          name={ibanDeleteModal}
          onClose={() => {
            closeDeleteIbanModal();
            setType(null);
          }}
          title={myAccount.deleteIban}
          headerIcon="DeleteItem-TwoTone"
          footer={
            <div className="flex w-full justify-between">
              <Button
                className="w-5/12 bg-dark-500"
                onClick={() => {
                  closeDeleteIbanModal();
                  setType(null);
                }}
              >
                {global.cancel}
              </Button>
              <Button
                className="w-5/12"
                onClick={async () => {
                  await handleDelete('iban');
                }}
              >
                {global.delete}
              </Button>
            </div>
          }
        >
          {myAccount.sureToDeleteBankIban}
        </Modal>
      )}
      {isModalMenu ? (
        <div>
          <Button
            variant="text"
            fullWidth
            className="w-fit border-neutral-5 "
            onClick={() => {
              setDeleteId(id);
              setType(cardType);
            }}
            size="sm"
          >
            <Icon size={12} icon="More-Filled" className="" />
          </Button>
        </div>
      ) : (
        <CustomPopover id="options_menu" anchor={triggerElement}>
          <div className="py-3 px-4">
            {items.map((item, index) => (
              <div
                onClick={() => {
                  customPopoverOnClick(index);
                }}
                className={clsx('flex items-center justify-start gap-x-2 py-2')}
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
        </CustomPopover>
      )}
    </div>
  );
};

export default MoreButtonMenu;
