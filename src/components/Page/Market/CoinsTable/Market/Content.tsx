import React, { FC } from 'react';

import TableContent from './TableContent';
import ChartBoxes from './ChartBoxes';

type Props = {
  wrapperClassname?: string;
  withNewestPairs?: boolean;
  showChartBoxes?: boolean;
};

const Content: FC<Props> = ({
  wrapperClassname,
  withNewestPairs = true,
  showChartBoxes = true,
}) => {
  return (
    <div className={wrapperClassname}>
      {showChartBoxes ? (
        <div className="pb-4 hidden lg:block bg-white">
          <ChartBoxes withNewestPairs={withNewestPairs} />
        </div>
      ) : (
        <></>
      )}
      <TableContent />
    </div>
  );
};

export default Content;
