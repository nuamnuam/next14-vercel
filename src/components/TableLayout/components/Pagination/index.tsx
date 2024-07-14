import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import styled from '@emotion/styled';
import clsx from 'classnames';

import { colors } from '@/designTokens';
import { toPersianDigits } from '@/utils';
import { Icon } from '@/components/Common';

interface Props {
  count: number;
  classNames?: string;
  page?: number;
  onChange: (page: number) => void;
}

const TablePagination: React.FC<Props> = ({
  count,
  page = 1,
  classNames,
  onChange,
}) => {
  return (
    <StyledPagination
      count={count}
      color="primary"
      page={page}
      onChange={(_, page) => {
        onChange(page);
      }}
      className={clsx(classNames, count < 2 && 'hidden')}
      renderItem={(item) => {
        return (
          <PaginationItem
            slots={{
              previous: () => arrowIconFunc('right'),
              next: () => arrowIconFunc(),
            }}
            {...item}
            page={toPersianDigits(item.page)}
          />
        );
      }}
    />
  );
};

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: '8px',
    color: colors.dark[600],
    fontSize: '14px !important',
    height: '40px',
    width: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:not(.Mui-selected):hover': {
      background: colors.dark[50],
    },
  },
  '& .Mui-selected': {
    color: 'white !important',
  },
}));

export default TablePagination;

const arrowIconFunc = (side = 'left') => {
  return (
    <Icon
      icon={side === 'left' ? 'Left-OutLined' : 'Right-OutLined'}
      size={11}
      className="[&>*]:fill-dark-600"
    />
  );
};
