import React, { useEffect, useState } from 'react';

import { Button, Modal, Icon, IconButton } from '@/components/Common';
import Chip from '@/components/Common/Chip';
import { useModal } from '@/hooks/useModal';
import { useLogoutMutation } from '@/requests/auth/logoutMutation';
import { toPersianDigits } from '@/utils';

import ProfileSection from './ProfileSection';
import AuthItem from '../../Dashboard/List/AuthItem';
import Header from './Components/Header';
import { useRouter } from 'next/router';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLang, useProfile } from '@/hooks';
import { useMessagesQuery } from '@/requests/panel/messages';
import NotificationsMenuModal, {
  notificationsModalName,
} from '@/components/Header/NotificationsMenu/NotificationsMenuModal';

type ILevel = Record<string, string>;

const kycModal = 'kycModal';

const MyAccountPage = () => {
  const [global, myAccount, kyc] = useLang(['global', 'myAccount', 'kyc']);

  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { data: notifications } = useMessagesQuery();
  const [kycPage, setKYCPage] = useState<string>('');
  const [extraHeaderBtnAction, setExtraHeaderBtnAction] = useState<string>('');
  const {
    data: userInfo,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useProfile();

  const { mutateAsync: mutateLogoutAsync } = useLogoutMutation();

  useEffect(() => {
    if (!isDesktop) return;
    router.replace('/panel/my-account/profile');
  }, [isDesktop]);

  const {
    showSyncModal: showNotificationsModal,
    closeSyncModal: closeNotificationsModal,
  } = useModal(notificationsModalName);

  useEffect(() => {}, [extraHeaderBtnAction]);

  const getModalTitle = () => {
    switch (kycPage) {
      case 'upgrade-to-level-1':
      case 'level-one-congrats':
        return kyc.levelOneAuthentication;
      case 'level-two-congrats':
        return kyc.levelTwoAuthentication;
      case 'upgrade-to-level-2':
        return kyc.levelTwoAuthentication;
      case 'authority':
        return kyc.confirmAuthority;
      case 'upload-selfie':
      case 'preview-selfie':
        return kyc.uploadSelfie;
      case 'upload-video':
        return kyc.confirmVideoAuthority;
      case 'record-video':
      case 'take-video-again':
        return kyc.recordVideo;
      default:
        return myAccount.authentication;
    }
  };
  const modalExtraHeader = () => {
    switch (kycPage) {
      case 'upgrade-to-level-1':
      case 'upgrade-to-level-2':
      case 'authority':
        return (
          <Button
            onClick={() => {
              refetchUser();
            }}
            className="border-1 border-dark-200"
            variant="text"
          >
            {global.cancel}
          </Button>
        );
      case 'upload-selfie':
        return (
          <div className="flex items-center justify-end">
            <Icon
              icon={'AddPicture-OutLined'}
              className="[&>*]:fill-warning-600"
              size={18}
            />

            <Button
              onClick={() => {
                setExtraHeaderBtnAction('sample-selfie');
              }}
              className="pl-0 pr-2 text-sm text-warning-600"
              variant="text"
            >
              {kyc.sampleSelfie}
            </Button>
          </div>
        );
      case 'level-one-congrats':
      case 'upload-video':
      case 'level-two-congrats':
        return null;
      case 'preview-selfie':
        return (
          <div
            className=" flex cursor-pointer items-center justify-end gap-x-2"
            onClick={() => {
              setExtraHeaderBtnAction('upload-selfie');
            }}
          >
            <Icon
              icon={'Reload-OutLined'}
              className="[&>*]:fill-primary-500"
              size={16}
            />
            <p className="text-sm font-medium leading-6 text-primary-600">
              {myAccount.selectAgain}
            </p>
          </div>
        );
      case 'take-video-again':
        return (
          <div
            className=" flex cursor-pointer items-center justify-end gap-x-2"
            onClick={() => {
              setExtraHeaderBtnAction('record-selfie-again');
              setKYCPage('record-video');
            }}
          >
            <Icon
              icon={'Reload-OutLined'}
              className="[&>*]:fill-danger-600"
              size={16}
            />
            <p className="text-sm font-medium leading-6 text-danger-500">
              {kyc.recordAgain}
            </p>
          </div>
        );
      case 'record-video':
        return (
          <div
            className="flex items-center justify-end gap-x-2"
            onClick={() => {
              setExtraHeaderBtnAction('authority');
            }}
          >
            <Icon
              icon={'VideoCamera-OutLined'}
              className="[&>*]:fill-primary-500"
              size={24}
            />
            <p className="cursor-pointer text-sm font-medium leading-6 text-primary-600">
              {kyc.changeWay}
            </p>
          </div>
        );
      default:
        return (
          <Chip
            variant="secondary"
            classNames="bg-dark-500 !text-white"
            label={` ${levels[userInfo?.kyc_info?.level ?? 0]}`}
          />
        );
    }
  };

  const getStatus = () => {
    if (
      userInfo?.status?.national_card_image === 'Unaccepted' ||
      (((userInfo?.status?.face_image === 'Unaccepted' &&
        userInfo?.status?.face_video !== 'Accepted') ||
        (userInfo?.status?.face_video === 'Unaccepted' &&
          userInfo?.status?.face_image !== 'Accepted')) &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        userInfo?.kyc_info?.details?.['face-recognition'] === false)
    ) {
      return {
        title: myAccount.needEdit,
        variant: 'danger',
      };
    } else if (
      // userInfo?.kyc_info?.details?.['phone-number'] === true &&
      userInfo?.kyc_info?.details?.['national-card-image'] &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
      userInfo?.kyc_info?.details?.['face-recognition'] === true &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
      userInfo?.kyc_info?.details?.['admin-approval'] === true &&
      userInfo.verification === 'verified'
    ) {
      return {
        title: myAccount.confirmed,
        variant: 'success',
      };
    } else if (
      // userInfo?.status?.national_card_image === 'Edited' ||
      // (userInfo?.kyc_info?.details?.['phone-number'] === true &&
      //   userInfo?.kyc_info?.details?.['national-card-image'] &&
      //   userInfo?.kyc_info?.details?.['face-recognition'] &&
      //   !userInfo?.kyc_info?.details?.['admin-approval'])

      (userInfo?.kyc_info?.details?.['national-card-image'] &&
        userInfo?.kyc_info?.details?.['face-recognition'] &&
        (!userInfo?.kyc_info?.details?.['admin-approval'] ||
          userInfo?.verification !== 'verified')) ||
      ([userInfo?.status?.face_video, userInfo?.status?.face_image].includes(
        'Edited',
      ) &&
        ![userInfo?.status?.face_video, userInfo?.status?.face_image].includes(
          'Accepted',
        ) &&
        userInfo?.kyc_info?.details?.['face-recognition'] === false) ||
      userInfo?.status?.national_card_image === 'Edited'
    ) {
      return {
        title: myAccount.pending,
        variant: 'warning',
      };
    } else if (
      userInfo?.kyc_info?.level === 'Level 1' &&
      userInfo?.kyc_info?.details?.['personal-info'] &&
      userInfo?.kyc_info?.details?.['financial-info']
    ) {
      return {
        title: myAccount.confirmed,
        variant: 'success',
      };
    }
    return {
      title: myAccount.notAuthorized,
      variant: 'danger',
    };
  };

  const levels: ILevel = {
    'Level 0': myAccount.levelZero,
    'Level 1': myAccount.levelOne,
    'Level 2': myAccount.levelTwo,
  };

  return (
    <>
      {!isDesktop && (
        <Header
          title={myAccount.profile}
          onBack={() => router.push('/panel/dashboard')}
          extra={
            <IconButton
              size="lg"
              onClick={() => {
                showNotificationsModal();
              }}
              icon={
                <Icon
                  icon="Bell-OutLined"
                  size={20}
                  className="fill-dark-600"
                />
              }
              badge={notifications?.result?.unread_notifications_count || 0}
              className="border-dark-200"
            />
          }
        />
      )}
      <div className="px-4 sm:px-8 lg:px-0">
        <ProfileSection
          header={
            <div className="flex w-full items-center justify-between py-5 px-4 sm:px-6">
              <p className="text-base font-medium leading-6 text-dark-800	flex gap-2 items-center">
                {userInfo?.first_name?.substring(0, 1) && (
                  <div className="flex bg-primary-50 text-primary-500 font-medium pb-1 h-10 w-10 justify-center items-center rounded-md lg:hidden">
                    {userInfo?.first_name?.substring(0, 1)}
                  </div>
                )}
                <div className="dir-ltr text-right">
                  {userInfo?.first_name
                    ? userInfo?.first_name + ' ' + userInfo?.last_name
                    : toPersianDigits(userInfo?.mobile_number)}
                </div>
              </p>
              <Chip
                size="sm"
                classNames="bg-dark-500 !text-white"
                variant="secondary"
                label={`${myAccount.authentication} ${
                  levels[userInfo?.kyc_info?.level ?? 1] || ''
                }`}
              />
            </div>
          }
          itemComponent={AuthItem}
          items={[
            {
              name: myAccount.authentication,
              status: getStatus()?.title,
              icon: 'Verification-TwoTone',
              href: '/panel/my-account/validation',
              statusVariant: getStatus()?.variant,
              isLoading: userLoading,
            },
            {
              name: myAccount.commission,
              href: '/panel/my-account/commission',
              status: toPersianDigits(
                userInfo?.commission['commission-level-name'] || '',
              ),
              statusVariant: 'info',
              icon: 'Commission-TwoTone',
              isLoading: userLoading,
            },
          ]}
        />
        <div className="mt-8">
          <ProfileSection
            title={userInfo?.first_name ?? '' + userInfo?.last_name ?? ''}
            itemComponent={AuthItem}
            header={null}
            items={[
              {
                name: myAccount.userProfile,
                icon: 'Account-TwoTone',
                href: '/panel/my-account/profile',
              },
              ...(userInfo?.kyc_info.details?.['financial-info']
                ? [
                    {
                      name: myAccount.bankAccount,
                      icon: 'BankCard-TwoTone',
                      href: '/panel/wallet/bank-accounts',
                    },
                  ]
                : []),
              {
                name: myAccount.invite,
                icon: 'Users-TwoTone',
                href: '/panel/referrals',
              },
              {
                name: myAccount.security,
                icon: 'Shield-TwoTone',
                href: '/panel/my-account/security',
              },
              {
                name: myAccount.settings,
                icon: 'Gear-TwoTone',
                href: '/panel/my-account/settings',
              },
            ]}
          />
        </div>
        <div className="mt-8">
          <ProfileSection
            title={userInfo?.first_name ?? '' + userInfo?.last_name ?? ''}
            itemComponent={AuthItem}
            items={[
              {
                name: global.logout,
                icon: 'Logout-TwoTone',
                onClick: mutateLogoutAsync,
              },
            ]}
          />
        </div>
      </div>
      <NotificationsMenuModal />
    </>
  );
};

export default MyAccountPage;
