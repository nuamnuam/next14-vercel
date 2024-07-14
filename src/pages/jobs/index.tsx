import LandingLayout from '@/components/Layout/Landing';
import JobVacanciesPage from '@/components/Page/JobVacancies/JobVacanciesPage';
import { type NextPageWithLayout } from '@/types/nextjs';

const JobVacancies: NextPageWithLayout = () => {
  return <JobVacanciesPage />;
};

JobVacancies.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default JobVacancies;
