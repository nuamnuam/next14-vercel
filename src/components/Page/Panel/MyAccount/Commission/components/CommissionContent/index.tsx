import React from 'react';
import CommissionLevel from '../CommissionLevel';
import CommissionTables from '../CommissionTables';
import { ResponsivePageHeader } from '@/components/Common';
import { useRouter } from 'next/router';
import { useLang } from '@/hooks';

const CommissionContent = () => {
  const [commisson] = useLang(['commisson']);

  const router = useRouter();
  return (
    <>
      <ResponsivePageHeader
        title={commisson.commssionLevel}
        onBack={() => router.back()}
      />
      <div className="px-4 sm:px-8 lg:p-0">
        <CommissionLevel />
        <CommissionTables />
      </div>
    </>
  );
};

export default CommissionContent;
