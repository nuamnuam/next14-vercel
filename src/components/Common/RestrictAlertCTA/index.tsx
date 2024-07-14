import React from 'react';
import { useRouter } from 'next/router';
import { useLang } from '@/hooks';

import AlertCTA from '../AlertCTA';

export const NO_KYC_REASON = 'no_access_for_kyc';

const RestrictAlertCTA: React.FC = () => {
  const [kyc] = useLang(['kyc']);

  const router = useRouter();

  return (
    <AlertCTA
      title={kyc.noAuth}
      ctaTitle={kyc.fillKyc}
      variant="danger"
      size="lg"
      message={kyc.kycAlertMsg}
      onClick={async () => await router.push('/panel/my-account/validation')}
    />
  );
};

export default RestrictAlertCTA;
