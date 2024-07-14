import { useMemo } from 'react';
import { useLang, useProfile } from '@/hooks';

const useLevelsSteps = () => {
  const [global, kyc] = useLang(['global', 'kyc']);

  const { data: userInfo } = useProfile();

  const levelOneSteps = useMemo(
    () => [
      {
        title: kyc.verifyAuthorityOfMobileNumber,
        accepted: userInfo?.kyc_info?.details?.['personal-info'],
        className:
          userInfo?.status?.first_name === 'Unfilled' &&
          userInfo?.status?.last_name === 'Unfilled' &&
          userInfo?.status?.birthday === 'Unfilled' &&
          userInfo?.status?.national_code === 'Unfilled'
            ? '[&>*]:fill-dark-400'
            : !userInfo?.kyc_info?.details?.['personal-info']
            ? '[&>*]:fill-dark-400'
            : '[&>*]:fill-primary-500',
        textColor:
          userInfo?.status?.first_name === 'Edited' ||
          userInfo?.status?.last_name === 'Edited' ||
          userInfo?.status?.birthday === 'Edited' ||
          userInfo?.status?.national_code === 'Edited'
            ? 'text-warning-600'
            : userInfo?.status?.first_name === 'Unfilled' &&
              userInfo?.status?.last_name === 'Unfilled' &&
              userInfo?.status?.birthday === 'Unfilled' &&
              userInfo?.status?.national_code === 'Unfilled'
            ? 'text-dark-600'
            : '',
        icon:
          userInfo?.status?.first_name === 'Edited' ||
          userInfo?.status?.last_name === 'Edited' ||
          userInfo?.status?.birthday === 'Edited' ||
          userInfo?.status?.national_code === 'Edited'
            ? 'ClockCircle-Filled'
            : userInfo?.status?.first_name === 'Unfilled' &&
              userInfo?.status?.last_name === 'Unfilled' &&
              userInfo?.status?.birthday === 'Unfilled' &&
              userInfo?.status?.national_code === 'Unfilled'
            ? 'CheckCircle-OutLined'
            : 'CheckCircle-Filled',
      },
      {
        title: global.userProfile,
        className:
          userInfo?.status?.first_name === 'Unfilled' &&
          userInfo?.status?.last_name === 'Unfilled' &&
          userInfo?.status?.birthday === 'Unfilled' &&
          userInfo?.status?.national_code === 'Unfilled'
            ? '[&>*]:fill-dark-400'
            : !userInfo?.kyc_info?.details?.['personal-info']
            ? '[&>*]:fill-dark-400'
            : '[&>*]:fill-primary-500',
        accepted: userInfo?.kyc_info?.details?.['personal-info'],
        textColor:
          userInfo?.status?.first_name === 'Edited' ||
          userInfo?.status?.last_name === 'Edited' ||
          userInfo?.status?.birthday === 'Edited' ||
          userInfo?.status?.national_code === 'Edited'
            ? 'text-warning-600'
            : userInfo?.status?.first_name === 'Unfilled' &&
              userInfo?.status?.last_name === 'Unfilled' &&
              userInfo?.status?.birthday === 'Unfilled' &&
              userInfo?.status?.national_code === 'Unfilled'
            ? 'text-dark-600'
            : '',
        icon:
          userInfo?.status?.first_name === 'Edited' ||
          userInfo?.status?.last_name === 'Edited' ||
          userInfo?.status?.birthday === 'Edited' ||
          userInfo?.status?.national_code === 'Edited'
            ? 'ClockCircle-Filled'
            : userInfo?.status?.first_name === 'Unfilled' &&
              userInfo?.status?.last_name === 'Unfilled' &&
              userInfo?.status?.birthday === 'Unfilled' &&
              userInfo?.status?.national_code === 'Unfilled'
            ? 'CheckCircle-OutLined'
            : 'CheckCircle-Filled',
      },
      {
        title: kyc.bankAccount,
        className:
          userInfo?.status?.bank_card === 'Unfilled'
            ? '[&>*]:fill-dark-400'
            : !userInfo?.kyc_info?.details?.['financial-info']
            ? '[&>*]:fill-dark-400'
            : '[&>*]:fill-primary-400',
        accepted: userInfo?.kyc_info?.details?.['financial-info'],
        textColor:
          userInfo?.status?.bank_card === 'Edited'
            ? 'text-warning-600'
            : userInfo?.status?.bank_card === 'Unfilled'
            ? 'text-dark-600'
            : '',
        icon:
          userInfo?.status?.bank_card === 'Edited'
            ? 'ClockCircle-Filled'
            : userInfo?.status?.bank_card === 'Unfilled'
            ? 'CheckCircle-OutLined'
            : 'CheckCircle-Filled',
      },
    ],
    [userInfo],
  );

  const levelTwoSteps = useMemo(
    () => [
      {
        title: kyc.identificationDocument,
        className:
          userInfo?.status?.national_card_image === 'Unfilled'
            ? '[&>*]:fill-dark-400'
            : userInfo?.status?.national_card_image === 'Unaccepted'
            ? '[&>*]:fill-danger-600'
            : userInfo?.status?.national_card_image === 'Edited'
            ? '[&>*]:fill-warning-600'
            : userInfo?.status?.national_card_image === 'Accepted'
            ? '[&>*]:fill-primary-500'
            : '[&>*]:fill-dark-400',
        accepted: userInfo?.status?.national_card_image === 'Accepted',
        textColor:
          userInfo?.status?.national_card_image === 'Unfilled'
            ? 'text-dark-600'
            : userInfo?.status?.national_card_image === 'Unaccepted'
            ? '!text-danger-600'
            : userInfo?.status?.national_card_image === 'Edited'
            ? 'text-warning-600'
            : 'text-dark-600',
        icon:
          userInfo?.status?.national_card_image === 'Unaccepted'
            ? 'CloseCircle-Filled'
            : userInfo?.status?.national_card_image === 'Edited'
            ? 'ClockCircle-Filled'
            : userInfo?.status?.national_card_image === 'Unfilled'
            ? 'CheckCircle-OutLined'
            : 'CheckCircle-Filled',
      },
      {
        title: kyc.confirmAuthority,
        className:
          userInfo?.verification === 'verified'
            ? '[&>*]:fill-primary-500'
            : userInfo?.status?.face_image === 'Edited' ||
              userInfo?.status?.face_image === 'Accepted' ||
              userInfo?.status?.face_video === 'Edited' ||
              userInfo?.status?.face_video === 'Accepted'
            ? '[&>*]:fill-warning-600'
            : (userInfo?.status?.face_image === 'Unaccepted' &&
                userInfo.status?.face_video === 'Unaccepted') ||
              (userInfo?.status?.face_image === 'Unaccepted' &&
                userInfo.status?.face_video === 'Unfilled') ||
              (userInfo?.status?.face_video === 'Unaccepted' &&
                userInfo.status?.face_image === 'Unfilled')
            ? '[&>*]:fill-danger-600'
            : '[&>*]:fill-dark-400',
        textColor:
          userInfo?.verification === 'verified'
            ? 'text-dark-600'
            : userInfo?.status?.face_image === 'Edited' ||
              userInfo?.status?.face_image === 'Accepted' ||
              userInfo?.status?.face_video === 'Edited' ||
              userInfo?.status?.face_video === 'Accepted'
            ? 'text-warning-600'
            : (userInfo?.status?.face_image === 'Unaccepted' &&
                userInfo.status?.face_video === 'Unaccepted') ||
              (userInfo?.status?.face_image === 'Unaccepted' &&
                userInfo.status?.face_video === 'Unfilled') ||
              (userInfo?.status?.face_video === 'Unaccepted' &&
                userInfo.status?.face_image === 'Unfilled')
            ? '!text-danger-600'
            : 'text-dark-600',
        accepted: userInfo?.verification === 'verified',
        icon:
          userInfo?.verification === 'verified'
            ? 'CheckCircle-Filled'
            : userInfo?.status?.face_image === 'Edited' ||
              userInfo?.status?.face_image === 'Accepted' ||
              userInfo?.status?.face_video === 'Edited' ||
              userInfo?.status?.face_video === 'Accepted'
            ? 'ClockCircle-Filled'
            : (userInfo?.status?.face_image === 'Unaccepted' &&
                userInfo.status?.face_video === 'Unaccepted') ||
              (userInfo?.status?.face_image === 'Unaccepted' &&
                userInfo.status?.face_video === 'Unfilled') ||
              (userInfo?.status?.face_video === 'Unaccepted' &&
                userInfo.status?.face_image === 'Unfilled')
            ? 'CloseCircle-Filled'
            : 'CheckCircle-OutLined',
      },
    ],
    [userInfo],
  );

  const disabledLevelTwoUpgradeAction = useMemo(() => {
    return (
      userInfo?.verification === 'verified' ||
      userInfo?.status?.national_card_image === 'Edited' ||
      ((userInfo?.status?.face_image === 'Edited' ||
        userInfo?.status?.face_video === 'Edited') &&
        userInfo.status?.national_card_image !== 'Unaccepted') ||
      ((userInfo?.status?.face_image === 'Accepted' ||
        userInfo?.status?.face_video === 'Accepted') &&
        userInfo.status?.national_card_image !== 'Unaccepted' &&
        userInfo.verification !== 'verified')
    );
  }, [userInfo]);

  return {
    levelOneSteps,
    levelTwoSteps,
    disabledLevelTwoUpgradeAction,
  };
};

export default useLevelsSteps;
