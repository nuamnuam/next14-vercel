import Link from 'next/link';
import { useRouter } from 'next/router';
import { useOpportunityDetailsContent } from '@/requests/job-vacancies/details';

import { Button, Icon, Modal, Spinner } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { ApplicationFormModalName } from './ApplicationForm';
import { assetsUrl } from '@/utils';

export const OpportunityDetailsModalName = 'opportunity-details-modal';

const OpportunityDetails = () => {
  const { closeSyncModal } = useModal(OpportunityDetailsModalName);
  const { query } = useRouter();
  const { data: opportunityDetails, isLoading } = useOpportunityDetailsContent(
    query.id as string,
  );
  const { showSyncModal: showApplicationFormModal } = useModal(
    ApplicationFormModalName,
  );
  const details = opportunityDetails?.data.attributes;

  return (
    <Modal
      sync
      fullScreen
      name={OpportunityDetailsModalName}
      onClose={closeSyncModal}
      hasCloseAction={true}
      titleWrapperClassName="!pt-6"
    >
      {!details || isLoading ? (
        <div className="flex items-center justify-center mt-10">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col items-center border-b border-dark-50 pb-4">
            <div className="rounded-[13px] bg-dark-50 p-2 ">
              <img
                src={assetsUrl(details.icon.data.attributes.url)}
                alt="media"
              />
            </div>
            {details.title ? (
              <span className="mt-4 text-center text-base font-bold text-dark-700">
                {details.title}
              </span>
            ) : null}
          </div>
          {details.description ? (
            <div
              dangerouslySetInnerHTML={{ __html: details.description }}
              className="mt-4"
            />
          ) : null}

          {details.is_external ? (
            <Button className="!mt-4">
              <Link href={details.send_cta_url}>{details.send_cta}</Link>
            </Button>
          ) : (
            <Button
              className="!mt-4"
              onClick={() => {
                closeSyncModal();
                showApplicationFormModal();
              }}
            >
              {details.send_cta}
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
};
export default OpportunityDetails;
