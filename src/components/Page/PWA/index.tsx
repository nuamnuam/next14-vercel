import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Spinner } from '@/components/Common';
import { authStore } from '@/store';
import { useProfile } from '@/hooks';
import { SplashLogo } from '@/components/Icons';
import { useModal } from '@/hooks/useModal';
import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';
import compareVersions from '@/utils/compare-versions';

import { UpdateModal } from './components';
import { updateModalName } from './components/UpdateModal';

export type VersionType = {
  value: string;
  extra_data: {
    force?: boolean;
    changelogs?: string[];
    force_version?: string;
    latest_version?: string;
  };
};

const SplashPage = () => {
  const [version, setVersion] = useState<VersionType | undefined>(undefined);

  const lastVersion = useSettingValue(SETTINGS.APP_VERSION) as VersionType;
  const router = useRouter();

  const { token } = authStore();
  const isLogin = !!token;

  const { data, isLoading } = useProfile();

  const { showSyncModal } = useModal(updateModalName);

  const redirect = () => {
    if (!isLoading && (!isLogin || !data?.tracking_id)) {
      router.push('/auth/login');
    } else {
      router.push('/panel/dashboard');
    }
  };

  useEffect(() => {
    const currentVersion = localStorage.getItem('app_version');

    if (
      lastVersion &&
      lastVersion?.extra_data?.latest_version &&
      lastVersion?.extra_data?.force_version &&
      currentVersion
    ) {
      const latest_version = lastVersion?.extra_data?.latest_version;
      const force_version = lastVersion?.extra_data?.force_version;
      const changelogs = lastVersion?.extra_data?.changelogs;
      if (!compareVersions(latest_version, currentVersion)) {
        return redirect();
      } else {
        if (!compareVersions(force_version, currentVersion)) {
          setVersion({
            value: latest_version,
            extra_data: {
              force: false,
              changelogs,
            },
          });
          return showSyncModal();
        }
        setVersion({
          value: force_version,
          extra_data: {
            force: true,
            changelogs,
          },
        });
        return showSyncModal();
      }
    }
  }, [lastVersion]);

  useEffect(() => {
    localStorage.setItem('pwa', 'true');
  }, []);

  return (
    <>
      <main className="w-full bg-contain bg-bottom bg-no-repeat bg-primary-500">
        <section className="container">
          <div className="relative grid grid-cols-1 mx-auto items-center min-h-screen justify-center">
            <div className="grid col-span-1 items-center justify-center">
              <SplashLogo />
            </div>
            <div className="absolute bottom-5 left-[48%]">
              {isLoading ? <Spinner /> : <></>}
            </div>
          </div>
        </section>
      </main>
      <UpdateModal version={version} redirect={redirect} />
    </>
  );
};

export default SplashPage;
