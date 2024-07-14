import React, { useCallback } from 'react';
import clsx from 'classnames';

import { Modal, Icon, Chip } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { type NetworkModel } from '@/types/wallet';
import { toPrice } from '@/utils';
import { useLang } from '@/hooks';

interface Props {
  showFee?: boolean;
  showIcon?: boolean;
  data?: NetworkModel[];
  onSelect?: (network: NetworkModel) => void;
  deposit?: boolean;
  withdraw?: boolean;
  feeSymbol?: string;
}

export const networksModalName = 'networks-modal';
const NetworksModal: React.FC<Props> = ({
  showFee = false,
  showIcon = false,
  data = [],
  onSelect = () => {},
  deposit = false,
  withdraw = false,
  feeSymbol,
}) => {
  const [global] = useLang(['global']);

  const isActiveNetwork = (network: NetworkModel) => {
    if (deposit && withdraw) {
      console.log('SET NETWORK MODAL TRANACTION TYPE!');
      return;
    }
    if (deposit) return network.is_depositable;
    if (withdraw) return network.is_withdrawable;
  };

  const networkFee = (network: NetworkModel) => {
    if (deposit) return network.deposit_fee;
    if (withdraw) return network.withdrawal_fee;
  };

  const { closeSyncModal } = useModal(networksModalName);

  const onClick = useCallback((network: NetworkModel) => {
    if (!isActiveNetwork(network) || !network.is_selectable) return;
    onSelect(network);
    closeSyncModal();
  }, []);

  return (
    <Modal
      sync
      name={networksModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames=" !pt-8 !px-0"
    >
      <div className="flex flex-col select-none">
        <h2 className="mx-4 mt-4 mb-0 border-b border-dark-100 pb-4 text-center font-medium text-dark-700 md:mx-6 lg:my-0">
          {global.selectNetwork}
        </h2>
        <div
          className={clsx(
            'overflow-y-auto px-4 md:px-6',
            showFee ? 'h-[332px]' : 'h-[296px]',
          )}
        >
          {showFee && (
            <div className=" flex items-center justify-between border-b border-dark-50 bg-white py-2 pr-1">
              <span className="text-sm text-dark-200">{global.network}</span>
              <span className="text-sm text-dark-200">
                {global.commission} {feeSymbol && `(${feeSymbol})`}
              </span>
            </div>
          )}
          {data.map((network, index) => (
            <div
              key={index}
              onClick={() => onClick(network)}
              className={clsx(
                'flex h-[74px] cursor-pointer items-center justify-between rounded-sm border-b border-dark-50 transition duration-100',
                isActiveNetwork(network) && network.is_selectable
                  ? 'hover:bg-dark-50'
                  : '!cursor-not-allowed',
              )}
            >
              <div className="flex items-center pr-2">
                {showIcon &&
                  (network.is_selectable ? (
                    <Icon
                      icon="CheckCircle-OutLined"
                      size={24}
                      className="ml-4 text-primary-600"
                    />
                  ) : (
                    <Icon
                      icon="CloseCircle-OutLined"
                      size={24}
                      className="ml-4 text-danger-500"
                    />
                  ))}

                <div
                  className={clsx(!isActiveNetwork(network) && 'opacity-50')}
                >
                  <span className="block font-medium leading-6 text-dark-700">
                    {network.slug}
                  </span>
                  <span className="text-xs leading-5 text-dark-700">
                    {network.title}
                  </span>
                </div>
              </div>
              {!isActiveNetwork(network) ? (
                <Chip
                  label={global.disable}
                  variant="secondary"
                  classNames="px-3 h-7"
                />
              ) : (
                showFee && (
                  <span className="text-sm text-dark-700">
                    {toPrice(networkFee(network) ?? 0)}
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default NetworksModal;
