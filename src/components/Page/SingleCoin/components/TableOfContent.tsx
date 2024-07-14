import Link from 'next/link';
import { ButtonBase } from '@mui/material';
import { useState } from 'react';

import { Icon } from '@/components/Common';
import { useLang } from '@/hooks';

interface TableOfContentProps {
  items: Array<{
    id: string;
    text: string;
  }>;
}

const TableOfContent = ({ items }: TableOfContentProps) => {
  const [singleCoin] = useLang(['singleCoin']);

  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col p-4 mb-6 rounded-lg border border-dark-100 text-sm text-dark-600">
      <ButtonBase
        disableRipple
        sx={{ justifyContent: 'space-between' }}
        onClick={() => setOpen((p) => !p)}
      >
        <div className="flex gap-4 items-center">
          <Icon icon="CheckList-OutLined" size={16} className="text-dark-200" />
          <h3 className="flex-1">{singleCoin.titlesList}</h3>
        </div>
        <Icon
          icon="Down-OutLined"
          size={16}
          className="text-dark-100"
          style={{
            transition: 'all 0.4s ease-in-out',
            transform: open ? 'rotate(0)' : 'rotate(-180deg)',
          }}
        />
      </ButtonBase>
      <ul
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.4s ease-in-out',
          height: 'auto',
          maxHeight: open ? 500 : 0,
          overflowY: 'auto',
        }}
        className="font-medium flex flex-col gap-3 list-disc pr-10 text-dark-400"
      >
        <div />
        {items?.map((i, idx) => (
          <li key={idx}>
            <Link href={'#' + i.id}>{i.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContent;
