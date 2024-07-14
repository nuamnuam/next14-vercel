import { Icon, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useSetDefaultIbanMutation } from '@/requests/panel/wallet/setDefaultIban';
import { ibanDeleteModal } from './DeleteIbanModal';
import { ICardAction } from '@/types/wallet';
import { useBankIbansQuery } from '@/requests/panel/wallet/getBankIbans';
import clsx from 'classnames';
import { useLang } from '@/hooks';

interface Props {
  deleteId: number;
}

export const ibansOptionsMenuModal = 'ibansOptionsMenuModal';
const IbansOptionsModal: React.FC<Props> = ({ deleteId }) => {
  const [wallet] = useLang(['wallet']);

  const { closeSyncModal: closeIbansOptionsMenuModal } = useModal(
    ibansOptionsMenuModal,
  );

  const { showSyncModal: showDeleteIbanModal } = useModal(ibanDeleteModal);

  const { mutateAsync: mutatesetDefaultIbanAsync } =
    useSetDefaultIbanMutation();

  const { refetch: reFetchIbans } = useBankIbansQuery();

  const items: ICardAction[] = [
    {
      icon: 'CheckCircle-OutLined',
      iconClassName: '[&>*]:fill-dark-200',
      title: wallet.defaultIban,
      className: 'text-dark-700 font-medium text-sm',
    },
    {
      icon: 'Trash-OutLined',
      iconClassName: '[&>*]:fill-danger-400',
      title: wallet.deleteIban,
      className: 'text-danger-400 font-medium text-sm',
    },
  ];

  const handleSetDefault = async () => {
    const { success } = await mutatesetDefaultIbanAsync(deleteId);
    if (success) {
      reFetchIbans();
    }
    closeIbansOptionsMenuModal();
  };

  const handleRowAction = (index: number) => {
    if (index == 0) handleSetDefault();
    else {
      showDeleteIbanModal();
    }
  };

  return (
    <Modal
      sync
      name={ibansOptionsMenuModal}
      onClose={() => {
        closeIbansOptionsMenuModal();
      }}
      title={wallet.iban}
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

export default IbansOptionsModal;
