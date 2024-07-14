import { Card, Skeleton } from '@/components/Common';
import { useBreakpoint } from '@/hooks';
import AuthBg from '@/assets/images/AuthBackground.svg';

import CoinDescription from './CoinDescription';

const PageSkeleton = () => {
  const { isDesktop } = useBreakpoint();

  return (
    <section
      className="bg-no-repeat bg-[100%_-108px]"
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
    >
      <div className="container pt-8 px-0 md:px-4">
        <header className="flex flex-col py-6 items-start justify-between md:flex-row">
          <div className=" flex w-full gap-x-4 px-4 md:w-auto md:gap-x-8 md:px-0">
            {isDesktop ? (
              <Skeleton type="iconBox" />
            ) : (
              <Skeleton type="iconBox" />
            )}

            <div className="flex w-full justify-between md:flex-col">
              <div>
                <h3 className="text-base font-medium text-dark-500">
                  <Skeleton type="text" />
                </h3>
                <h2 className="text-xl md:text-[28px] font-bold text-dark-700">
                  <Skeleton type="title" />
                </h2>
              </div>
              <div className="flex:1 flex items-center justify-end gap-x-4 md:mt-6 md:flex-auto md:justify-start">
                <Skeleton type="icon" />

                <Skeleton type="icon" />

                <Skeleton type="icon" />
              </div>
            </div>
          </div>

          <div className="mt-8 w-full md:w-auto border-t-2 border-t-dark-100 px-4 pt-8 md:mt-0 md:border-none md:px-0 md:pt-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-dark-500">
                <Skeleton type="text" />
              </p>
              <p className="text-xl font-medium text-dark-700">
                <span className="pr-2 text-base text-dark-700"></span>
                <span className="font-bold text-xl">
                  <Skeleton type="text" />
                </span>
              </p>
            </div>
            <div className="my-6 flex items-center justify-between">
              <p className="text-base font-medium text-dark-500">
                <Skeleton type="text" />
              </p>
              <Skeleton type="chip" />
            </div>
            <div className="flex items-center justify-between gap-x-4">
              <Skeleton type="button" />

              <Skeleton type="button" />
            </div>
          </div>
        </header>

        <Card as="section" classNames="p-4 md:p-0">
          <CoinDescription isLoading={true} />
        </Card>
      </div>
    </section>
  );
};

export default PageSkeleton;
