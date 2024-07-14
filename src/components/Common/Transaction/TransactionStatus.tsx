import React, { useMemo } from 'react';
import clsx from 'classnames';

import Chip from '@/components/Common/Chip';
import { useLang } from '@/hooks';

interface TranactionStatusProps {
  status: 0 | 1;
  className?: string;
}

const TranactionStatus: React.FC<TranactionStatusProps> = ({
  status,
  className,
}) => {
  const [wallet] = useLang(['wallet']);

  const renderChip = useMemo(() => {
    switch (status) {
      case 1:
        return (
          <Chip
            label={wallet.done}
            variant="success"
            classNames={clsx('whitespace-pre w-fit', className)}
          />
        );
      case 0:
        return (
          <Chip
            label={wallet.pending}
            variant="warning"
            classNames={clsx('whitespace-pre', className)}
          />
        );
      default:
    }
  }, [status]);

  return <>{renderChip}</>;
};

export default TranactionStatus;
