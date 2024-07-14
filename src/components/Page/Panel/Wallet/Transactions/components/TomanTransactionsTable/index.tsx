import React from 'react';
import clsx from 'classnames';
import { Icon, IconButton } from '@/components/Common';
import Filters from '../TomanTransactionsTable/Filters';
import { useBreakpoint } from '@/hooks';
import TransactionType from './Filters/TransactionType';
import TomanFiltersModal, {
  tomanFiltersModalName,
} from './Filters/FiltersModal';
import { useModal } from '@/hooks/useModal';
import DesktopTable from './DesktopTable';
import ResponsiveTable from './ResponsiveTable';

export type RowItem = {
  date: string;
  value?: string;
  status: React.ReactNode;
  actions: React.ReactNode;
};
interface Props {
  showFilters: boolean;
  isLoading: boolean;
}

const TomanTransactionsTable: React.FC<Props> = ({
  showFilters,
  isLoading,
}) => {
  const { isDesktop } = useBreakpoint();
  const { showSyncModal } = useModal(tomanFiltersModalName);

  return (
    <div>
      {isDesktop && (
        <div
          className={clsx(
            'select-none px-10 pt-4 pb-5',
            !showFilters && 'hidden',
          )}
        >
          <Filters />
        </div>
      )}
      {!isDesktop && (
        <div>
          <div className="flex gap-4 px-4 py-8 md:py-6 md:px-8">
            <div className="flex-1">
              <TransactionType noLabel />
            </div>
            <IconButton
              className={clsx(showFilters && '!border-primary-600')}
              size="lg"
              onClick={() => {
                showSyncModal();
              }}
              icon={
                <Icon
                  icon="Filter-OutLined"
                  size={20}
                  className="text-dark-600"
                />
              }
            />
          </div>
          <TomanFiltersModal />
        </div>
      )}
      {isDesktop ? (
        <DesktopTable isLoading={isLoading} />
      ) : (
        <ResponsiveTable isLoading={isLoading} />
      )}
    </div>
  );
};

export default TomanTransactionsTable;
