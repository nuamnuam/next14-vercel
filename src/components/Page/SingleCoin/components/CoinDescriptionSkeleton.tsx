import { Skeleton } from '@/components/Common';

const CoinDescriptionSkeleton = () => {
  return (
    <div className="flex flex-col gap-x-8 p-4 md:flex-row md:p-10">
      <div className="w-full md:w-[880px]">
        <Skeleton type="paragraph" />
      </div>
      <div className="mt-4 sticky top-2 w-full h-max md:mt-0 md:w-[420px]">
        <h2 className="border-b border-b-dark-100 pb-3 text-l font-bold text-dark-700">
          <Skeleton type="title" />
        </h2>
        <div className="p-6">
          {Array.from({ length: 10 }).map((i, idx) => (
            <div key={idx} className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium leading-6  text-dark-500">
                <Skeleton type="text" />
              </h3>
              <Skeleton type="text" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoinDescriptionSkeleton;
