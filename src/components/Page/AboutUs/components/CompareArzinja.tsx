import Image from 'next/image';

import { Card, Spinner } from '@/components/Common';
import TargetImage from '@/assets/images/About-us/target.png';
import { useGetAboutUs } from '@/requests/about-us/about-us';
import { assetsUrl } from '@/utils';

const CompareArzinja = () => {
  const { data: aboutUs, isLoading } = useGetAboutUs();
  if (!aboutUs || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { description, title } = aboutUs?.data?.attributes?.Advantage_SH?.[0];
  const advantagesIC = aboutUs?.data?.attributes?.Advantage_IC;
  const FirstGoals = aboutUs?.data?.attributes?.Goals_GB?.[0];
  const SecondGoals = aboutUs?.data?.attributes?.Goals_GB?.[1];

  return (
    <div className="mt-8 md:mt-0">
      <div className="flex gap-6 lg:gap-0 flex-col items-center lg:flex-row">
        <div className="w-full lg:w-1/2">
          <h3 className="text-xl font-black text-dark-700">{title}</h3>
          <p
            dangerouslySetInnerHTML={{ __html: description }}
            className="mt-4 lg:max-w-[504px] text-xs font-medium leading-6 text-dark-500"
          />
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 w-full gap-6 lg:mt-0 lg:w-1/2">
          {advantagesIC.map((item) => (
            <Card
              classNames="w-full pb-6 px-7 pt-7 flex gap-7-3 justify-center items-center flex-col"
              key={item.id}
            >
              <img
                src={`${assetsUrl(item?.media?.data?.[0]?.attributes?.url)}`}
                alt="media"
                className="w-[32px] h-[32px]"
              />
              <p className=" mt-3 text-sm font-bold leading-6 text-dark-700">
                {item?.title}
              </p>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-x-6 sm:flex-row lg:mt-32">
        <Card classNames="text-center lg:text-right !bg-dark-700 p-8 md:p-12 !relative sm:w-1/2 w-full">
          <div className="top-0 left-[40px] flex items-center mb-6 rounded-2xl justify-center static lg:absolute lg:top-[-100px] lg:justify-end">
            <img
              src={assetsUrl(FirstGoals.media.data.attributes?.url)}
              alt={FirstGoals.media.data.attributes?.alternativeText ?? ''}
              className="w-[113px] lg:w-[180px]"
            />
          </div>
          <h3 className="mt-8 text-xl font-bold text-white  md:mt-0">
            {FirstGoals?.title}
          </h3>
          <p
            className="mt-4 text-xs font-medium leading-6 text-dark-200"
            dangerouslySetInnerHTML={{ __html: FirstGoals?.description }}
          />
        </Card>
        <Card classNames="text-center lg:text-right mt-8 sm:mt-0 !bg-dark-700 p-8 md:p-12 !relative sm:w-1/2 w-full">
          <div className="top-0 left-[40px] flex items-center mb-6 justify-center static lg:absolute lg:top-[-80px] lg:justify-end">
            <img
              src={assetsUrl(SecondGoals.media.data.attributes?.url)}
              alt={SecondGoals.media.data.attributes?.alternativeText ?? ''}
              className="w-[113px] lg:w-[180px]"
            />
          </div>
          <h3 className="mt-8 text-xl font-bold text-white md:mt-0">
            {SecondGoals?.title}
          </h3>
          <p
            className="mt-4 text-xs font-medium leading-6 text-dark-200"
            dangerouslySetInnerHTML={{ __html: SecondGoals?.description }}
          />
        </Card>
      </div>
    </div>
  );
};
export default CompareArzinja;
