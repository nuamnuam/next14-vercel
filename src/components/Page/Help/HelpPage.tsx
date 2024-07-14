import React, { ReactElement, useEffect, useState } from 'react';
import { useHelpCatsContent } from '@/requests/help/cats';

import { helpTypes } from '@/components/Layout/Help/helpTypes';
import HelpRoot from './contents/HelpRoot';
import HelpDeposit from './contents/HelpDeposit';
import { Spinner } from '@/components/Common';

interface Props {
  main: string;
}

const HelpPage: React.FC<Props> = ({ main }) => {
  const { data: helpCategories } = useHelpCatsContent();
  const [helpPage, setHelpPage] = useState<Record<string, ReactElement>>();

  useEffect(() => {
    const helpPagesData = helpCategories?.data.reduce((acc, item, index) => {
      acc = {
        ...acc,
        [item.attributes.slug]: <HelpDeposit main={item.attributes.slug} />,
      };

      return acc;
    }, {});

    setHelpPage(helpPagesData);
  }, [main, helpCategories]);

  if (!helpPage)
    return (
      <div className="flex items-center mt-10 justify-center">
        <Spinner />
      </div>
    );

  return main ? (
    main === 'latest-help' ? (
      <HelpDeposit />
    ) : (
      helpPage[main as keyof typeof helpTypes]
    )
  ) : (
    <HelpRoot />
  );
};

export default HelpPage;
