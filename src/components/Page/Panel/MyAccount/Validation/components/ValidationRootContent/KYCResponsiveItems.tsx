import React, { useCallback, useEffect, useState } from 'react';
import { Button, Chip, Spinner, SwimTab } from '@/components/Common';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import KYCCard from './KYCCard';
import CardRowItem from '../CardRowItem';
import {
  levelOneItems,
  levelTwoItems,
  levelZeroItems,
  levelZeroSteps,
} from '@/constants/kyc';
import useLevelsSteps from '../../hooks/useLevelsSteps';
import Link from 'next/link';
import ModalFooter from '@/components/Common/Modal/ModalFooter';

const KYCResponsiveItems = () => {
  const [kyc] = useLang(['kyc']);

  const [activeTab, setActiveTab] = useState<string | number>();
  const { isDesktop } = useBreakpoint();
  const { data: userInfo, isLoading: userLoading } = useProfile();
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

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'level_zero':
        return (
          <KYCCard
            itemComponent={CardRowItem}
            items={levelZeroItems}
            steps={levelZeroSteps}
            status={renderStatus()}
          />
        );
      case 'level_one':
        return (
          <KYCCard
            itemComponent={CardRowItem}
            items={levelOneItems}
            steps={levelOneSteps}
            status={renderStatus()}
            footer={
              isDesktop ? (
                <div className="px-4">
                  <Link href={'/panel/my-account/validation/level-one'}>
                    <Button size="lg" fullWidth>
                      {kyc.upgradeToLevelOne}
                    </Button>
                  </Link>
                </div>
              ) : null
            }
          />
        );
      case 'level_two':
        return (
          <KYCCard
            itemComponent={CardRowItem}
            items={levelTwoItems}
            steps={levelTwoSteps}
            status={renderStatus()}
            footer={
              isDesktop ? (
                <div className="px-4">
                  <Link href={'/panel/my-account/validation/level-two'}>
                    <Button size="lg" fullWidth>
                      {kyc.upgradeToLevelTwo}
                    </Button>
                  </Link>
                </div>
              ) : null
            }
          />
        );
      default:
        return null;
    }
  }, [activeTab]);

  const renderStatus = useCallback(() => {
    switch (activeTab) {
      case 'level_zero':
        return <Chip variant="success" label={kyc.confirmed} />;
      case 'level_one':
        return acceptedLevel1();
      case 'level_two':
        return acceptedLevel2();
      default:
        return null;
    }
  }, [userInfo, activeTab]);

  useEffect(() => {
    if (userLoading) return;
    if (
      userInfo?.kyc_info.level === 'Level 1' ||
      userInfo?.kyc_info.level === 'Level 2'
    ) {
      setActiveTab('level_two');
    }

    if (userInfo?.kyc_info.level === 'Level 0') {
      setActiveTab('level_one');
    }
  }, [userInfo, userLoading]);

  const tableTypes = [
    {
      id: 'level_zero',
      label: kyc.levelZero,
    },
    {
      id: 'level_one',
      label: kyc.levelOne,
    },
    {
      id: 'level_two',
      label: kyc.levelTwo,
    },
  ];

  return (
    <div>
      <div className="border-b border-dark-50 flex items-center w-full">
        <SwimTab
          items={tableTypes}
          itemClassName="pt-[18px] pb-4 w-1/3 sm:w-32"
          initial={activeTab}
          callback={setActiveTab}
          className="w-full sm:w-auto"
        />
        <div className="hidden sm:block mr-auto ml-4">{renderStatus()}</div>
      </div>
      {userLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      ) : (
        renderContent()
      )}
      {userInfo?.kyc_info?.level !== 'Level 2' && (
        <ModalFooter fullScreen>
          {!userInfo?.kyc_info?.details?.['personal-info'] ||
          !userInfo?.kyc_info?.details?.['financial-info'] ? (
            <Link href={'/panel/my-account/validation/level-one'}>
              <Button size="lg" fullWidth>
                {kyc.upgradeToLevelOne}
              </Button>
            </Link>
          ) : userInfo?.kyc_info?.level === 'Level 2' ? null : (userInfo
              ?.kyc_info?.level !== 'Level 0' &&
              userInfo?.kyc_info) ||
            (userInfo?.kyc_info?.details?.['face-recognition'] &&
              [
                userInfo?.status?.face_image === 'Unaccepted',
                userInfo?.status?.face_video === 'Unaccepted',
              ].includes(true)) ? (
            <Link href={'/panel/my-account/validation/level-two'}>
              <Button
                size="lg"
                fullWidth
                disabled={disabledLevelTwoUpgradeAction}
              >
                {userInfo?.status?.phone_number === 'Unfilled' ||
                userInfo.status?.national_card_image === 'Accepted'
                  ? kyc.upgradeToLevelTwo
                  : kyc.editDocuments}
              </Button>
            </Link>
          ) : null}
        </ModalFooter>
      )}
    </div>
  );
};

export default KYCResponsiveItems;
