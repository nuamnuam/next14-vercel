import { Icon, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useSetDefaultCardMutation } from '@/requests/panel/wallet/setDefaultCard';
import { useSetDefaultIbanMutation } from '@/requests/panel/wallet/setDefaultIban';
import { cardDeleteModal } from './DeleteCardModal';
import { ICardAction } from '@/types/wallet';
import { useBankCardsQuery } from '@/requests/panel/wallet/getBankCards';
import { useBankIbansQuery } from '@/requests/panel/wallet/getBankIbans';
import clsx from 'classnames';
import { useLang } from '@/hooks';

interface Props {
  deleteId: number;
}

export const cardsOptionsMenuModal = 'cardsOptionsMenuModal';
const CardsOptionsModal: React.FC<Props> = ({ deleteId }) => {
  const [myAccount] = useLang(['myAccount']);

  const { closeSyncModal: closeCardsOptionsMenuModal } = useModal(
    cardsOptionsMenuModal,
  );

  const { showSyncModal: showDeleteCardModal } = useModal(cardDeleteModal);

  const { mutateAsync: mutatesetDefaultCardAsync } =
    useSetDefaultCardMutation();
  const { mutateAsync: mutatesetDefaultIbanAsync } =
    useSetDefaultIbanMutation();

  const { refetch: reFetchCards } = useBankCardsQuery();
  const { refetch: reFetchIbans } = useBankIbansQuery();

  const items: ICardAction[] = [
    {
      icon: 'CheckCircle-OutLined',
      iconClassName: '[&>*]:fill-dark-200',
      title: myAccount.defaultCard,
      className: 'text-dark-700 font-medium text-sm',
    },
    {
      icon: 'Trash-OutLined',
      iconClassName: '[&>*]:fill-danger-400',
      title: myAccount.deleteCard,
      className: 'text-danger-400 font-medium text-sm',
    },
  ];

  const handleSetDefault = async () => {
    const { success } = await mutatesetDefaultCardAsync(deleteId);
    if (success) {
      reFetchCards();
    }
    closeCardsOptionsMenuModal();
  };

  const handleRowAction = (index: number) => {
    if (index == 0) handleSetDefault();
    else {
      showDeleteCardModal();
    }
  };

  return (
    <Modal
      sync
      name={cardsOptionsMenuModal}
      onClose={() => {
        closeCardsOptionsMenuModal();
      }}
      title={myAccount.bankCard}
      headerIcon="BankAccount-TwoTone"
      titleWrapperClassName="!px-10"
      contentAddtionalClassNames="!pt-0 !px-10"
    >
      <div className=" px-2">
        {items.map((item, index) => (
          <div
            key={item.title}
            onClick={() => {
              handleRowAction(index);
            }}
            className={clsx(
              'cursor-pointer flex items-center justify-start gap-x-2 [&:not(:last-child)]:border-b border-b-dark-50 py-6',
            )}
          >
            <Icon size={18} icon={item.icon} className={item.iconClassName} />
            <p className={item.className}>{item.title}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default CardsOptionsModal;
