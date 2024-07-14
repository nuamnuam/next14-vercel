import React from 'react';
import { useRouter } from 'next/router';
import SecondStep from './SecondStep';
import FirstStep from './FirstStep';

const CryptoDepositContent = () => {
  const router = useRouter();

  if (router.query.step === '2') return <SecondStep />;
  return <FirstStep />;
};

export default CryptoDepositContent;
