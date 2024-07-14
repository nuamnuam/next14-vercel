import { PropsWithChildren, forwardRef } from 'react';
import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';

import { EmptyTable, ListLoader } from '@/components';
import { useBreakpoint } from '@/hooks';

import { TableProps } from '../../types';

const Table = forwardRef<HTMLDivElement, PropsWithChildren<TableProps>>(
  (
    {
      data,
      headerItems,
      isInitialLoad = false,
      isLoading = false,
      isFetching = false,
      hasNextPage = false,
      headerExtraClassname = '',
      bodyExtraClassname = '',
      showHeader = true,
      onRowClick = () => {},
    },
    ref,
  ) => {
    const { isDesktop } = useBreakpoint();
    return (
      <div>
        {showHeader ? (
          <div
            className={classNames(
              'flex bg-dark-50 py-3 px-4 sticky top-0 z-10',
              headerExtraClassname,
            )}
          >
            {headerItems.map((item: any, index: number) => (
              <div
                className={classNames(
                  'text-xs text-dark-600',
                  index === 0 && 'lg:pr-4',
                  item?.classNames,
                  item?.width,
                )}
              >
                {item.title}
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
        {data.length
          ? data?.map((row: any, rowIndex: number) => (
              <div
                key={rowIndex}
                className={classNames(
                  'flex w-full flex-wrap items-center border-b border-dark-50 p-4 hover:bg-dark-50/50 lg:flex-nowrap lg:px-6',
                  bodyExtraClassname,
                  row.onRowClick && 'cursor-pointer',
                )}
                onClick={row.onRowClick}
              >
                {(Object.keys(row) as Array<keyof typeof row>).map(
                  (cellName, cellIndex) => (
                    <div
                      className={classNames(
                        headerItems[cellIndex]?.width,
                        headerItems[cellIndex]?.columnClassNames,
                      )}
                      key={`${rowIndex}-${cellIndex}`}
                      onClick={() => onRowClick?.(rowIndex)}
                    >
                      {isLoading ? (
                        <Skeleton
                          inline
                          width={isDesktop ? 80 : 40}
                          height={36}
                          style={{ borderRadius: '0.5rem' }}
                        />
                      ) : (
                        row[cellName]
                      )}
                    </div>
                  ),
                )}
              </div>
            ))
          : null}
        {(hasNextPage || isFetching) && (
          <div className="py-6">
            <ListLoader ref={ref} />
          </div>
        )}
        {!data?.length && !isFetching && !isInitialLoad && <EmptyTable />}
      </div>
    );
  },
);

export default Table;
