import React from 'react';
import classNames from 'classnames';

import AuthBg from '@/assets/images/AuthBackground.svg';
import { useBreakpoint, useLang } from '@/hooks';

import Guide from './Guide';
import ContactUsForm from './ContactUsForm';
import { useContactUsContent } from '@/requests/contact-us';
import { assetsUrl } from '@/utils';
import { Spinner } from '@/components/Common';
import BreadCrumb from '@/components/Common/BreadCrumb';

const ContactUsPage = () => {
  const [contactUs] = useLang(['contactUs']);

  const { isDesktop } = useBreakpoint();

  const { data: contactUsContent, isLoading } = useContactUsContent();

  const breadcrumbs = [
    { label: contactUs.startPage, href: '/' },
    { label: contactUs.contactUS, href: '/contact-us' },
  ];

  if (!contactUsContent?.data || isLoading)
    return (
      <div className="flex mt-8 justify-center items-center">
        <Spinner />
      </div>
    );

  const { Header_SH } = contactUsContent.data.attributes;

  return (
    <div
      style={{ backgroundImage: isDesktop ? `url('${AuthBg.src}')` : '' }}
      className="bg-no-repeat bg-[length:100%] bg-[100%_-140px]"
    >
      <div className="mx-auto p-4 sm:max-w-[1296px] m:p-0 lg:p-0">
        <div className="container flex flex-col justify-between bg-top py-0  sm:flex-row sm:p-0 lg:bg-inherit">
          <div className="sm:w-6/12 pt-4 lg:pt-8 lg:w-1/2">
            <BreadCrumb items={breadcrumbs} classNames="!p-0" />
            <div className="my-6 lg:mt-12 gap-y-2 flex flex-col">
              <div
                className="lg:block hidden text-sm font-bold text-dark-700 sm:text-right"
                dangerouslySetInnerHTML={{ __html: Header_SH.description }}
              />
              <h1
                className="text-xl md:text-[28px] font-black leading-10 text-dark-700 sm:text-right"
                dangerouslySetInnerHTML={{ __html: Header_SH.title }}
              />
            </div>
          </div>
          <div className="mt-5 hidden items-center justify-center bg-contain bg-center bg-no-repeat sm:mt-0 lg:flex sm:w-1/3 lg:w-auto">
            <div className="w-5/5 lg:block">
              <img
                src={assetsUrl(Header_SH.media.data.attributes.url)}
                alt="media"
                className="w-[500px] h-[220px]"
              />
            </div>
          </div>
        </div>
        <div
          className={classNames(
            'relative flex-col gap-x-6 gap-y-6 sm:p-0 sm:pr-0 sm:pl-0 md:flex-row lg:flex',
            isDesktop ? '' : 'gap-y-6',
          )}
        >
          <div className="lg:w-5/12">
            <Guide />
          </div>
          <div className="lg:w-7/12">
            <ContactUsForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
