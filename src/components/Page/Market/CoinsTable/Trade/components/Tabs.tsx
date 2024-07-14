import { useEffect, useState } from 'react';
import clsx from 'classnames';

import { Button } from '@/components/Common';

export type IconComponentProps = { icon: string; size: number };

export interface TableTabProps {
  items?: Array<{
    name: string;
    label: string | React.ComponentType<IconComponentProps>;
    labelComponentProps?: IconComponentProps;
  }>;
  onChange: (val: string) => void;
  className?: string;
  selected?: string;
  buttonClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  activeChipVariant?:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'dashed'
    | 'link'
    | 'text'
    | 'chip'
    | 'active-chip';
  chipVariant?:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'dashed'
    | 'link'
    | 'text'
    | 'chip'
    | 'active-chip';
}

const TableTabs: React.FC<TableTabProps> = ({
  items,
  className,
  onChange = () => {},
  selected = undefined,
  buttonClassName,
  size = 'md',
  activeChipVariant = 'secondary',
  chipVariant = 'text',
}) => {
  const [activeTab, setActiveTab] = useState(selected);

  const handleClick = (name: string) => {
    setActiveTab(name);
    onChange(name);
  };

  useEffect(() => setActiveTab(selected), [selected]);

  return (
    <div className={clsx('flex w-full gap-2 overflow-x-auto pb-4', className)}>
      {items?.map(({ label, name, labelComponentProps }) => {
        const Component = label;
        const labelProps = labelComponentProps || { icon: '', size: 0 };
        return (
          <Button
            variant={activeTab === name ? activeChipVariant : chipVariant}
            key={name}
            className={buttonClassName}
            onClick={() => {
              handleClick(name);
            }}
            size={size}
          >
            {typeof label !== 'string' ? <Component {...labelProps} /> : label}
          </Button>
        );
      })}
    </div>
  );
};

export default TableTabs;
