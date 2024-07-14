import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  FormGroup,
  ImageFile,
  Alert,
  InputAlert,
} from '@/components/Common';
import { useUploadNationalCardMutation } from '@/requests/panel/my-account/kyc/uploadNationalCardImage';
import { yupResolver } from '@hookform/resolvers/yup';
import { type ICardImageModel } from '@/types/myAccount';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { getLang } from '@/utils';
import { useLang } from '@/hooks';

const [kyc] = getLang(['kyc']);

const validFileExtensions: Record<string, string[]> = {
  image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
};

const isValidFileType = (fileName: string = '', fileType: string) => {
  if (typeof fileName === 'string')
    return (
      fileName &&
      validFileExtensions?.[fileType]?.indexOf(
        fileName?.split?.('.')?.pop() ?? 'jpg',
      ) > -1
    );
  return false;
};

const formSchema = yup.object().shape({
  national_card_image: yup
    .mixed()
    .test(
      'is-valid-type',
      kyc.notValidImageType,
      (value) =>
        !!isValidFileType(value?.name?.toLowerCase() ?? '', 'image') ?? false,
    )
    .test('fileSize', 'The file is too large', (value: File) => {
      return true;
      //   if (!value.length) return true;
      //   return value[0].size <= 2000000;
    })
    .required('required'),
});

const IdentityDocument: React.FC = () => {
  const [kyc] = useLang(['kyc']);

  const methods = useForm<ICardImageModel>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;
  const { isPending: isLoading, mutateAsync: mutateNationalCardImageAsync } =
    useUploadNationalCardMutation();

  const onSubmitHandler = async (data: ICardImageModel) => {
    try {
      const { national_card_image } = data;

      const formData = new FormData();
      if (national_card_image)
        formData.append('national_card_image', national_card_image);

      await mutateNationalCardImageAsync(formData);
    } catch (error) {
      console.log('e:', error);
    }
  };
  return (
    <div className="flex flex-col">
      <Alert
        slug={{
          feature: 'user-verification',
          section: 'identification-doc-upload-info-doc',
          step: 'upload-info-doc',
        }}
      />
      <p className="my-6 text-sm leading-6 text-dark-900">
        {kyc.uploadCertificateCardImage}
      </p>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="block items-center justify-start bg-white sm:flex-col"
        >
          <Controller
            name={'national_card_image'}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid },
            }) => (
              <FormGroup>
                <ImageFile
                  label={kyc.addCertificateCard}
                  placeholder={kyc.firstNamePlaceholder}
                  value={value}
                  onChange={onChange}
                  error={invalid && !!value}
                  caption={
                    error &&
                    !!value && (
                      <InputAlert message={error?.message} variant="danger" />
                    )
                  }
                />
              </FormGroup>
            )}
          />
          <ModalFooter fullScreen>
            <Button
              className="lg:mt-6"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!isValid}
              variant="primary"
              onClick={handleSubmit(onSubmitHandler)}
            >
              {kyc.nextStep}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </div>
  );
};

export default IdentityDocument;
