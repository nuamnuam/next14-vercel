import { Button, Modal } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import { useDeleteIbanMutation } from '@/requests/panel/wallet/deleteIban';
import { useBankCardsQuery } from '@/requests/panel/wallet/getBankCards';
import { useBankIbansQuery } from '@/requests/panel/wallet/getBankIbans';
import { ICardIbanId } from '@/types/myAccount';
import { ibansOptionsMenuModal } from './IbansOptionsModal';

interface Props {
  deleteId: number;
}

export const ibanDeleteModal = 'ibanDeleteModal1';
const DeleteIbanModal: React.FC<Props> = ({ deleteId }) => {
  const [global, myAccount] = useLang(['global', 'myAccount']);

  const { isDesktop } = useBreakpoint();

  const { closeSyncModal: closeDeleteIbanModal } = useModal(ibanDeleteModal);

  const { closeSyncModal: closeIbansOptionsMenuModal } = useModal(
    ibansOptionsMenuModal,
  );

  const { refetch: getBankCards } = useBankCardsQuery();
  const { refetch: getBankIbans } = useBankIbansQuery();
  const { mutateAsync: mutateDeleteIbanAsync, isPending: deleteIbanLoading } =
    useDeleteIbanMutation();

  const reFetchCards = () => {
    getBankCards();
    getBankIbans();
  };

  const handleDelete = async () => {
    const body: ICardIbanId = {
      id: deleteId,
    };

    const { success } = await mutateDeleteIbanAsync(body);
    if (success) {
      closeDeleteIbanModal();
      reFetchCards();
    }

    if (!isDesktop) closeIbansOptionsMenuModal();
  };

  return (
    <Modal
      sync
      name={ibanDeleteModal}
      onClose={() => {
        closeDeleteIbanModal();
        // setType(null);
      }}
      title={myAccount.deleteIban}
      headerIcon="DeleteItem-TwoTone"
      titleWrapperClassName="!px-10"
      contentAddtionalClassNames="!px-10"
      footer={
        <div className="flex w-full gap-4">
          <Button
            fullWidth
            size="lg"
            variant="dark"
            isLoading={deleteIbanLoading}
            onClick={() => {
              closeDeleteIbanModal();
              //   setType(null);
            }}
          >
            {global.cancel}
          </Button>
          <Button
            fullWidth
            size="lg"
            isLoading={deleteIbanLoading}
            onClick={async () => {
              await handleDelete();
            }}
          >
            {global.delete}
          </Button>
        </div>
      }
    >
      <div className="mb-4">{myAccount.sureToDeleteBankIban}</div>
    </Modal>
  );
};

export default DeleteIbanModal;
