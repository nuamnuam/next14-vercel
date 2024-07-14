import { Card, Spinner } from '@/components/Common';
import { useJobVacanciesPageContent } from '@/requests/job-vacancies';
import { assetsUrl } from '@/utils';

const WhyArzinja = () => {
  const { data: jobVacanciesPage, isLoading } = useJobVacanciesPageContent();

  if (!jobVacanciesPage?.data || isLoading)
    return (
      <div className="flex items-center justify-center mt-10">
        <Spinner />
      </div>
    );

  const jobVacanciesPageData = jobVacanciesPage.data.attributes;

  return (
    <div className="mt-8 md:mt-0">
      <div className="flex items-start lg:items-center gap-6 lg:flex-row flex-col">
        {jobVacanciesPageData.Why_SH.title ? (
          <h2 className="text-dark-700 text-2xl md:text-[28px] font-black">
            {jobVacanciesPageData.Why_SH.title}
          </h2>
        ) : null}
        {jobVacanciesPageData.Why_SH.description ? (
          <p
            className="text-sm text-dark-500 font-medium"
            dangerouslySetInnerHTML={{
              __html: jobVacanciesPageData.Why_SH.description,
            }}
          />
        ) : null}
      </div>
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-6 w-full gap-6">
        {jobVacanciesPageData.Why_IC.map((item) => (
          <Card
            classNames="w-full pb-6 px-7 pt-7 flex gap-7-3 justify-center items-center flex-col"
            key={item.id}
          >
            <img
              src={`${assetsUrl(item.media.data[0].attributes.url)}`}
              alt="media"
            />
            <p className=" mt-3 text-sm font-bold leading-6 text-dark-700">
              {item.title}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default WhyArzinja;
