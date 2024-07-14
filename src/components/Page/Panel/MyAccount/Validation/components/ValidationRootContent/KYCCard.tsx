import React from 'react';
import clsx from 'classnames';

import { Icon, BoxDivider } from '@/components/Common';
import List from '../List';

interface IProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  itemComponent?: (props: any) => JSX.Element;
  items: Array<{ title?: string; icon?: string }>;
  status?: React.ReactNode;
  steps?: Array<{
    title: string;
    className?: string;
    textColor?: string;
    accepted?: boolean;
    icon: string;
  }>;
}

const KYCCard = ({
  header,
  items,
  itemComponent,
  footer,
  steps,
  status,
}: IProps) => {
  return (
    <div className="w-full flex flex-col justify-start items-center bg-white rounded-lg lg:min-h-[530px] !mb-10 lg:!mb-0">
      <div className="w-full">
        {header}
        {header && <BoxDivider />}
        <div className="pt-6 pb-3 px-4 sm:pt-8 sm:px-6 sm:pb-3 md:pt-6 md:px-4 md:pb-1 flex">
          <div>
            <List items={items} ItemComponent={itemComponent!} />
          </div>
          {status && <div className="block sm:hidden mr-auto">{status}</div>}
        </div>
        <div className="pt-6 pb-7 px-4 sm:pt-6 sm:pb-8 sm:px-6 md:py-6  border-t border-dark-50">
          <div className="relative">
            {steps?.map((step, index) => (
              <div
                className={clsx(
                  'flex items-center justify-start gap-x-2 relative z-10',
                  index !== steps.length - 1 && 'mb-6',
                )}
                key={index}
              >
                <div className="p-[1px] bg-white">
                  <Icon icon={step.icon} className={step.className} size={24} />
                </div>
                <p
                  className={clsx(
                    'text-sm font-medium text-dark-600',
                    step?.textColor,
                  )}
                >
                  {step.title}
                </p>
              </div>
            ))}
            <div className="absolute top-0 h-full right-[13px] border-r border-dark-100" />
          </div>
        </div>
        {footer && <div className="lg:pb-6">{footer}</div>}
      </div>
    </div>
  );
};

export default KYCCard;
