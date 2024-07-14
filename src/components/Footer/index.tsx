import { FC, useCallback } from 'react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

import FooterBackground from '@/assets/images/FooterBackground.svg';
import { Link2, LinksHeader2, useFooter } from '@/requests/home/footer';

import Copyright from './Copyright';
import FooterColumn from './FooterColumn';
import Support from './Support';
import Card from '../Common/Card';
import { Icon, Spinner } from '../Common';
import { FooterProps } from '../Layout/Landing';

const Footer: FC<FooterProps> = ({
  footer_data,
  contact_us,
  isLoading: isServerLoading,
}) => {
  const { data: footer, isLoading } = useFooter(!footer_data);
  const data = footer_data || footer?.data.attributes;
  const isComponentLoading = isServerLoading || isLoading;
  const { linksHeader2, link2, FooterBox_Lable } = data ?? {};

  const renderFooterMenus = useCallback(() => {
    return (
      (linksHeader2 as LinksHeader2)?.map((item) => {
        const submenus = (link2 as Link2).filter((i) => i.title === item.slug);
        return (
          <div className="flex-1">
            <FooterColumn title={item.title} items={submenus} />
          </div>
        );
      }) ?? []
    );
  }, [linksHeader2, link2]);

  if (!data || isComponentLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  return (
    <StyledWrraper className={'w-full bg-contain bg-top bg-no-repeat'}>
      <div className="container pt-8 lg:pt-44">
        <div className="mb-8 px-0 lg:mb-20 lg:px-28">
          <Support
            footer_data={data}
            contact_us={contact_us}
            isLoading={isComponentLoading}
          />
        </div>
        <div className="flex flex-wrap items-start justify-between">
          <div className="mb-14 hidden w-full md:block lg:mb-0 lg:w-5/12 lg:pl-32">
            <FooterAbout data={data} isLoading={isComponentLoading} />
          </div>
          <div className="flex w-full md:w-2/3 lg:w-1/3">
            {renderFooterMenus()}
          </div>
          <div className="hidden w-full md:block md:w-1/3 lg:w-3/12">
            <StartColumn data={data} isLoading={isComponentLoading} />
          </div>
          <div className="mt-8 block rounded-lg bg-white py-2 px-6 md:hidden">
            <p className="m-0 my-0 text-justify text-sm text-dark-600">
              {FooterBox_Lable?.title}
            </p>
          </div>
        </div>
      </div>
      <Copyright
        footer_data={data}
        contact_us={contact_us}
        isLoading={isComponentLoading}
        isShowSocialsTitle={true}
      />
    </StyledWrraper>
  );
};

const StyledWrraper = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    backgroundImage: `url('${FooterBackground.src}')`,
  },
}));

const FooterAbout: FC<any> = ({ data, isLoading }) => {
  const { FooterBox_CB, FooterBox_Lable } = data ?? {};

  if (!data || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  return (
    <div className="">
      <div className="mb-4 flex items-center justify-start">
        <Icon icon="Arzinja-Filled" className="text-primary-500" size={24} />
        <span className="mr-2 text-xl font-bold text-dark-700">
          {FooterBox_CB?.title}
        </span>
      </div>
      <p
        className="my-0 text-justify text-sm text-dark-600 font-medium leading-6"
        dangerouslySetInnerHTML={{ __html: FooterBox_CB?.description }}
      />

      <div className="mt-4 flex items-center justify-start">
        <Icon icon="Map-OutLined" size={24} className="text-dark-300" />
        <p
          className="my-0 mr-2 text-justify text-sm text-dark-600 font-medium leading-6"
          dangerouslySetInnerHTML={{ __html: FooterBox_Lable?.title }}
        />
      </div>
    </div>
  );
};

const StartColumn: FC<any> = ({ data, isLoading }) => {
  const { Start_FB, Help_IC, Help_IC_ctaUrl } = data ?? {};

  if (!data || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold text-dark-700">
        {Start_FB?.[0]?.title}
      </span>
      <div className="flex flex-col">
        <p
          className="mt-4 mb-8 text-justify text-sm text-dark-600"
          dangerouslySetInnerHTML={{ __html: Start_FB?.[0]?.description }}
        />
        <Link href={Help_IC_ctaUrl ?? '#'}>
          <Card classNames="p-4 lg:p-6 shadow-card">
            <div className="flex flex-col items-center lg:flex-row">
              <Icon
                icon="Help-TwoTone"
                size={32}
                className="[&>*]:fill-dark-200"
              />
              <div className="mt-3 flex flex-col lg:mr-4 lg:mt-0">
                <span className="text-sm font-bold text-dark-700 lg:mb-1 lg:text-lg">
                  {Help_IC?.title}
                </span>
                <span
                  className="hidden text-sm text-dark-500 lg:block"
                  dangerouslySetInnerHTML={{ __html: Help_IC?.description }}
                />
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
