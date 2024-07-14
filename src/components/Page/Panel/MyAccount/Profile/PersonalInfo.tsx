import React from 'react';
import usePersonalInfo from './usePersonalInfo';
import LevelSection from './Components/LevelSection';
import PersonalInfoSection from './Components/PersonalInfoSection';
import ContactSection from './Components/ContactSection';
import { Modal } from '@/components/Common';

const contactFormsModal = 'contactFormsModal';
const PersonalInfo = () => {
  const {
    checkRenderEl,
    isDesktop,
    getModalContent,
    closeSyncModal,
    contactInfoTab,
    contactInfoList,
    setContactInfoTab,
    getStatus,
  } = usePersonalInfo();

  return (
    <>
      <Modal
        sync
        name={contactFormsModal}
        onClose={() => {
          closeSyncModal();
          setContactInfoTab('');
        }}
        maxWidth={'433px'}
        hasCloseAction={false}
        contentAddtionalClassNames="!px-10"
        modalWrapper="[&>div>.MuiPaper-root]:!rounded-md"
      >
        {getModalContent(contactInfoTab)}
      </Modal>
      <div className="px-4 lg:px-0">
        {isDesktop && checkRenderEl('level') && (
          <LevelSection getStatus={getStatus} />
        )}
        {checkRenderEl('personal-info') && (
          <div className="mb-8 px-0 sm:px-4 pt-0 lg:p-0">
            <PersonalInfoSection />
          </div>
        )}
        <div className="px-0 sm:px-4 pt-0 lg:p-0">
          <ContactSection contactInfoList={contactInfoList} />
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
