import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useAddPhoneNumberMutation } from '@/requests/panel/my-account/kyc/addPhoneNumber';
import {
  Alert,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  InputAlert,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type IPhoneNumberModel, type IPhoneNumber } from '@/types/myAccount';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { getLang, landlinePhoneRegex, toEnglishDigits } from '@/utils';
import { useLang } from '@/hooks';

const [kyc] = getLang(['kyc']);

const formSchema = yup.object().shape({
  phone_number: yup
    .string()
    .required(kyc.requiredContactPhoneNumber)
    .test('mathc', kyc.wrongeContactPhoneNumber, (val: any) =>
      landlinePhoneRegex().test(toEnglishDigits(val)),
    ),
});

const PhoneNumberPhone: React.FC = () => {
  const [global, kyc] = useLang(['global', 'kyc']);

  const { isPending: isLoading, mutateAsync: mutateAddPhoneNumberAsync } =
    useAddPhoneNumberMutation();

  const methods = useForm<IPhoneNumber>({
    mode: 'onBlur',
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid },
  } = methods;

  const onSubmitHandler = async (data: IPhoneNumber) => {
    try {
      const { phone_number } = data;
      const engPhoneNumber = toEnglishDigits(phone_number);
      const body: IPhoneNumberModel = {
        area_code: engPhoneNumber?.slice(0, 3),
        main_number: engPhoneNumber?.slice(3),
      };

      await mutateAddPhoneNumberAsync(body);
    } catch (error) {
      console.log('e:', error);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div>
            <Controller
              name={'phone_number'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <FormGroup className="mb-4">
                  <FormLabel htmlFor="phone_number">
                    {kyc.contactPhoneNumber}
                  </FormLabel>

                  <FormInput
                    {...register('phone_number')}
                    name="phone_number"
                    placeholder={kyc.samplePhoneNumber}
                    value={value}
                    onChange={(val) => {
                      if (!(val[1] === '9' || val[1] === '0')) {
                        onChange(val);
                      }
                    }}
                    error={invalid}
                    onlyNumber
                    maxLength={11}
                    caption={
                      error && (
                        <InputAlert message={error.message} variant="danger" />
                      )
                    }
                    ltr
                  />
                </FormGroup>
              )}
            />
          </div>
          <Alert
            slug={{
              feature: 'user-verification',
              section: 'phone',
            }}
          />
          <ModalFooter fullScreen>
            <Button
              size="lg"
              disabled={!isValid}
              fullWidth
              variant="primary"
              isLoading={isLoading}
              onClick={handleSubmit(onSubmitHandler)}
            >
              {global.nextStep}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </>
  );
};

export default PhoneNumberPhone;
