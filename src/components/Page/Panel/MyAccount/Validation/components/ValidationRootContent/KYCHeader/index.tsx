import React from 'react';
import { GuideButton } from '@/components/Common';
import KYCStatus from './KYCStatus';
import { useLang } from '@/hooks';

const KYCHeader = () => {
  const [kyc] = useLang(['kyc']);

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex gap-6">
        <span className="flex items-center">
          <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
            {kyc.authentication}
          </h1>
        </span>
        <KYCStatus />
      </div>
      <GuideButton />
    </div>
  );
};

export default KYCHeader;
