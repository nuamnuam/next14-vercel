import classNames from 'classnames';
import { type FC, useState, useEffect } from 'react';
import Link from 'next/link';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import { colors } from '@/designTokens/colors';

export interface TabsModel {
  tabTitle: string;
  tabContent: React.ReactNode;
  tabOnClick?: () => void;
  link?: string;
  leftIcon?:
    | string
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  rightIcon?:
    | string
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  extraClassname?: string;
}

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  tabs: TabsModel[];
  selectedIndex?: number;
  newSelectedIndex?: number | undefined;
  href?: string;
  size?: 'small' | 'medium' | 'large';
  classes?: {
    container?: string;
    tabs?: string;
    selectedTab?: string;
    wrapper?: string;
  };
  mode?: 'horizontal' | 'vertical';
  extra?: React.ReactNode;
  onTabChange?: (index: number) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  mode: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, mode, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={mode === 'horizontal' ? 'mr-6 flex-auto self-stretch' : ''}
      {...other}
    >
      {children}
    </div>
  );
}

const TabsGroup: FC<Props> = ({
  tabs = [],
  size = 'small',
  selectedIndex = 0,
  newSelectedIndex,
  classes,
  mode = 'vertical',
  extra,
  onTabChange = () => {},
}) => {
  const [tabIndex, setTabIndex] = useState(selectedIndex);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    onTabChange?.(newValue);
  };

  const sizes = {
    small: 'text-sm py-2',
    medium: 'px-6 py-3',
    large: 'px-8 py-4',
  };

  useEffect(() => {
    if (newSelectedIndex !== undefined) setTabIndex(newSelectedIndex);
  }, [newSelectedIndex]);

  return (
    <Box
      className={classNames('w-full ', classes?.container, {
        flex: mode === 'horizontal',
      })}
    >
      <Box
        className={classNames(
          'h-fit border-b',
          {
            'rounded-lg bg-white ': mode === 'horizontal',
            'min-w-[306px]': mode === 'horizontal',
          },
          classes?.tabs,
          extra && 'flex justify-between items-center flex-col md:flex-row',
        )}
      >
        <Tabs
          variant="scrollable"
          TabIndicatorProps={{
            hidden: true,
          }}
          sx={{
            '& button': {
              textTransform: 'none',
              borderBottom: 1,
              borderColor:
                mode === 'horizontal' ? colors.dark[50] : 'transparent',
            },
            '& button:hover': {
              borderColor:
                mode === 'horizontal' ? colors.dark[50] : colors.arzinja[500],
              color:
                mode === 'horizontal' ? colors.dark[600] : colors.arzinja[500],
              backgroundColor:
                mode === 'horizontal' ? colors.dark[50] : 'transparent',
            },
            '& .Mui-selected': {
              borderColor:
                mode === 'horizontal' ? colors.dark[100] : colors.arzinja[500],
              color:
                mode === 'horizontal' ? colors.dark[600] : colors.arzinja[500],
              backgroundColor:
                mode === 'horizontal' ? colors.dark[100] : 'transparent',
            },
            '& a': {
              textTransform: 'none',
              borderBottom: 1,
              borderColor:
                mode === 'horizontal' ? colors.dark[50] : 'transparent',
            },
            '& a:hover': {
              borderColor:
                mode === 'horizontal' ? colors.dark[50] : colors.arzinja[500],
              color:
                mode === 'horizontal' ? colors.dark[600] : colors.arzinja[500],
              backgroundColor:
                mode === 'horizontal' ? colors.dark[50] : 'transparent',
            },
          }}
          className={classNames(
            classes?.wrapper && classes?.wrapper,
            mode === 'vertical' &&
              `[&>div>div>.Mui-selected]:${
                classes?.selectedTab ?? 'bg-[#F6F6F6]'
              }`,
            '[&>div>div>.Mui-selected>div>span]:font-medium',
            mode === 'horizontal' &&
              'rounded-lg [&>div>div>.Mui-selected>div>span]:text-dark-500 [&>div>div]:flex-col [&>div>div>.MuiTab-root]:items-start',
          )}
          textColor="primary"
          value={tabIndex}
          onChange={handleTabChange}
        >
          {tabs.map((tab: TabsModel, index: number) => (
            <Tab
              onClick={tab.tabOnClick}
              component={tab.link ? Link : 'button'}
              href={tab.link ? tab.link : ''}
              className={classNames(
                tab.extraClassname,
                sizes[size],
                extra && 'h-[60px]',
              )}
              key={index}
              label={
                <div className="flex items-center justify-center">
                  {tab.leftIcon}
                  <span className="mx-3">{tab.tabTitle}</span>
                  {tab.rightIcon}
                </div>
              }
            />
          ))}
        </Tabs>
        {extra}
      </Box>
      {tabs.map((tab: TabsModel, index: number) => (
        <TabPanel key={index} value={tabIndex} index={index} mode={mode}>
          {tab.tabContent}
        </TabPanel>
      ))}
    </Box>
  );
};
export default TabsGroup;
