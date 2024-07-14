import { useMemo } from 'react';
import { useRouter } from 'next/router';

import AuthBg from '@/assets/images/AuthBackground.svg';
import { useHelpPageContent } from '@/requests/help/page';
import { useHelpDetailsContent } from '@/requests/help/details';
import { useHelpCatByIdContent } from '@/requests/help/catById';
import { assetsUrl } from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';
import BreadCrumb from '@/components/Common/BreadCrumb';
import { Spinner } from '@/components/Common';

import SearchBox from './components/SearchBox';
import ResponsiveMenu from './components/Menu/ResponsiveMenu';
import RightMenu from './components/Menu/RightMenu';
interface Props {
  children: React.ReactNode;
}

const HelpLayout: React.FC<Props> = ({ children }) => {
  const [global, help] = useLang(['global', 'help']);

  const { query } = useRouter();
  const { isDesktop } = useBreakpoint();

  const { data: helpDetails, isLoading: helpDetailsLoading } =
    useHelpDetailsContent(query.id as string | undefined);

  const { data: catById, isLoading: cateByIdLoading } = useHelpCatByIdContent(
    query.main === 'latest-help'
      ? undefined
      : (query.main as string | undefined),
  );

  const { data: helpPage, isLoading } = useHelpPageContent();

  const breadCrumbGenerator = useMemo(() => {
    const items = [
      {
        label: global.startPage,
        href: '/',
      },
      {
        label: help.helps,
        href: '/help',
      },
    ];

    if (query.main === 'latest-help') {
      items.push({
        label: help.latestHelps,
        href: `/help/latest-help`,
      });
    }

    if (query.main !== 'latest-help' && query.main && catById?.data) {
      items.push({
        label: catById?.data[0]?.attributes?.title?.trimStart().trimEnd(),
        href: `/help/${query.main}`,
      });
    }

    if (query.id && helpDetails?.data && query.main) {
      items.push({
        label: helpDetails.data[0].attributes.title.trimStart().trimEnd(),
        href: `/help/${query.main}/${helpDetails.data[0].attributes.slug}`,
      });
    }

    return items;
  }, [query, catById, helpDetails]);

  if (!helpPage || isLoading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const { title, subTitle, media } = helpPage.data.attributes;

  return (
    <div
      className="container bg-no-repeat bg-[50%_-80px]"
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
    >
      <div className="flex bg-top flex-row lg:mb-0 lg:justify-between lg:bg-inherit">
        <div className="flex w-full lg:w-3/5 flex-col items-start">
          <div className="mt-8 mb-6">
            <BreadCrumb classNames="!py-0" items={breadCrumbGenerator} />
          </div>
          {!query.main && !query.id ? (
            <h2 className="mb-2 lg:block hidden font-bold leading-7 text-dark-700">
              {subTitle}
            </h2>
          ) : null}

          {cateByIdLoading || helpDetailsLoading ? (
            <div className="flex items-center justify-center mt-8">
              <Spinner />
            </div>
          ) : (
            <h1
              className="text-[20px] lg:text-[28px] font-bold leading-10 text-dark-700"
              dangerouslySetInnerHTML={{
                __html:
                  !query.id && query.main === 'latest-help'
                    ? help.latestHelps
                    : !query.id &&
                      query.main &&
                      catById?.data[0].attributes.title
                    ? catById?.data[0].attributes.title.trimStart().trimEnd()
                    : query.id && helpDetails?.data[0].attributes.title
                    ? helpDetails?.data[0].attributes.title
                        .trimStart()
                        .trimEnd()
                    : title.trimStart().trimEnd(),
              }}
            />
          )}
          <SearchBox />
        </div>
        <div className="hidden lg:block mt-10">
          <img
            src={assetsUrl(media.data.attributes.url)}
            className="w-[410px] h-[220px]"
            alt="media"
          />
        </div>
      </div>
      <div className="mb-6 block rounded-lg bg-white shadow-card lg:hidden">
        {query?.main ? <ResponsiveMenu /> : null}
      </div>
      <div className="flex gap-6 lg:relative">
        {query?.main ? (
          <div className="hidden lg:block">
            <RightMenu />
          </div>
        ) : null}
        <div className="flex-auto">{children}</div>
      </div>
    </div>
  );
};

export default HelpLayout;
