import React from 'react';

import { useBreakpoint } from '@/hooks';

import DesktopTable from './DesktopTable';
import ResponsiveTable from './ResponsiveTable';

interface Props {
  showFilters: boolean;
  hasLoadMore?: boolean;
}

const OrdersHistoryTable: React.FC<Props> = (props) => {
  const { isDesktop } = useBreakpoint();

  if (!isDesktop) return <ResponsiveTable {...props} />;
  return <DesktopTable {...props} />;
};

export default OrdersHistoryTable;
