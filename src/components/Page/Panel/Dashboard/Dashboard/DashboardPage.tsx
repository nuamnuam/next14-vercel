import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { Card, Button, AlertCTA, Alert } from '@/components/Common';

import { SellBuyExchange, ChartSection, AdvancedMarketTable } from './index';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { useDashboardBanners } from '@/requests/panel/dashboard/getDashboardBanners';
import { Variant } from '@/components/Common/AlertCTA';

const DashboardPage: React.FC = () => {
  const [global, panelDashboard] = useLang(['global', 'panelDashboard']);

  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const [showValidationSkeleton, setShowValidationSkeleton] = useState(true);
  const { data: bannersData } = useDashboardBanners();
  const { data: userInfo } = useProfile();

  const getStatus = useMemo(() => {
    if (!userInfo?.kyc_info) return;
    setShowValidationSkeleton(false);

    if (userInfo?.kyc_info?.level === 'Level 2') {
      return {
        title: null,
        variant: null,
      };
    } else if (
      userInfo?.status?.national_card_image === 'Unaccepted' ||
      (((userInfo?.status?.face_image === 'Unaccepted' &&
        userInfo?.status?.face_video !== 'Accepted') ||
        (userInfo?.status?.face_video === 'Unaccepted' &&
          userInfo?.status?.face_image !== 'Accepted')) &&
        !userInfo?.kyc_info?.details?.['face-recognition'])
    ) {
      return {
        title: global.needEdit,
        variant: 'danger',
      };
    } else if (
      userInfo?.kyc_info?.details?.['national-card-image'] &&
      userInfo?.kyc_info?.details?.['face-recognition'] &&
      userInfo?.kyc_info?.details?.['admin-approval'] &&
      userInfo.verification === 'verified'
    ) {
      return {
        title: null,
        variant: null,
      };
    } else if (
      userInfo?.status?.national_card_image === 'Edited' ||
      (userInfo?.kyc_info?.details?.['national-card-image'] &&
        userInfo?.kyc_info?.details?.['face-recognition'] &&
        (!userInfo?.kyc_info?.details?.['admin-approval'] ||
          userInfo.verification !== 'verified'))
    ) {
      return {
        title: global.pending,
        variant: 'warning',
      };
    } else if (
      userInfo?.kyc_info?.level === 'Level 1' &&
      userInfo?.kyc_info?.details?.['personal-info'] &&
      userInfo?.kyc_info?.details?.['financial-info'] &&
      userInfo?.kyc_info?.details?.['national-card-image'] &&
      userInfo?.kyc_info?.details?.['face-recognition']
    ) {
      return {
        title: null,
        variant: null,
      };
    }
    return {
      title: panelDashboard.notAuthorized,
      variant: 'warning',
    };
  }, [userInfo]);

  const showMigrateUserAlert = useMemo(() => {
    if (!userInfo) return false;

    return (
      userInfo.verification === 'verified' &&
      (!userInfo.national_code || !userInfo.birthday)
    );
  }, [userInfo]);

  return (
    <>
      {showValidationSkeleton ? (
        <></>
      ) : (
        getStatus?.title &&
        getStatus?.title !== global.pending && (
          <AlertCTA
            className="mb-6 lg:mb-8"
            title={getStatus?.title ?? ''}
            ctaTitle={panelDashboard.completeAuthorization}
            variant={(getStatus.variant as Variant) ?? 'warning'}
            size="lg"
            message={panelDashboard.needAuthorizationToWithdraw}
            onClick={async () =>
              await router.push('/panel/my-account/validation')
            }
          />
        )
      )}
      {showMigrateUserAlert && (
        <AlertCTA
          className="mb-6 lg:mb-8"
          title={panelDashboard.completeIdentityInfo}
          ctaTitle={panelDashboard.completeInfo}
          variant="warning"
          size="lg"
          message={panelDashboard.completeIdentityInfoMsg}
          onClick={async () => await router.push('/panel/migrate-user')}
        />
      )}
      <ChartSection />

      {bannersData?.data?.[0] && (
        <div
          className="my-8 flex flex-col items-center justify-between rounded-lg p-6 md:p-8 text-center lg:flex-row lg:p-6 lg:text-right"
          style={{
            backgroundColor: bannersData?.data?.[0]?.attributes?.colorCode,
          }}
        >
          <div className="md:flex-row flex-col flex items-center">
            <div className="ml-6">
              <img
                src={`${process.env.NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL}${bannersData?.data?.[0]?.attributes?.media?.data?.attributes?.url}`}
                height={100}
                width={100}
                alt="media"
              />
            </div>
            <div className="flex flex-col mt-4 md:mt-0">
              <span className="!text-white text-xl font-bold text-center md:text-right mt-0 md:mb-0">
                {bannersData?.data?.[0]?.attributes?.title}
              </span>
              <span className=" text-sm text-dark-50 text-center md:text-right mt-3 mb-1 lg:mb-0">
                {bannersData?.data?.[0]?.attributes?.description}
              </span>
            </div>
          </div>
          <div className="mt-2 lg:mt-10 flex w-full items-center lg:mr-auto lg:w-fit">
            <Button
              onClick={async () => {
                if (!bannersData?.data?.[0]?.attributes?.title) return;
                await router.push(bannersData.data[0].attributes.ctaUrl);
              }}
              size="sm"
              variant="secondary"
              className="!rounded-md"
              fullWidth={!isDesktop}
            >
              {bannersData?.data?.[0]?.attributes?.cta}
            </Button>
          </div>
        </div>
      )}
      <SellBuyExchange />
      <Card classNames="mt-8">
        <AdvancedMarketTable />
      </Card>
    </>
  );
};

export default DashboardPage;
