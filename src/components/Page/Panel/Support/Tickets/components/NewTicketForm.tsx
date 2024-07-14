import React, { useEffect } from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import {
  Button,
  FormGroup,
  FormLabel,
  FormTextarea,
  FileInput,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type NewTicketFormSchema } from '@/types/ticketing';
import SelectInput from '@/components/Common/SelectInput';
import { Subject } from '@/requests/ticket/getDepartments';
import { useRegisterNewTicket } from '@/requests/ticket/registerNewTicket';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useLang } from '@/hooks';
import { useRouter } from 'next/router';

interface Props {
  subjects?: Subject[];
  operation?: 'CW' | 'CD' | 'FW' | 'FD';
  transactionId?: string;
  defaultSubjectId?: number;
  submitCallback?: string;
}

const formSchema = yup.object().shape({
  subjectId: yup.string().required(),
  description: yup.string().required(),
  attachment: yup.mixed().optional(),
});

const NewTicketForm: React.FC<Props> = ({
  subjects,
  operation,
  transactionId,
  defaultSubjectId,
  submitCallback,
}) => {
  const [tickets] = useLang(['tickets']);

  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const methods = useForm<NewTicketFormSchema>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    if (!defaultSubjectId) return;
    setValue('subjectId', defaultSubjectId);
  }, [defaultSubjectId]);

  const { mutateAsync, isPending: isLoading } = useRegisterNewTicket();

  const onSubmitHandler = async (data: NewTicketFormSchema) => {
    try {
      const { subjectId, description, attachment } = data;
      const formData = new FormData();

      formData.append('ticket_department_subject_id', subjectId.toString());
      formData.append('description', description);
      if (transactionId && operation) {
        formData.append('operation', operation);
        formData.append('transaction_id', transactionId);
      }
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const { success, result } = await mutateAsync(formData);
      if (success && result?.ticket_id) {
        if (submitCallback) {
          router.push(submitCallback);
        } else {
          router.push(`tickets/${result.ticket_id}`);
        }

        reset({
          description: '',
          subjectId: undefined,
          attachment: undefined,
        });
      }
    } catch (error) {
      console.log('e: ', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="block items-center justify-start sm:flex-col"
      >
        <div className="w-full ">
          <Controller
            name={'subjectId'}
            render={({ field: { onChange, value } }) => (
              <FormGroup className="mb-6 mt-4 sm:mt-0">
                <FormLabel>{tickets.topic}</FormLabel>
                <SelectInput
                  fullWidth
                  options={
                    subjects?.map(({ id, title }) => {
                      return {
                        value: id,
                        label: title,
                      };
                    }) || []
                  }
                  palceholder={''}
                  selectClassName="h-12"
                  value={value}
                  onChange={onChange}
                  disabled={!subjects?.length || !!defaultSubjectId}
                />
              </FormGroup>
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name={'description'}
            render={({ field: { onChange, value } }) => (
              <FormGroup className="mb-6">
                <FormLabel htmlFor="description">
                  {tickets.ticketMessage}
                </FormLabel>

                <FormTextarea
                  {...register('description')}
                  name="description"
                  placeholder={tickets.describeYourTicket}
                  value={value}
                  onChange={onChange}
                  maxLength={500}
                  counter
                  maxHeight={120}
                />
              </FormGroup>
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name={'attachment'}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid },
            }) => {
              return (
                <FileInput
                  label={tickets.ticketAttachmentPlaceholder}
                  value={value}
                  onChange={onChange}
                  error={invalid}
                  caption={error?.message}
                  icon="Upload-OutLined"
                  iconClassName="[&>*]:fill-blue-500"
                  btnLabel={tickets.selectAttachedFile}
                />
              );
            }}
          />
          {/* <Controller
              name={'attachmentd'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => {
                return (
                  <div>
                    <input type="file" />
                  </div>
                );
              }}
            /> */}
        </div>
        <ModalFooter fullScreen>
          <Button
            size={isDesktop ? 'lg' : 'md'}
            disabled={!isValid}
            isLoading={isLoading}
            fullWidth={!isDesktop}
            className="min-w-[100px] mt-0 md:mt-6"
          >
            {tickets.sendTicket}
          </Button>
        </ModalFooter>
      </form>
    </FormProvider>
  );
};
export default NewTicketForm;
