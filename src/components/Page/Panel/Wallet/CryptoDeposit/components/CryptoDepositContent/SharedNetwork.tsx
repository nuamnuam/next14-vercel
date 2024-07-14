import React, { useMemo } from 'react';
import { useBreakpoint, useLang } from '@/hooks';
import { useDepositAddress } from '@/requests/panel/wallet/deposit/getDepositAddress';
import { useDepositStore } from '@/store';
import { Button } from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import DepositValueInput from '../DepositValueInput';

const SharedNetwork = () => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();

  const { selectedNetwork, depositValue } = useDepositStore((state) => ({
    selectedCoin: state.selectedCoin,
    selectedNetwork: state.selectedNetwork,
    depositValue: state.depositValue,
    setSelectedCoin: state.setSelectedCoin,
    setSelectedNetwork: state.setSelectedNetwork,
    setDepositValue: state.setDepositValue,
  }));

  const { isPending: isLoading, mutateAsync: getDepositAddress } =
    useDepositAddress();

  const submitIsDisabled = useMemo(() => {
    return (
      isLoading ||
      !depositValue ||
      !selectedNetwork ||
      Number(depositValue) === 0 ||
      Number(depositValue) < selectedNetwork?.min_deposit ||
      false
    );
  }, [depositValue, selectedNetwork]);

  const submit = () => {
    if (!selectedNetwork?.pb_id) return;
    const data = {
      pb_id: String(selectedNetwork.pb_id),
    };

    getDepositAddress();
  };

  return (
    <>
      {selectedNetwork && (
        <>
          <div className="mb-0 lg:mb-6">
            <DepositValueInput />
          </div>
          <ModalFooter fullScreen>
            <Button
              size={isDesktop ? 'lg' : 'md'}
              fullWidth
              onClick={submit}
              isLoading={isLoading}
              disabled={submitIsDisabled}
            >
              {wallet.continueDeposit}
            </Button>
          </ModalFooter>
        </>
      )}
    </>
  );
};

export default SharedNetwork;
