import React from 'react';
import { useBreakpoint, useLang } from '@/hooks';
import { TicketsTable } from './components';
import { Icon, IconButton, ResponsivePageHeader } from '@/components/Common';
import { useRouter } from 'next/router';
import ResponsiveTicketsTable from './components/ResponsiveTicketsTable';

const TicketsPage: React.FC = () => {
  const [tickets] = useLang(['tickets']);

  const router = useRouter();
  const { isDesktop } = useBreakpoint();

  return (
    <>
      <ResponsivePageHeader
        title={tickets.supportTicket}
        onBack={() => router.push('/panel/wallet/my-wallet')}
        extra={
          <IconButton
            className="border-dark-200 text-dark-600"
            size="lg"
            icon={<Icon icon="History-OutLined" size={16} />}
          />
        }
      />
      <div className="px-4 sm:px-8 lg:p-0">
        {isDesktop ? <TicketsTable /> : <ResponsiveTicketsTable />}
      </div>
    </>
  );
};

export default TicketsPage;
