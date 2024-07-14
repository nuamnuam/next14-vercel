import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';

import { useModal } from '@/hooks/useModal';
import { useBreakpoint, useLang, useProfile } from '@/hooks';

import ChangeAddress from './ContactInfoForms/ChangeAddressForm';
import ChangePhoneNumberForm from './ContactInfoForms/ChangePhoneNumberForm';
import ChangeMobileNumberForm from './ContactInfoForms/ChangeMobileNumberForm';
import ChangeEmailForm from './ContactInfoForms/ChangeEmailForm';

const modalName = 'contactFormsModal';

const usePersonalInfo = () => {
  const [global, myAccount] = useLang(['global', 'myAccount']);

  const { data: userProfile, refetch: reFetchProfile } = useProfile();
  const {
    mobile_number,
    kyc_info,
    email,
    phone_number,
    address,
    status,
    verification,
  } = userProfile || {};

  const { isDesktop } = useBreakpoint();
  const [contactInfoTab, setContactInfoTab] = useState('');
  const router = useRouter();
  const { showSyncModal, closeSyncModal } = useModal(modalName);

  const generateAddress = () =>
    (address?.province ? address?.province + ', ' : '') +
      (address?.city ? address?.city + ', ' : '') +
      (address?.location ? address?.location + ', ' : '') +
      (address?.house_number ? address?.house_number + ', ' : '') +
      (address?.postal_code ? address?.postal_code : '') ?? '-';

  const getStatus = () => {
    if (
      status?.national_card_image === 'Unaccepted' ||
      (((status?.face_image === 'Unaccepted' &&
        status?.face_video !== 'Accepted') ||
        (status?.face_video === 'Unaccepted' &&
          status?.face_image !== 'Accepted')) &&
        !kyc_info?.details?.['face-recognition'])
    ) {
      return {
        title: global.needEdit,
        variant: 'danger',
      };
    } else if (
      // kyc_info?.details?.['phone-number'] &&
      kyc_info?.details?.['national-card-image'] &&
      kyc_info?.details?.['face-recognition'] &&
      kyc_info?.details?.['admin-approval'] &&
      verification === 'verified'
    ) {
      return {
        title: global.confirmed,
        variant: 'success',
      };
    } else if (
      // status?.national_card_image === 'Edited' ||
      // // kyc_info?.details?.['phone-number'] &&
      // (kyc_info?.details?.['national-card-image'] &&
      //   kyc_info?.details?.['face-recognition'] &&
      //   !kyc_info?.details?.['admin-approval'])

      (kyc_info?.details?.['national-card-image'] &&
        kyc_info?.details?.['face-recognition'] &&
        (!kyc_info?.details?.['admin-approval'] ||
          verification !== 'verified')) ||
      ([status?.face_video, status?.face_image].includes('Edited') &&
        ![status?.face_video, status?.face_image].includes('Accepted') &&
        kyc_info?.details?.['face-recognition'] === false) ||
      status?.national_card_image === 'Edited'
    ) {
      return {
        title: global.pending,
        variant: 'warning',
      };
    } else if (
      kyc_info?.level === 'Level 1' &&
      kyc_info?.details?.['personal-info'] &&
      kyc_info?.details?.['financial-info']
    ) {
      return {
        title: global.confirmed,
        variant: 'success',
      };
    }
    return {
      title: myAccount.notAuthorized,
      variant: 'danger',
    };
  };
  const checkRenderEl = useCallback(
    (el: string) => {
      if (el === 'level') {
        return true;
      } else if (
        el === 'personal-info' &&
        kyc_info?.details?.['personal-info']
      ) {
        return true;
      } else if (el === 'contact-info' && kyc_info?.level === 'Level 0') {
        return true;
      }
    },
    [kyc_info?.level],
  );

  const getModalContent = (page: string) => {
    switch (page) {
      case 'mobile_number':
        return (
          <ChangeMobileNumberForm
            closeModal={closeSyncModal}
            currentMobile={mobile_number}
          />
        );
      case 'phone_number':
        return (
          <ChangePhoneNumberForm
            closeModal={closeSyncModal}
            isEdit={!!phone_number?.main_number}
            reFetchProfile={reFetchProfile}
          />
        );
      case 'email':
        return (
          <ChangeEmailForm
            currentEmail={email}
            closeModal={closeSyncModal}
            isEdit={!!email}
          />
        );
      case 'address':
        return (
          <ChangeAddress closeModal={closeSyncModal} defaultAddress={address} />
        );
      default:
        return null;
    }
  };
  const contactInfoList = useMemo(
    () => [
      {
        name: global.mobileNumber,
        value: mobile_number ?? '',
        onClick: () => {
          showSyncModal();
          setContactInfoTab('mobile_number');
        },
        href: '/panel/my-account/profile/change-mobile',
      },
      {
        name: global.phoneNumber,
        value:
          phone_number?.area_code && phone_number?.main_number
            ? phone_number?.area_code + phone_number?.main_number
            : '',
        onClick: () => {
          showSyncModal();
          setContactInfoTab('phone_number');
        },
        href: '/panel/my-account/profile/change-phone',
      },
      {
        name: global.email,
        value: email ?? '',
        onClick: () => {
          showSyncModal();
          setContactInfoTab('email');
        },
        href: '/panel/my-account/profile/change-email',
      },
      {
        name: global.address,
        value: generateAddress() ? generateAddress() : '',
        onClick: () => {
          showSyncModal();
          setContactInfoTab('address');
        },
        href: '/panel/my-account/profile/change-address',
        additionalClassNames: 'text-center',
      },
    ],
    [mobile_number, phone_number, email, address],
  );

  const isNotAuthorized =
    kyc_info?.level === 'Level 0' &&
    !kyc_info?.details?.['admin-approval'] &&
    verification !== 'verified' &&
    !kyc_info?.details?.['face-recognition'] &&
    !kyc_info?.details?.['financial-info'] &&
    !kyc_info?.details?.['national-card-image'] &&
    !kyc_info?.details?.['personal-info'];
  // && !kyc_info?.details?.['phone-number'];

  const isAuthorized =
    kyc_info?.details?.['financial-info'] &&
    kyc_info?.details?.['personal-info'];
  const needAuthEdit =
    !kyc_info?.details?.['financial-info'] &&
    kyc_info?.details?.['personal-info'];

  return {
    checkRenderEl,
    getModalContent,
    contactInfoList,
    showSyncModal,
    closeSyncModal,
    contactInfoTab,
    setContactInfoTab,
    isDesktop,
    router,
    isNotAuthorized,
    isAuthorized,
    needAuthEdit,
    getStatus,
  };
};
export default usePersonalInfo;
