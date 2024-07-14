import { useModal } from '@/hooks/useModal';
import { useRouter } from 'next/router';
import { cancelTicketModalName } from './TicketDetail';
import { useGetSingleTicketDataQuery } from '@/requests/ticket/getSingleTicketById';
import { useCloseTicket } from '@/requests/ticket/closeTicket';
import { Button, Modal } from '@/components/Common';
import { useLang } from '@/hooks';

const CancelTicketModal = () => {
  const [tickets] = useLang(['tickets']);

  const router = useRouter();
  const { closeSyncModal: closeCancelTicketModal } = useModal(
    cancelTicketModalName,
  );

  const { refetch } = useGetSingleTicketDataQuery(
    Number(router.query.id),
    router.isReady,
  );
  const { mutateAsync } = useCloseTicket(router.query.id?.toString()!);

  const cancelTicket = async () => {
    await mutateAsync(router.query.id?.toString()!);
    return await refetch();
  };
  return (
    <Modal
      sync
      title={tickets.leaveTicket}
      name={cancelTicketModalName}
      onClose={closeCancelTicketModal}
      headerIcon={'DeleteItem-TwoTone'}
    >
      <h3 className="text-dark-700 font-medium">
        {tickets.areYouSuteToCancelTicket}
      </h3>
      <div className="mt-6 flex justify-between items-center gap-x-4">
        <Button
          size="md"
          variant="text"
          onClick={() => closeCancelTicketModal()}
          className="h-12 bg-dark-500 [&>*]:text-white w-1/2"
        >
          {tickets.cancel}
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            cancelTicket();
            closeCancelTicketModal();
          }}
          className="h-12 w-1/2"
        >
          {tickets.confirmCancel}
        </Button>
      </div>
    </Modal>
  );
};

export default CancelTicketModal;
