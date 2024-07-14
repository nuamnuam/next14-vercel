import React, { useState, useEffect, type FC } from 'react';
import { useRouter } from 'next/router';

import Paper from '@/components/Common/Paper';
import { Button, Icon, IconButton, Spinner } from '@/components/Common';
import { type IActivity } from '@/types/myAccount';
import { useActivityLoginsQuery } from '@/requests/panel/my-account/security/getActivitiesLogins';
import { toPersianDigits } from '@/utils';
import { useLang, useProfile } from '@/hooks';

import TwoStepAuthentication from './TwoStepAuthentication';
import ChangePassword from './ChangePassword/ChangePasswordPage';
import LinkedDevicesPage from './LinkedDevices/LinkedDevicesPage';
import ActivityHistoryPage from './ActivityHistory/ActivityHistoryPage';

interface Props {
  className?: string;
}

const RespinsiveTwoStepAuthentication: FC<Props> = () => {
  const [security] = useLang(['security']);

  const [page, setPage] = useState('');
  const router = useRouter();

  const [selectedDeleteDevice, setselectedDeleteDevice] =
    useState<IActivity | null>(null);

  const { data: devices, isLoading: devicesLoading } = useActivityLoginsQuery();

  const { data: userInfo } = useProfile();

  const menu = [
    {
      title: security.twoStepAuthentication,
      caption: {
        sms: security.sms,
        email: security.email,
        google2fa: security.application,
      }[userInfo?.two_fa_type_id ?? 'sms'],
      type: '2FA',
    },
    { title: security.changePassword, type: 'change_password' },
    {
      title: security.connectedDevices,
      caption: devicesLoading ? (
        <Spinner width={20} height={20} />
      ) : (
        `${toPersianDigits(devices?.meta?.active_count)} ${security.device}`
      ),
      type: 'linked_devices',
    },
    { title: security.activityHistory, type: 'activity_history' },
  ];

  const getContent = (page: string) => {
    switch (page) {
      case '2FA':
        return <TwoStepAuthentication noHeader={true} responsiveMode={true} />;
      case 'change_password':
        return <ChangePassword noHeader={true} />;
      case 'linked_devices':
        return (
          <LinkedDevicesPage
            selectedDeleteDevice={selectedDeleteDevice}
            setselectedDeleteDevice={setselectedDeleteDevice}
          />
        );
      case 'activity_history':
        return <ActivityHistoryPage />;
      default:
        return null;
    }
  };
  const getTitleInfo = (type: string) => {
    switch (type) {
      case '2FA':
        return {
          title: security.twoStepAuthentication,
          goBack: () => {
            setPage('');
          },
        };
      case 'change_password':
        return {
          title: security.changePassword,
          goBack: () => {
            setPage('');
          },
        };
      case 'linked_devices':
        return {
          title: security.linkedDevices,
          goBack: () => {
            setPage('');
          },
        };
      case 'activity_history':
        return {
          title: security.activityHistory,
          goBack: () => {
            setPage('');
          },
        };
      default:
        return {
          title: security.security,
          goBack: () => {
            setPage('');
            router.push('/panel/my-account');
          },
        };
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white h-[76px] border-b border-dark-100 px-4 sm:px-8">
        <div
          className="flex items-center justify-end gap-8"
          onClick={() => {
            getTitleInfo(page).goBack();
          }}
        >
          <Button className="p-0" variant="text">
            <Icon
              icon={'Right-OutLined'}
              size={18}
              className="[&>*]:fill-dark-200"
            />
          </Button>

          <h2 className="text-lg font-medium text-dark-600">
            {getTitleInfo(page).title}
          </h2>
        </div>
        <IconButton
          size="lg"
          className="border-dark-200"
          icon={
            <Icon
              icon={'QuestionCircle-OutLined'}
              size={20}
              className="[&>*]:fill-dark-600"
            />
          }
        />
      </div>
      <div className="px-4 md:p-0">
        <Paper classNames="lg:mx-auto mt-8 sm:mx-4">
          {page ? (
            <div className="w-full">{getContent(page)}</div>
          ) : (
            <div className="w-full">
              {menu.map(({ title, caption, type }) => (
                <div
                  onClick={() => {
                    setPage(type);
                  }}
                  key={title}
                  className="flex w-full cursor-pointer items-center justify-between border-b  border-dark-50 py-6 px-6	md:px-10"
                >
                  <h3 className="text-sm font-normal text-dark-800">{title}</h3>
                  <div className="flex gap-x-4">
                    <p className="text-sm font-normal text-dark-300">
                      {caption}
                    </p>
                    <Icon
                      icon="Left-OutLined"
                      size={16}
                      className="[&>*]:fill-dark-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Paper>
      </div>
    </>
  );
};

export default RespinsiveTwoStepAuthentication;
