import React, { useEffect } from 'react';

import { useTermsContent } from '@/requests/termsAndConditions';
import { Spinner } from '@/components/Common';

interface IProps {
  activeTab: string;
}

const ArzinjaRulesContent: React.FC<IProps> = (props: IProps) => {
  const { activeTab } = props;
  const { data: termsContent, isLoading } = useTermsContent();
  if (!termsContent?.data || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { BlogPost_Post } = termsContent.data.attributes;

  useEffect(() => {
    scrollToSection(activeTab);
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section != null) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
      {BlogPost_Post.map(({ description, id, title }) => (
        <section id={String(id)} className="p-8">
          <article>
            <h2 className="text-xl font-medium text-dark-700">{title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: description }}
              className="mt-4 text-sm leading-6 text-dark-500"
            />
          </article>
        </section>
      ))}

      {/* <section id="terms" className="p-8">
        <article>
          <h2 className="text-xl font-medium text-dark-700">
            {terms.textTitle}
          </h2>
          <p className="mt-4 text-sm leading-6 text-dark-500">
            {terms.textDescription}
          </p>
          <h2 className="mt-8 text-xl font-medium text-dark-700">
            {terms.textTitle}
          </h2>
          <p className="mt-4 text-[14px]  text-dark-500">
            {terms.registerArzinja}
          </p>
          <ul className="mt-4 list-disc pr-5 text-sm leading-6 text-dark-500">
            <li>{terms.arzinjaRegisterRule1}</li>
            <li>{terms.arzinjaRegisterRule2}</li>
            <li>{terms.insertRightInfo}</li>
            <li>{terms.uploadImageRule}</li>
            <li>{terms.accessGivenAfterRegisteration}</li>
            <li>{terms.restrictionOnSecretInfo}</li>
            <li>{terms.secretInfoRules}</li>
            <li>{terms.beCarefullAboutSecretInfo}</li>
          </ul>
        </article>
      </section>
      <section id="widthraw" className="p-8">
        <article>
          <h2 className="text-xl font-medium text-dark-700">
            {terms.textTitle}
          </h2>
          <p className="mt-4 text-sm leading-6 text-dark-500">
            {terms.textDescription}
          </p>
          <h2 className="mt-8 text-xl font-medium text-dark-700">
            {terms.textTitle}
          </h2>
          <p className="mt-4 text-[14px]  text-dark-500">
            {terms.registerArzinja}
          </p>
          <ul className="mt-4 list-disc pr-5 text-sm leading-6 text-dark-500">
            <li>{terms.arzinjaRegisterRule1}</li>
            <li>{terms.arzinjaRegisterRule2}</li>
            <li>{terms.insertRightInfo}</li>
            <li>{terms.uploadImageRule}</li>
            <li>{terms.accessGivenAfterRegisteration}</li>
            <li>{terms.restrictionOnSecretInfo}</li>
            <li>{terms.secretInfoRules}</li>
            <li>{terms.beCarefullAboutSecretInfo}</li>
          </ul>
        </article>
      </section>
      <section id="removalOfResponsibility" className="p-8">
        <article>
          <h2 className="text-xl font-medium text-dark-700">
            {terms.textTitle}
          </h2>
          <p className="mt-4 text-sm leading-6 text-dark-500">
            {terms.textDescription}
          </p>
          <h2 className="mt-8 text-xl font-medium text-dark-700">
            {terms.textTitle}
          </h2>
          <p className="mt-4 text-[14px]  text-dark-500">
            {terms.registerArzinja}
          </p>
          <ul className="mt-4 list-disc pr-5 text-sm leading-6 text-dark-500">
            <li>{terms.arzinjaRegisterRule1}</li>
            <li>{terms.arzinjaRegisterRule2}</li>
            <li>{terms.insertRightInfo}</li>
            <li>{terms.uploadImageRule}</li>
            <li>{terms.accessGivenAfterRegisteration}</li>
            <li>{terms.restrictionOnSecretInfo}</li>
            <li>{terms.secretInfoRules}</li>
            <li>{terms.beCarefullAboutSecretInfo}</li>
          </ul>
        </article>
      </section> */}
    </>
  );
};

export default ArzinjaRulesContent;
