import React from 'react';
import RefferalsContent from './components/RefferalsContent';
import { useRouter } from 'next/router';
import RefferalModifyContent from './components/RefferalCodesLog/RefferalModify/RefferalModifyContent';

const ReferralsPage = () => {
  const { query } = useRouter();

  if (query.refferal_modify) return <RefferalModifyContent />;
  return <RefferalsContent />;
};

export default ReferralsPage;
