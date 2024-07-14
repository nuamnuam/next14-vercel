import 'mapbox-gl/dist/mapbox-gl.css';

import React, { useCallback } from 'react';
import * as yup from 'yup';
import { setRTLTextPlugin } from 'mapbox-gl';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import {
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  FormTextarea,
  Icon,
  Spinner,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type ContactUsFormModel } from '@/types/contactUs';
import { getLang, toEnglishDigits } from '@/utils';
import { usePostContactUsForm } from '@/requests/contact-us/sendContactUsForm';
import { useContactUsContent } from '@/requests/contact-us';
import { showToast } from '@/components/ToastProvider';
import Recaptcha from '@/components/Recaptcha';
import useAuthStore from '@/store/authStore';
import { useCaptchaQuery } from '@/requests/captcha/captchaQuery';
import { useLang } from '@/hooks';

const [contactUs] = getLang(['contactUs']);

const formSchema = yup.object().shape({
  full_name: yup.string().required(contactUs.requiredFullName),
  email: yup
    .string()
    .required(contactUs.emailRequired)
    .email(contactUs.wrongEmail),
  mobile: yup
    .string()
    .required(contactUs.mobileNumberRequired)
    .test('match', contactUs.wrongMobileNumber, (val: any) =>
      /^(\+98|0)?9\d{9}$/.test(toEnglishDigits(val)),
    ),
  subject: yup.string().default('public'),
  captcha: yup.string().required(contactUs.captchaRequired),
});

const ContactUsForm = () => {
  const [contactUs] = useLang(['contactUs']);

  const { mutate: sendForm, isPending: isSubmitting } = usePostContactUsForm();
  const { data: contactUsContent, isLoading } = useContactUsContent();
  const { refetch: requestCaptcha } = useCaptchaQuery();

  const captcha = useAuthStore((state) => state.captcha);

  if (!contactUsContent?.data || isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const methods = useForm<ContactUsFormModel>({
    mode: 'onBlur',
    resolver: yupResolver(formSchema),
  });

  const splitLocation =
    contactUsContent.data.attributes.Location.title.split(',');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    resetField,
    formState: { isValid },
  } = methods;

  const onSubmitHandler = async (data: ContactUsFormModel) => {
    if (!captcha?.key) return;

    sendForm(
      {
        ...data,
        captcha_key: captcha?.key,
      },
      {
        onSuccess() {
          showToast.success(contactUs.successContact);
          reset();
          setValue('content', '');
        },
      },
    );
  };

  const reFetchCaptcha = () => {
    resetField('captcha', {
      keepError: false,
      keepTouched: false,
      keepDirty: false,
    });
    requestCaptcha();
  };

  useCallback(() => {
    setRTLTextPlugin(
      'https://www.parsimap.ir/scripts/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js',
      (err: any) => {
        console.log(err);
      },
    );
  }, []);

  return (
    <div className="mt-8 rounded-lg bg-white p-6 lg:mt-0">
      <div className="rounded-lg overflow-hidden mb-6">
        <ReactMapGL
          initialViewState={{
            latitude: +splitLocation[0],
            longitude: +splitLocation[1],
            zoom: 10,
          }}
          mapStyle="https://www.parsimap.com/styles/mapbox/green-gray10.json"
          mapboxAccessToken={`${process.env.NEXT_PUBLIC_MAP_TOKEN}`}
          style={{ width: '100%', height: 218 }}
        >
          <NavigationControl position="bottom-right" />
          <Marker
            latitude={+splitLocation[0]}
            longitude={+splitLocation[1]}
            anchor="bottom"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/512px-Map_marker.svg.png"
              className="w-4"
            />
          </Marker>
        </ReactMapGL>
      </div>

      <h2 className="text-xl font-bold text-dark-700">
        {contactUs.howWeCanHelpYou}
      </h2>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="bloc mt-8 items-center justify-start sm:flex-col"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full flex-wrap gap-x-4">
            <div className="w-full">
              <Controller
                name={'full_name'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup className="mb-4">
                    <FormLabel htmlFor="full_name">
                      {contactUs.fullName}
                    </FormLabel>

                    <FormInput
                      {...register('full_name')}
                      name="full_name"
                      placeholder={contactUs.fullName}
                      onChange={onChange}
                      value={value}
                      error={invalid}
                      maxLength={20}
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
                  <FormGroup className="mb-4">
                    <FormLabel htmlFor="email">{contactUs.email}</FormLabel>
                    <FormInput
                      {...register('email')}
                      name="email"
                      placeholder={contactUs.emailSample}
                      value={value}
                      onChange={onChange}
                      maxLength={50}
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
                name={'mobile'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup>
                    <FormLabel htmlFor="mobile">
                      {contactUs.mobileNumber}
                    </FormLabel>
                    <FormInput
                      {...register('mobile')}
                      name="mobile"
                      placeholder={contactUs.sampleMobileNumber}
                      value={value}
                      onChange={onChange}
                      ltr
                      maxLength={11}
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
                name={'subject'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup className="mb-4 mt-4 sm:mt-0">
                    <FormLabel>{contactUs.topic}</FormLabel>
                    <FormInput
                      {...register('subject')}
                      name="subject"
                      placeholder={contactUs.public}
                      value={value}
                      onChange={onChange}
                      error={invalid}
                      maxLength={50}
                      caption={error?.message}
                    />
                  </FormGroup>
                )}
              />
            </div>
          </div>
          <div className="ml-4 w-full">
            <Controller
              name={'content'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <FormGroup className="mb-4">
                  <FormLabel htmlFor="content">
                    {contactUs.description}
                  </FormLabel>

                  <FormTextarea
                    {...register('content')}
                    name="content"
                    placeholder={contactUs.sampleText}
                    value={value}
                    onChange={onChange}
                    maxLength={255}
                    className="!h-24"
                  />
                </FormGroup>
              )}
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
            className="my-4 w-full  lg:w-fit"
            disabled={!isValid}
            isLoading={isSubmitting}
          >
            {contactUs.send}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
export default ContactUsForm;
