import React from 'react';
import QRCode from 'react-qr-code';
import Link from 'next/link';

import { Button } from '@/components/Common';
import { useLang } from '@/hooks';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

const DownloadAppMenu = () => {
  const [menu] = useLang(['menu']);

  return (
    <div className="p-6">
      <span className="mb-4 block border-b border-dark-50 pb-4 text-center text-base font-medium text-black">
        {menu.downloadApp}
      </span>
      <QRCode size={170} value={`${BASE_URL}/application`} />
      <Link href="/application" className="w-full">
        <Button size="sm" fullWidth className="mt-4 !rounded-[4px]">
          {menu.viewAndDownload}
        </Button>
      </Link>
    </div>
  );
};

export default DownloadAppMenu;
