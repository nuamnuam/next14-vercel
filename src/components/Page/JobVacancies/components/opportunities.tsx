import { useRouter } from 'next/router';
import Link from 'next/link';
import { useOpportunitiesContent } from '@/requests/job-vacancies/opportunities';
import { useJobVacanciesPageContent } from '@/requests/job-vacancies';

import { Button, Card, Spinner } from '@/components/Common';
import { assetsUrl } from '@/utils';
import OpportunityDetails, {
  OpportunityDetailsModalName,
} from './OpportunityDetailsModal';
import { useModal } from '@/hooks/useModal';
import ApplicationFrm, { ApplicationFormModalName } from './ApplicationForm';

const Opportunities = () => {
  const { data: jobVacanciesPage, isLoading } = useJobVacanciesPageContent();
  const { data: opportunities } = useOpportunitiesContent();
  const { showSyncModal } = useModal(OpportunityDetailsModalName);
  const { showSyncModal: showApplicationFormModal } = useModal(
    ApplicationFormModalName,
  );
  const router = useRouter();

  if (!jobVacanciesPage?.data || isLoading || !opportunities?.data)
    return (
      <div className="flex items-center justify-center mt-10">
        <Spinner />
      </div>
    );

  const jobVacanciesPageData = jobVacanciesPage.data.attributes;

  return (
    <div className="mt-8 md:mt-0">
      <div className="flex items-start lg:items-center gap-6 lg:flex-row flex-col">
        {jobVacanciesPageData.Opportunity_SH.title ? (
          <h2 className="text-dark-700 text-2xl md:text-[28px] font-black">
            {jobVacanciesPageData.Opportunity_SH.title}
          </h2>
        ) : null}
        {jobVacanciesPageData.Opportunity_SH.description ? (
          <p
            className="text-sm text-dark-500 font-medium"
            dangerouslySetInnerHTML={{
              __html: jobVacanciesPageData.Opportunity_SH.description,
            }}
          />
        ) : null}
      </div>
      <div className="mt-8 grid grid-cols-1 w-full gap-6">
        {opportunities.data.map((item) => (
          <Card classNames="w-full p-4 md:p-8" key={item.id}>
            <h3 className="font-bold text-xl text-dark-700">
              {item.attributes.title}
            </h3>
            <div className="flex items-start justify-between md:flex-row flex-col">
              <div className="flex flex-col gap-2 mt-5">
                {item.attributes.summary.map(
                  ({ title, description, media }) => (
                    <div className="flex items-start gap-1 sm:flex-row flex-col sm:items-center">
                      <div className="flex items-center">
                        <img
                          className="w-6 h-6"
                          src={assetsUrl(media.data.attributes.url)}
                          alt={media.data.attributes.alternativeText}
                        />
                        <span className="text-dark-700 text-sm font-bold block mr-2 ml-4">
                          {title}
                        </span>
                      </div>
                      <div
                        className="text-sm text-dark-500 font-medium"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="flex items-center sm:flex-row flex-col gap-4 md:w-fit w-full md:mt-0 mt-8">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    showSyncModal(() => {
                      router.replace({
                        query: { ...router.query, id: item.id },
                      });
                    });
                  }}
                >
                  {item.attributes.more_cta}
                </Button>
                {item.attributes.is_external ? (
                  <Button className="w-full">
                    <Link href={item.attributes.send_cta_url}>
                      {item.attributes.send_cta}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      showApplicationFormModal(() => {
                        router.replace({
                          query: { ...router.query, id: item.id },
                        });
                      });
                    }}
                  >
                    {item.attributes.send_cta}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        <OpportunityDetails />
        <ApplicationFrm />
      </div>
    </div>
  );
};
export default Opportunities;
