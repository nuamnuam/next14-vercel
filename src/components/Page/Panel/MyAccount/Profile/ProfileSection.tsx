import React from 'react';
import Paper from '@/components/Common/Paper';
import List from '../../Dashboard/List/List';
import { BoxDivider } from '@/components/Common';

interface IItem {
  name?: string;
  icon?: string;
  href?: string;
  status?: string;
  statusVariant?: string;
  onClick?: () => void;
  level?: string;
  value?: string | null;
  isLoading?: boolean;
}
interface IProps {
  header?: React.ReactNode;
  itemComponent?: (props: any) => JSX.Element;
  title?: string;
  items: IItem[];
}

const ProfileSection = ({ header, items, itemComponent }: IProps) => {
  return (
    <Paper classNames="w-full flex flex-col items-stretch mb-8">
      {header}
      {header && <BoxDivider />}
      <List items={items} ItemComponent={itemComponent!} />
    </Paper>
  );
};

export default ProfileSection;
