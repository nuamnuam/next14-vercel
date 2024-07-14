import { useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { modalContext } from '@/components/ModalProvider';

const openedSyncModals: string[] = [];

export const useModal = (modalName: string, replace = false) => {
  const router = useRouter();

  const { forceUpdate } = useContext(modalContext);

  const toggleModal = (
    status: boolean,
    params: string,
    callback?: () => void,
  ) => {
    try {
      if (status) {
        let modals: string[] = [];
        if (router.query.modal) {
          if (Array.isArray(router.query.modal)) {
            modals = [...router.query.modal];
          } else {
            modals.push(router.query.modal);
          }
        }
        if (!router.query.modal?.includes(modalName)) modals.push(modalName);

        const newQuerirs: { modal: string[]; params?: string } = {
          ...router.query,
          modal: modals,
        };

        if (params) newQuerirs.params = params;
        if (replace) {
          router.replace({
            pathname: router.pathname,
            query: newQuerirs,
          });
        }
        router.push({
          pathname: router.pathname,
          query: newQuerirs,
        });
      } else router.back();

      forceUpdate({});
      callback != null && callback();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSyncModal = (status: boolean, callback?: () => void) => {
    try {
      if (isSyncModalOpen) {
        const openedModalIndex = openedSyncModals.indexOf(modalName);
        if (openedModalIndex < 0) return;
        openedSyncModals.splice(openedModalIndex, 1);
      } else {
        if (status) {
          if (!openedSyncModals.includes(modalName))
            openedSyncModals.push(modalName);
        } else {
          const openedModalIndex = openedSyncModals.indexOf(modalName);
          if (openedModalIndex < 0) return;
          openedSyncModals.splice(openedModalIndex, 1);
        }
      }
      callback?.();
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = useCallback(
    (params: string = '', callback?: () => void) => {
      toggleModal(true, params, callback);
    },
    [toggleModal],
  );

  const showSyncModal = useCallback(
    (callback?: () => void) => {
      toggleSyncModal(true, callback);
      forceUpdate({});
    },
    [toggleSyncModal, forceUpdate],
  );

  const closeModal = useCallback(
    (params: string = '', callback?: () => void) => {
      toggleModal(false, params, callback);
    },
    [toggleModal],
  );

  const closeSyncModal = useCallback(
    (callback?: () => void) => {
      toggleSyncModal(false, callback);
      forceUpdate({});
    },
    [toggleSyncModal, forceUpdate],
  );

  const isModalOpen = router.query.modal?.includes(modalName) ?? false;

  const isSyncModalOpen = openedSyncModals?.includes(modalName) ?? false;

  return {
    showModal,
    showSyncModal,
    closeModal,
    closeSyncModal,
    isModalOpen,
    isSyncModalOpen,
  };
};
