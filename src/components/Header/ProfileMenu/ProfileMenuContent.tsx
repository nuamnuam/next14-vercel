import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffectOnce } from 'react-use';

import { Chip, Icon } from '@/components/Common';
import { useLogoutMutation } from '@/requests/auth/logoutMutation';
import { useProfileStore, authStore } from '@/store';
import { type Variant } from '@/components/Common/Chip';
import { useBreakpoint, useLang } from '@/hooks';
import { useProfileMutation } from '@/requests/profileMutation';
import { toPersianDigits } from '@/utils';

const ProfileMenuContent = () => {
  const [myAccount, global, menu] = useLang(['myAccount', 'global', 'menu']);

  const router = useRouter();

  const { mutateAsync: mutateLogoutAsync } = useLogoutMutation();
  const { mutateAsync } = useProfileMutation();
  const { profile: profileData, reset: resetProfile } = useProfileStore();

  const { reset } = authStore();
  const { isDesktop } = useBreakpoint();

  const getStatus: () => { title: string; variant: Variant } = () => {
    if (
      profileData?.status?.national_card_image === 'Unaccepted' ||
      (((profileData?.status?.face_image === 'Unaccepted' &&
        profileData?.status?.face_video !== 'Accepted') ||
        (profileData?.status?.face_video === 'Unaccepted' &&
          profileData?.status?.face_image !== 'Accepted')) &&
        !profileData?.kyc_info?.details?.['face-recognition'])
    ) {
      return {
        title: global.needEdit,
        variant: 'danger',
      };
    } else if (
      profileData?.kyc_info?.details?.['national-card-image'] &&
      profileData?.kyc_info?.details?.['face-recognition'] &&
      profileData?.kyc_info?.details?.['admin-approval'] &&
      profileData.verification === 'verified'
    ) {
      return {
        title: global.confirmed,
        variant: 'success',
      };
    } else if (
      profileData?.status?.national_card_image === 'Edited' ||
      (profileData?.kyc_info?.details?.['national-card-image'] &&
        profileData?.kyc_info?.details?.['face-recognition'] &&
        (!profileData?.kyc_info?.details?.['admin-approval'] ||
          profileData.verification !== 'verified'))
    ) {
      return {
        title: global.pending,
        variant: 'warning',
      };
    } else if (
      profileData?.kyc_info?.level === 'Level 1' &&
      profileData?.kyc_info?.details?.['personal-info'] &&
      profileData?.kyc_info?.details?.['financial-info']
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

  const logOut = async () => {
    await mutateLogoutAsync();
    resetProfile();
    reset();
    router.push('/auth/login');
  };

  useEffectOnce(() => {
    mutateAsync();
  });

  return (
    <React.Fragment>
      <Link
        href={isDesktop ? '/panel/my-account/profile' : '/panel/my-account'}
      >
        <div className="border-b border-dark-50 p-3 cursor-pointer">
          <span className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all">
            <Icon
              icon="UserAccount-OutLined"
              size={24}
              className="text-blue-3"
            />
            <span className="mr-3 text-base font-medium text-black">
              {profileData?.first_name || global.dearUser} , {global.welcome}
            </span>
          </span>
        </div>
      </Link>
      <div className="p-3">
        <div className="border-b border-dark-50 pb-3">
          <Link
            href={'/panel/dashboard'}
            className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
          >
            <Icon
              icon="Dashboard-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {menu.dashboard}
            </span>
          </Link>
          <Link
            href={'/panel/my-account/validation'}
            className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
          >
            <Icon
              icon="Verification-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {menu.kyc}
            </span>
            <Chip
              label={getStatus().title}
              classNames="mr-auto"
              variant={getStatus().variant}
            />
          </Link>
          <Link
            href={'/panel/my-account/commission'}
            className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
          >
            <Icon
              icon="Commission-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {menu.commision}
            </span>
            <Chip
              label={
                profileData?.commission?.['commission-level-name']
                  ? toPersianDigits(
                      profileData?.commission?.['commission-level-name'],
                    )
                  : global.zeroLevel
              }
              classNames="mr-auto"
              variant="info"
            />
          </Link>
          <Link
            href={'/panel/my-account/profile'}
            className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
          >
            <Icon
              icon="Account-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {menu.userProfile}
            </span>
          </Link>
          {profileData?.kyc_info?.level !== 'Level 0' ? (
            <Link
              href={'/panel/wallet/bank-accounts'}
              className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
            >
              <Icon
                icon="BankCard-TwoTone"
                size={20}
                className="[&>*]:fill-dark-200"
              />
              <span className="mr-2 text-sm font-medium text-dark-700">
                {menu.bankAccount}
              </span>
            </Link>
          ) : (
            <></>
          )}
          <Link
            href={'/panel/referrals'}
            className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
          >
            <Icon
              icon="Users-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {menu.inviteFriends}
            </span>
          </Link>
          <Link
            href={'/panel/my-account/security'}
            className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
          >
            <Icon
              icon="Shield-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {menu.security}
            </span>
          </Link>
          <Link
            href={'/panel/my-account/settings'}
            className="flex items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
          >
            <Icon
              icon="Gear-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {menu.settings}
            </span>
          </Link>
        </div>
        <div className="pt-3">
          <span
            className="flex cursor-pointer items-center rounded-lg p-3 duration-300 hover:bg-dark-50 hover:transition-all"
            onClick={logOut}
          >
            <Icon
              icon="Logout-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-2 text-sm font-medium text-dark-700">
              {global.logout}
            </span>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfileMenuContent;
