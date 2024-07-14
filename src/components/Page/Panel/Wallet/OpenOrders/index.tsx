import React from 'react';
import { AdvancedTrade, Convert, SimpleTrade } from '@/components/Icons';
import OpenOrdersContent from './components/OpenOrdersContent';
import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import { getLang } from '@/utils';

const [wallet] = getLang(['wallet']);

export const ORDER_TYPE_ICONS = {
  OTC: { Icon: SimpleTrade, title: wallet.instantTrade },
  CONVERT: { Icon: Convert, title: wallet.convert },
  P2P: { Icon: AdvancedTrade, title: wallet.advancedTrade },
};

const OpenOrdersPage: React.FC = () => {
  return <OpenOrdersContent />;
};

const CustomToolTop = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} placement="right" />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default OpenOrdersPage;
export { CustomToolTop };
