import { Button, Modal } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import { useDeleteCardMutation } from '@/requests/panel/wallet/deleteCard';
import { ICardIbanId } from '@/types/myAccount';
import { cardsOptionsMenuModal } from './CardsOptionsModal';

interface Props {
  deleteId: number;
}

export const cardDeleteModal = 'cardDeleteModal1';
const DeleteCardModal: React.FC<Props> = ({ deleteId }) => {
  const [global, myAccount] = useLang(['global', 'myAccount']);

  const { isDesktop } = useBreakpoint();

  const { closeSyncModal: closeDeleteCardModal } = useModal(cardDeleteModal);

  const { closeSyncModal: closeCardsOptionsMenuModal } = useModal(
    cardsOptionsMenuModal,
  );

  const { mutateAsync: mutateDeleteCardAsync, isPending: deleteCardLoading } =
    useDeleteCardMutation();

  const handleDelete = async () => {
    const body: ICardIbanId = {
      id: deleteId,
    };

    const { success } = await mutateDeleteCardAsync(body);
    if (success) {
      closeDeleteCardModal();
    }

    if (!isDesktop) closeCardsOptionsMenuModal();
  };

  return (
    <Modal
      sync
      name={cardDeleteModal}
      onClose={() => {
        closeDeleteCardModal();
        // setType(null);
      }}
      title={myAccount.deleteBankcard}
      headerIcon="DeleteItem-TwoTone"
      titleWrapperClassName="!px-10"
      contentAddtionalClassNames="!px-10"
      footer={
        <div className="flex w-full gap-4">
          <Button
            fullWidth
            size="lg"
            variant="dark"
            isLoading={deleteCardLoading}
            onClick={() => {
              closeDeleteCardModal();
              //   setType(null);
            }}
          >
            {global.cancel}
          </Button>
          <Button
            fullWidth
            size="lg"
            isLoading={deleteCardLoading}
            onClick={async () => {
              await handleDelete();
            }}
          >
            {global.delete}
          </Button>
        </div>
      }
    >
      <div className="mb-4">{myAccount.sureToDeleteBankCard}</div>
    </Modal>
  );
};

export default DeleteCardModal;
