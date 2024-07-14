import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { GuideButton, ResponsivePageHeader } from '@/components/Common';
import { useFcmToken, useLang, useProfile } from '@/hooks';
import { useEditSettingMutation } from '@/requests/panel/my-account/profile/editSetting';

import { SettingsItem, SettingsCard } from '.';

interface IProps {
  header?: React.ReactNode;
  itemComponent?: (props: any) => JSX.Element;
  title?: string;
  items?: any;
}

const SettingsPage = ({}: IProps) => {
  const [settingLang] = useLang(['setting']);

  const { notificationPermissionStatus, retrieveToken } = useFcmToken();

  const [loadingPart, setLoadingPart] = useState<
    'notifications' | 'order' | 'wage' | null
  >(null);
  const router = useRouter();
  const { data } = useProfile();
  const { mutateAsync } = useEditSettingMutation();

  const setting = data?.settings;
  const commission = data?.commission;

  const updateSetting = async (
    schema: string | null,
    key: string,
    value: string | boolean,
  ) => {
    const loading = (schema || (key.includes('order') ? 'order' : 'wage')) as
      | 'notifications'
      | 'order'
      | 'wage'
      | null;
    setLoadingPart(loading);

    if (key === 'notification') {
      retrieveToken();
      return setLoadingPart(null);
    }

    let formData;
    if (schema) {
      formData = {
        settings: {
          [schema]: {
            [key]: value,
          },
        },
      };
    } else {
      formData = {
        settings: {
          [key]: value === 'TO_ASSET' ? null : value,
        },
      };
    }

    try {
      await mutateAsync(formData);
    } catch (error) {
      console.log('err');
    } finally {
      setLoadingPart(null);
    }
  };

  return (
    <>
      <ResponsivePageHeader
        title={settingLang.settings}
        onBack={() => router.back()}
      />
      <div className="block w-full justify-between bg-dark-50 sm:flex px-4 sm:px-8 lg:px-0">
        <div className="w-full">
          <SettingsCard
            title={settingLang.manageMessages}
            itemComponent={SettingsItem}
            className="w-full lg:w-[524px]"
            schema="notifications"
            handleChange={updateSetting}
            isLoading={loadingPart === 'notifications'}
            items={[
              {
                name: settingLang.notificationByEmail,
                value: setting?.notifications.email,
                key: 'email',
              },
              {
                name: settingLang.notificationBySms,
                value: setting?.notifications.sms,
                key: 'sms',
              },
              {
                name: 'نوتیفیکیشن',
                value: notificationPermissionStatus === 'granted',
                key: 'notification',
              },
            ]}
          />

          <SettingsCard
            className="mt-8 w-full lg:w-[524px]"
            title={settingLang.transactionManagement}
            itemComponent={SettingsItem}
            handleChange={updateSetting}
            isLoading={loadingPart === 'order'}
            items={[
              {
                name: settingLang.confirmOrder,
                value: setting?.order_submit_confirm,
                key: 'order_submit_confirm',
              },
              {
                name: settingLang.confrimCancelOrder,
                value: setting?.order_delete_confirm,
                key: 'order_delete_confirm',
              },
            ]}
          />
          <SettingsCard
            className="mt-8 w-full lg:w-[524px]"
            title={settingLang.wageManagement}
            type="RADIO"
            defaultValue={commission?.currency_deduction || 'TO_ASSET'}
            handleChange={updateSetting}
            isLoading={loadingPart === 'wage'}
            items={[
              {
                name: settingLang.toAsset,
                value: 'TO_ASSET',
                key: 'currency_deduction',
              },
              {
                name: settingLang.toman,
                value: 'IRT',
                key: 'currency_deduction',
              },
              {
                name: settingLang.tether,
                value: 'USDT',
                key: 'currency_deduction',
              },
            ]}
          />
        </div>
        <div className="hidden lg:block">
          <GuideButton variant="primary" />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
