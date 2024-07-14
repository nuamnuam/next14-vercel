import React from 'react';

import QRCode from 'react-qr-code';

interface DownloadAppMenuProps {
  qrCodeImage?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

const DownloadAppMenu = ({ qrCodeImage }: DownloadAppMenuProps) => {
  return (
    <div className="p-6">
      {qrCodeImage ? (
        <img
          src={`${process.env.NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL}${qrCodeImage}`}
          width={100}
          height={100}
          alt="media"
        />
      ) : (
        <QRCode size={130} value={`${BASE_URL}/application`} />
      )}
    </div>
  );
};

export default DownloadAppMenu;
