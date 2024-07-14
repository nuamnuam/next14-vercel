import { useBreakpoint, useLang } from '@/hooks';
import { Card, GuideButton, SwimTab } from '@/components/Common';
import { getLang } from '@/utils';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import clsx from 'classnames';

interface Props {
  children: React.ReactNode;
}

const WalletFastOrderLayout: React.FC<Props> = ({ children }) => {
  const [wallet] = useLang(['wallet']);
  const { isDesktop } = useBreakpoint();
  const { asPath, push, query } = useRouter();
  const queryAsset = query.asset as string;

  const tabItems = useMemo(
    () => [
      {
        id: 'fastOrderBuy',
        label: wallet.buy,
        href: queryAsset
          ? `/panel/instant-trade/buy?asset=${queryAsset}`
          : '/panel/instant-trade/buy',
      },
      {
        id: 'fastOrderSell',
        label: wallet.sell,
        href: queryAsset
          ? `/panel/instant-trade/sell?asset=${queryAsset}`
          : '/panel/instant-trade/sell',
      },
      {
        id: 'fastOrderConvert',
        label: wallet.convert,
        href: queryAsset
          ? `/panel/instant-trade/convert?asset=${queryAsset}`
          : '/panel/instant-trade/convert',
      },
    ],
    [wallet, queryAsset],
  );

  return (
    <div>
      <Card classNames="!bg-transparent">
        {isDesktop && (
          <div className="flex items-center justify-between border-b border-dark-50 pl-10 lg:rounded-t-lg lg:bg-white">
            <div className="w-96 flex items-center justify-between text-center">
              {tabItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => push(item.href)}
                  className={clsx(
                    'pt-6 pb-4 w-full border-b-2 cursor-pointer',
                    asPath.includes(item.href)
                      ? 'border-primary-400'
                      : 'border-transparent',
                  )}
                >
                  {item.label}
                </div>
              ))}
            </div>

            <GuideButton />
          </div>
        )}
        {children}
      </Card>
    </div>
  );
};

export default WalletFastOrderLayout;
