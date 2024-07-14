import { useRouter } from 'next/router';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useCaptchaQuery } from '@/requests/captcha/captchaQuery';
import { usePostContactUsForm } from '@/requests/contact-us/sendContactUsForm';
import { useOpportunityDetailsContent } from '@/requests/job-vacancies/details';

import {
  Button,
  Chip,
  FormGroup,
  FormInput,
  FormLabel,
  Icon,
  Modal,
  SelectInput,
  Spinner,
} from '@/components/Common';
import Recaptcha from '@/components/Recaptcha';
import { useModal } from '@/hooks/useModal';
import useAuthStore from '@/store/authStore';
import { ApplicationFormModal } from '@/types/applicationForm';
import { assetsUrl, getLang, toEnglishDigits } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import ResumeUploader from './resumeUploader';
import { useLang } from '@/hooks';

const [global, jobVacancies] = getLang(['global', 'jobVacancies']);

export const ApplicationFormModalName = 'application-form-modal';

const formSchema = yup.object().shape({
  full_name: yup.string().required(global.requiredFullName),
  email: yup.string().required(global.emailRequired).email(global.wrongEmail),
  mobile: yup
    .string()
    .required(global.mobileNumberRequired)
    .test('mathc', global.wrongMobileNumber, (val: any) =>
      /^(\+98|0)?9\d{9}$/.test(toEnglishDigits(val)),
    ),
  subject: yup.string().default('front-end programmer'),
  captcha: yup.string().required(jobVacancies.captchaRequired),
  attachment: yup.string().required(jobVacancies.attachmentIsRequired),
  website: yup.string().optional(),
});

const ApplicationFrm = () => {
  const [global, jobVacancies] = useLang(['global', 'jobVacancies']);

  const { closeSyncModal } = useModal(ApplicationFormModalName);
  const { isPending: isSubmitting } = usePostContactUsForm();
  const { refetch: requestCaptcha } = useCaptchaQuery();
  const captcha = useAuthStore((state) => state.captcha);
  const { query } = useRouter();
  const { data: opportunityDetails, isLoading } = useOpportunityDetailsContent(
    query.id as string,
  );
  const methods = useForm<ApplicationFormModal>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { isValid },
  } = methods;
  const details = opportunityDetails?.data.attributes;

  const onSubmitHandler = async (data: ApplicationFormModal) => {
    // TODO: Will submit form application
  };

  const reFetchCaptcha = () => {
    resetField('captcha', {
      keepError: false,
      keepTouched: false,
      keepDirty: false,
    });
    requestCaptcha();
  };

  return (
    <Modal
      sync
      fullScreen
      name={ApplicationFormModalName}
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
              <img src={assetsUrl(details.icon.data.attributes.url)} />
            </div>
            <span className="mt-4 text-center text-base font-bold text-dark-700">
              {jobVacancies.sendResumt}
            </span>
          </div>
          <Chip
            label={`${jobVacancies.sendResumt} ${jobVacancies.for} ${details.title}`}
            classNames="!justify-start mt-4"
            variant="info"
          />
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="mt-8 items-center justify-start sm:flex-col"
            >
              <div className="grid grid-cols-1 w-full flex-wrap gap-x-11">
                <div className="w-full">
                  <Controller
                    name={'full_name'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-6">
                        <FormLabel htmlFor="full_name">
                          {global.fullName}
                        </FormLabel>

                        <FormInput
                          {...register('full_name')}
                          name="full_name"
                          placeholder={global.fullName}
                          onChange={onChange}
                          value={value}
                          error={invalid}
                          caption={error?.message}
                          disabledMode="success"
                        />
                      </FormGroup>
                    )}
                  />
                </div>
                <div className="w-full">
                  <Controller
                    name={'mobile'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-6">
                        <FormLabel htmlFor="mobile">
                          {global.mobileNumber}
                        </FormLabel>
                        <FormInput
                          {...register('mobile')}
                          name="mobile"
                          placeholder={global.sampleMobileNumber}
                          value={value}
                          onChange={onChange}
                          ltr
                          onlyNumber
                          error={invalid}
                          caption={error?.message}
                        />
                      </FormGroup>
                    )}
                  />
                </div>
                <div className="w-full">
                  <Controller
                    name={'email'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-6">
                        <FormLabel htmlFor="email">{global.email}</FormLabel>
                        <FormInput
                          {...register('email')}
                          name="email"
                          placeholder={global.emailSample}
                          value={value}
                          onChange={onChange}
                          ltr
                          inputType={'email'}
                          error={invalid}
                          caption={error?.message}
                        />
                      </FormGroup>
                    )}
                  />
                </div>
                <div className="w-full">
                  <Controller
                    name={'subject'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-6 mt-4 sm:mt-0">
                        <FormLabel>{jobVacancies.jobSubject}</FormLabel>
                        <SelectInput
                          options={[
                            {
                              label: jobVacancies.frontEndProgrammer,
                              value: 'front-end programmer',
                            },
                          ]}
                          {...register('subject')}
                          name="subject"
                          value={value}
                          onChange={onChange}
                          error={invalid}
                          caption={error?.message}
                        />
                      </FormGroup>
                    )}
                  />
                </div>
                <div className="w-full">
                  <Controller
                    name={'website'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-6">
                        <FormLabel htmlFor="website">
                          {jobVacancies.website}
                        </FormLabel>
                        <FormInput
                          {...register('website')}
                          name="website"
                          placeholder={jobVacancies.websitePlaceholder}
                          value={value}
                          onChange={onChange}
                          ltr
                          inputType={'text'}
                          error={invalid}
                          caption={error?.message}
                        />
                      </FormGroup>
                    )}
                  />
                </div>
              </div>

              <div className="w-full mb-6">
                <Controller
                  name={'attachment'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => {
                    return (
                      <FormGroup>
                        <FormLabel htmlFor="full_name">
                          {jobVacancies.attachYourResumeFile}
                        </FormLabel>
                        <ResumeUploader
                          label={jobVacancies.uploadResumeTitle}
                          value={value}
                          onChange={onChange}
                          error={invalid}
                          caption={error?.message}
                          icon="Upload-OutLined"
                          iconClassName="[&>*]:fill-blue-500"
                          btnLabel={jobVacancies.selectAttachmentFile}
                        />
                      </FormGroup>
                    );
                  }}
                />
              </div>
              <Controller
                name={'captcha'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <Recaptcha
                    data={captcha}
                    value={value ?? ''}
                    retry={reFetchCaptcha}
                    onChange={onChange}
                    error={invalid}
                    caption={error?.message}
                    captionIcon={
                      <Icon
                        icon="CloseCircle-OutLined"
                        className="text-danger-600"
                        size={14}
                      />
                    }
                  />
                )}
              />
              <Button
                size="lg"
                className="my-4 w-full bg-primary-500 opacity-100 !text-white"
                disabled={!isValid}
                isLoading={isSubmitting}
              >
                {global.send}
              </Button>
            </form>
          </FormProvider>
        </div>
      )}
    </Modal>
  );
};
export default ApplicationFrm;
