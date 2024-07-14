import React from 'react';
import { ModalInput, NetworksModal } from '@/components/Common';
import { networksModalName } from '@/components/Common/NetworksModal';
import { useModal } from '@/hooks/useModal';
import { type NetworkModel } from '@/types/wallet';
import { useLang } from '@/hooks';

interface Props {
  className?: string;
  showFee?: boolean;
  showIcon?: boolean;
  caption?: React.ReactElement | null;
  data: NetworkModel[];
  selectedNetwork?: NetworkModel;
  onSelect?: (network: NetworkModel) => void;
  deposit?: boolean;
  withdraw?: boolean;
  feeSymbol?: string;
}

const NetworksInputModal: React.FC<Props> = ({
  className,
  showFee = false,
  showIcon = false,
  data = [],
  caption,
  selectedNetwork,
  onSelect,
  deposit,
  withdraw,
  feeSymbol,
}) => {
  const [wallet] = useLang(['wallet']);

  const { showSyncModal } = useModal(networksModalName);

  return (
    <div className={className}>
      <ModalInput
        onClick={() => {
          showSyncModal();
        }}
        label={wallet.network}
        placeholder={wallet.selectNetwork}
        align="left"
        value={
          selectedNetwork && (
            <span className="mx-2 font-medium text-sm leading-6 text-dark-700">
              {selectedNetwork?.title}
            </span>
          )
        }
      />
      {caption != null && caption}
      <NetworksModal
        showFee={showFee}
        showIcon={showIcon}
        data={data}
        onSelect={onSelect}
        deposit={deposit}
        withdraw={withdraw}
        feeSymbol={feeSymbol}
      />
    </div>
  );
};

export default NetworksInputModal;
