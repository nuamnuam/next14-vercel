import React from 'react';
import CardLinks from './CardLinks';
import { useBreakpoint } from '@/hooks';
import LastBoxes from './LastBoxes';

const HelpRoot = () => {
  const { isMobile } = useBreakpoint();
  return (
    <div>
      <CardLinks />
      {!isMobile && (
        <div className="mt-12">
          <LastBoxes />
        </div>
      )}
    </div>
  );
};

export default HelpRoot;
