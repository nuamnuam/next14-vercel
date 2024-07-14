import React from 'react';
import KYCCard from './KYCCard';
import CardRowItem from '../CardRowItem';
import { Button, Chip } from '@/components/Common';
import {
  levelOneItems,
  levelTwoItems,
  levelZeroItems,
  levelZeroSteps,
} from '@/constants/kyc';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import useLevelsSteps from '../../hooks/useLevelsSteps';
import Link from 'next/link';

const KYCDesktopItems = () => {
  const [kyc] = useLang(['kyc']);

  const { data: userInfo } = useProfile();
  const { isDesktop } = useBreakpoint();
  const { levelOneSteps, levelTwoSteps, disabledLevelTwoUpgradeAction } =
    useLevelsSteps();

  const acceptedLevel1 = () => {
    if (
      !!userInfo?.kyc_info?.details?.['mobile-activation'] &&
      !!userInfo?.kyc_info?.details?.['personal-info'] &&
      !!userInfo?.kyc_info?.details?.['financial-info']
    ) {
      return <Chip variant="success" label={kyc.confirmed} />;
    } else if (
      [
        userInfo?.status?.first_name === 'Edited',
        userInfo?.status?.last_name === 'Edited',
        userInfo?.status?.bank_card === 'Edited',
      ].includes(true)
    ) {
      return <Chip variant="warning" label={kyc.pending} />;
    } else if (
      userInfo?.kyc_info?.details?.['personal-info'] === false &&
      !userInfo?.kyc_info?.details?.['financial-info']
    ) {
      return null;
    } else if (
      [
        userInfo?.status?.mobile_number === 'Unaccepted',
        userInfo?.status?.bank_card === 'Unaccepted',
      ].includes(true)
    ) {
      return <Chip variant="danger" label={kyc.needEdit} />;
    }
    return null;
  };

  const acceptedLevel2 = () => {
    if (
      // userInfo?.kyc_info?.details?.['phone-number'] === true &&
      userInfo?.kyc_info?.details?.['national-card-image'] &&
      userInfo?.kyc_info?.details?.['face-recognition'] &&
      userInfo?.kyc_info?.details?.['admin-approval'] &&
      userInfo?.verification === 'verified'
    ) {
      return <Chip variant="success" label={kyc.confirmed} />;
    } else if (
      // userInfo?.kyc_info?.details?.['phone-number'] === true &&
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
      return <Chip variant="warning" label={kyc.pending} />;
    } else if (
      userInfo?.status?.national_card_image === 'Unaccepted' ||
      (((userInfo?.status?.face_image === 'Unaccepted' &&
        userInfo?.status?.face_video !== 'Accepted') ||
        (userInfo?.status?.face_video === 'Unaccepted' &&
          userInfo?.status?.face_image !== 'Accepted')) &&
        !userInfo?.kyc_info?.details?.['face-recognition'])
    ) {
      return <Chip variant="danger" label={kyc.needEdit} />;
    }
  };

  return (
    <div className="flex gap-x-4">
      <KYCCard
        itemComponent={CardRowItem}
        header={
          <div className="flex w-full items-center justify-between p-4 pt-7 pl-7 sm:pl-6 sm:pr-6 sm:pt-6 sm:pb-6">
            <p className="text-base font-medium leading-6 text-dark-800	">
              {kyc.levelZero}
            </p>
            <Chip variant="success" label={kyc.confirmed} />
          </div>
        }
        items={levelZeroItems}
        steps={levelZeroSteps}
      />
      <KYCCard
        itemComponent={CardRowItem}
        header={
          <div className="flex w-full items-center justify-between p-4 pt-7 pl-7  sm:py-[26px] sm:pl-6 sm:pr-6">
            <p className="text-base font-medium leading-6 text-dark-800	">
              {kyc.levelOne}
            </p>
            {acceptedLevel1()}
          </div>
        }
        items={levelOneItems}
        steps={levelOneSteps}
        footer={
          isDesktop
            ? (!userInfo?.kyc_info?.details?.['personal-info'] ||
                !userInfo?.kyc_info?.details?.['financial-info']) && (
                <div className="px-4">
                  <Link href={'/panel/my-account/validation/level-one'}>
                    <Button size="md" fullWidth>
                      {kyc.upgradeToLevelOne}
                    </Button>
                  </Link>
                </div>
              )
            : null
        }
      />
      <KYCCard
        itemComponent={CardRowItem}
        header={
          <div className="flex w-full items-center justify-between p-4 pt-7 pl-7 sm:py-[26px] sm:pl-6 sm:pr-6">
            <p className="text-base font-medium leading-6 text-dark-800	">
              {kyc.levelTwo}
            </p>
            {acceptedLevel2()}
          </div>
        }
        items={levelTwoItems}
        steps={levelTwoSteps}
        footer={
          isDesktop &&
          !disabledLevelTwoUpgradeAction &&
          userInfo?.kyc_info?.level !== 'Level 0' ? (
            <div className="px-4">
              <Link href={'/panel/my-account/validation/level-two'}>
                <Button size="md" fullWidth>
                  {userInfo?.status?.phone_number === 'Unfilled' ||
                  userInfo?.status?.national_card_image === 'Accepted'
                    ? kyc.upgradeToLevelTwo
                    : kyc.editDocuments}
                </Button>
              </Link>
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default KYCDesktopItems;
