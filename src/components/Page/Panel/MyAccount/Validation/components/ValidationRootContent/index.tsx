import React, { useMemo } from 'react';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { Alert, IconButton, ResponsivePageHeader } from '@/components/Common';
import KYCDesktopItems from './KYCDesktopItems';
import KYCResponsiveItems from './KYCResponsiveItems';
import KYCHeader from './KYCHeader';
import { useEffectOnce } from 'react-use';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import KYCStatus from './KYCHeader/KYCStatus';

const ValidationRootContent: React.FC = () => {
  const [kyc] = useLang(['kyc']);

  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const { data: userInfo, refetch, isLoading } = useProfile();

  useEffectOnce(() => {
    refetch();
  });

  const isVerifiedUser = userInfo?.kyc_info.level === 'Level 2';

  const uploadedDocsError = useMemo(() => {
    if (userInfo?.status?.national_card_image === 'Unaccepted') {
      return kyc.identificationDocument;
    }
    if (
      (userInfo?.status?.face_image === 'Unaccepted' &&
        userInfo.status?.face_video === 'Unaccepted') ||
      (userInfo?.status?.face_image === 'Unaccepted' &&
        userInfo.status?.face_video === 'Unfilled') ||
      (userInfo?.status?.face_video === 'Unaccepted' &&
        userInfo.status?.face_image === 'Unfilled')
    ) {
      return kyc.confirmAuthority;
    }
    return null;
  }, [userInfo]);

  return (
    <>
      <ResponsivePageHeader
        title={kyc.authentication}
        onBack={() => router.push('/panel/my-account')}
        extra={<KYCStatus />}
      />
      <div className="px-4 sm:px-8 lg:p-0">
        {isDesktop && <KYCHeader />}
        <div className="lg:mt-8">
          {!isVerifiedUser ? (
            <Alert
              slug={{ feature: 'user-verification', section: 'kyc-overview' }}
            />
          ) : (
            <></>
          )}
          {isLoading ? (
            <div className="mt-4 lg:mt-6">
              <AlertSkeleton />
            </div>
          ) : uploadedDocsError ? (
            <Alert
              message={`${uploadedDocsError} ${kyc.pluasNeedEdit}`}
              variant="danger"
              className="mt-4 lg:mt-6"
            />
          ) : null}
        </div>
        <div className="mt-6 sm:mt-8 bg-white lg:bg-transparent rounded-lg">
          {isDesktop ? <KYCDesktopItems /> : <KYCResponsiveItems />}
        </div>
      </div>
    </>
  );
};

export default ValidationRootContent;

const AlertSkeleton = () => {
  return (
    <div className="bg-danger-50 flex items-center rounded-lg h-[44px] px-4 gap-2">
      <Skeleton
        variant="circular"
        width={14}
        height={14}
        sx={{ bgcolor: '#686D871A' }}
      />
      <Skeleton
        variant="rounded"
        sx={{ bgcolor: '#686D871A', borderRadius: '8px' }}
        height={'14px'}
        width={'105px'}
      />
    </div>
  );
};
