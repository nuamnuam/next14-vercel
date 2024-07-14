import React from 'react';

import TwoStepAuthentication from './components/TwoStepAuthentication';
import ChangePassword from './components/ChangePassword/ChangePasswordPage';
import LinkedDevicesPage from './components/LinkedDevices/LinkedDevicesPage';
import ActivityHistoryPage from './components/ActivityHistory/ActivityHistoryPage';
import { useLang } from '@/hooks';

const SecurityPage: React.FC = () => {
  const [security] = useLang(['security']);

  return (
    <>
      <TwoStepAuthentication
        title={security.twoStepAuthentication}
        subTitle={security.increaseTwoStepAuthenticationSecurity}
      />
      <div className="hidden lg:block">
        <ChangePassword />
      </div>
      <div className="hidden lg:block">
        <LinkedDevicesPage />
      </div>
      <div className="hidden lg:block">
        <ActivityHistoryPage />
      </div>
    </>
  );
};

export default SecurityPage;
