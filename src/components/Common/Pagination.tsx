import classNames from 'classnames';
import React, { type FC, useEffect } from 'react';
import {
  Pagination as MuiPagination,
  PaginationItem as MuiPaginationItem,
} from '@mui/material';
import { useRouter } from 'next/router';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { colors } from '@/designTokens/colors';
import { useLang } from '@/hooks';

interface Props {
  itemsTotalCount: number;
  type?: 'showAllPages' | 'noPages' | 'default';
  withShowPerPage?: boolean;
  withShowEntriesLabel?: boolean;
  withPreviousAndNext?: boolean;
  withRouterQuery?: boolean;
  className?: string;
  EntryLabelClassName?: string;
  paginationClassName?: string;
  perPageClassName?: string;
  fivePerPageAsDefault?: boolean;
}

const Pagination: FC<Props> = ({
  itemsTotalCount,
  type = 'default',
  withPreviousAndNext = false,
  withShowPerPage = false,
  withShowEntriesLabel = false,
  withRouterQuery = false,
  className,
  EntryLabelClassName,
  paginationClassName,
  perPageClassName,
  fivePerPageAsDefault = false,
}) => {
  const [global] = useLang(['global']);

  const initialPage = 1;
  const rowsPerPageItems = ['5', '12', '24', '50', '100', '200'];
  const router = useRouter();
  const [page, setPage] = React.useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    fivePerPageAsDefault ? '5' : '12',
  );
  const totalPages = Math.floor(
    (itemsTotalCount + parseInt(rowsPerPage) - 1) / parseInt(rowsPerPage),
  );

  useEffect(() => {
    if (router.isReady) {
      const { page: queryPage, per_page: queryPerPage } = router.query;
      const initialPage = parseInt(queryPage as string) || 1;
      let initialPerPage = rowsPerPageItems.find(
        (perPage) => perPage === (queryPerPage as string),
      );

      if (!initialPerPage) initialPerPage = fivePerPageAsDefault ? '5' : '12';

      setPage(initialPage);
      setRowsPerPage(initialPerPage);
    }
  }, [router.isReady]);

  let components: {
    first?: React.ElementType<any> | undefined;
    last?: React.ElementType<any> | undefined;
    next?: React.ElementType<any> | undefined;
    previous?: React.ElementType<any> | undefined;
  } = {};
  let noPagesStyles = {};

  if (withPreviousAndNext) {
    components = {
      next: () => <span>{global.next}</span>,
      previous: () => <span>{global.prev}</span>,
    };
  }

  if (type === 'noPages') {
    noPagesStyles = {
      '& ul>li:nth-child(n+2):nth-last-child(n+2)': {
        display: 'none',
      },
    };
  }

  const handleChangePagination = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    if (withRouterQuery) {
      router.query.page = value.toString();
      router.query.per_page = rowsPerPage;
      router.push(router);
    }
    setPage(value);
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    if (withRouterQuery) {
      router.query.page = initialPage.toString();
      router.query.per_page = event.target.value;
      router.push(router);
    }

    setPage(initialPage);
    setRowsPerPage(event.target.value);
  };

  return (
    <div className={classNames(className, 'flex items-center')}>
      {withShowEntriesLabel && (
        <div
          className={classNames(
            'font-book mb-4 mt-auto mr-4 text-sm text-dark-grey',
            '!hidden lg:!block',
            EntryLabelClassName,
          )}
        >
          {global.view}
          <span className="font-medium">
            {` ${(page - 1) * parseInt(rowsPerPage) + 1} `}
          </span>
          {global.to}
          <span className="font-medium">
            {` ${
              parseInt(rowsPerPage) * page > itemsTotalCount
                ? itemsTotalCount
                : parseInt(rowsPerPage) * page
            } `}
          </span>
          {global.from} <span className="font-medium">{itemsTotalCount}</span>{' '}
          entries
        </div>
      )}
      <MuiPagination
        sx={noPagesStyles}
        className={classNames(
          'mr-auto !ml-auto inline-block rounded-lg border border-light-grey !text-xs md:mr-0',
          '[&_.MuiPaginationItem-text]:!text-xs',
          '[&_.MuiPaginationItem-text]:!text-dark-grey',
          '[&_.MuiPaginationItem-text]:!font-book',
          '[&_.Mui-selected]:!text-white',
          '[&_.Mui-selected]:!font-medium',
          '[&>ul]:py-1',
          '[&>ul>:nth-child(1)]:border-r',
          '[&>ul>:nth-child(1)]:border-light-grey',
          '[&>ul>:nth-child(2)]:pl-2',
          '[&>ul>:last-child]:border-l',
          '[&>ul>:last-child]:border-light-grey',
          paginationClassName,
        )}
        color="primary"
        page={page}
        count={totalPages < 1 ? 1 : totalPages}
        shape="rounded"
        siblingCount={type === 'showAllPages' ? itemsTotalCount : undefined}
        onChange={handleChangePagination}
        renderItem={(item) => (
          <MuiPaginationItem components={components} {...item} />
        )}
      />
      {withShowPerPage && (
        <FormControl
          className={classNames(
            'mt-auto ml-4',
            '!hidden md:!block',
            perPageClassName,
          )}
          size="medium"
        >
          <Select
            sx={{
              '.MuiInputBase-input': {
                fontWeight: 325,
              },
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: colors.medium.grey,
                borderWidth: 1,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.dark.grey,
                borderWidth: 1,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.medium.grey,
                borderWidth: 2,
              },
            }}
            MenuProps={{
              sx: {
                '& .MuiMenu-list': {
                  padding: '8px !important',
                },
                '& .MuiMenuItem-root': {
                  fontSize: 12,
                  fontWeight: 325,
                  paddingY: '13px',
                  borderRadius: '8px',
                },
                '&& .Mui-selected': {
                  backgroundColor: colors.light.grey,
                },
                '&&:hover .Mui-selected': {
                  backgroundColor: colors.light.grey,
                },
              },
            }}
            className="rounded-lg !text-xs text-dark-grey"
            value={rowsPerPage}
            onChange={handleChangeSelect}
          >
            {rowsPerPageItems.map((item: string, index: number) => (
              <MenuItem key={index} value={item}>
                {item + ` ${global.perPage}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default Pagination;
