import React, { forwardRef } from 'react';
import clsx from 'classnames';
import Spinner from '../Spinner';

interface Props {
  className?: string;
}

const ListLoader = forwardRef<HTMLDivElement, Props>(({ className }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'flex justify-center items-center pt-4 text-dark-500',
        className,
      )}
    >
      <Spinner />
    </div>
  );
});

export default ListLoader;
