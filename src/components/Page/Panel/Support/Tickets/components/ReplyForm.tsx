import React, { useRef } from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import clsx from 'classnames';

import { useBreakpoint, useLang } from '@/hooks';
import {
  Button,
  FormGroup,
  FormTextarea,
  Icon,
  FileInput,
  FormLabel,
  IconButton,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAnswerToTicket } from '@/requests/ticket/registerNewTicket';
import { type ReplyTicketFormSchema } from '@/types/ticketing';
import { toPersianDigits } from '@/utils';
import { useGetSingleTicketDataQuery } from '@/requests/ticket/getSingleTicketById';
import Tooltip from '@mui/material/Tooltip';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useModal } from '@/hooks/useModal';
import { replyModalName } from './TicketDetailsPageContent';

interface Props {
  ticketId: string;
}

const formSchema = yup.object().shape({
  description: yup.string().required(),
  attachment: yup.mixed().optional(),
});

const ReplyForm: React.FC<Props> = ({ ticketId }) => {
  const [tickets] = useLang(['tickets']);

  const { isDesktop } = useBreakpoint();
  const { closeSyncModal: closeReplyModal } = useModal(replyModalName);
  const { refetch: refetchTicketDetails } = useGetSingleTicketDataQuery(
    Number(ticketId),
    false,
  );

  const { isPending: isLoading, mutateAsync: mutateAnswer } =
    useAnswerToTicket();

  const methods = useForm<ReplyTicketFormSchema>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  const onSubmitAnswer = async (data: ReplyTicketFormSchema) => {
    try {
      const formData = new FormData();
      const { attachment, description } = data;
      formData.append('ticket_id', ticketId);
      formData.append('description', description);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const { success } = await mutateAnswer(formData);
      if (success) {
        refetchTicketDetails();
        closeReplyModal();
      }

      reset({
        description: '',
        attachment: undefined,
      });
    } catch (error) {
      console.log('e: ', error);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="flex md:flex-row flex-col gap-x-4 md:px-10">
      <h3 className="hidden md:block text-dark-800 whitespace-pre pt-3">
        {tickets.doReply}
      </h3>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitAnswer)}
          className="block items-center justify-start sm:flex-col w-full"
        >
          <div className="flex w-full flex-wrap gap-x-11">
            <div className="w-full">
              <Controller
                name={'description'}
                render={({ field: { onChange, value } }) => (
                  <FormGroup className="mb-4 w-full">
                    <FormLabel htmlFor="feedback" className="md:hidden">
                      {tickets.reply}
                    </FormLabel>
                    <FormTextarea
                      {...register('description')}
                      name="description"
                      placeholder={tickets.enterYourReply}
                      value={value}
                      onChange={onChange}
                      className="mt-2 md:mt-0"
                      rows={isDesktop ? 1 : 5}
                      counter
                      maxLength={500}
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
                }) => (
                  <FormGroup className={clsx('w-full')}>
                    {!isDesktop ? (
                      <>
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
                        <ModalFooter>
                          <Button
                            size="lg"
                            fullWidth
                            disabled={!isValid}
                            isLoading={isLoading}
                          >
                            {tickets.sendReply}
                          </Button>
                        </ModalFooter>
                      </>
                    ) : (
                      <div className="w-full flex gap-4">
                        <input
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            e.preventDefault();
                            onChange(e?.target?.files?.[0]);
                          }}
                          ref={inputRef}
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                        />
                        {value != null && (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex justify-start items-center gap-x-2">
                              <Icon
                                icon={'PaperClip-OutLined'}
                                className="[&>*]:fill-primary-600"
                                size={15}
                              />
                              <p className="text-xs text-primary-600">
                                {value.name}
                              </p>
                            </div>
                            <div className="flex justify-end items-center gap-x-2">
                              <Icon
                                icon={'PaperClip  -OutLined'}
                                className="[&>*]:fill-primary-600"
                                size={15}
                              />
                              <p className="text-dark-300 text-xs" dir="ltr">
                                (
                                {toPersianDigits(Math.floor(value.size / 1000))}
                                ) kb
                              </p>
                              <IconButton
                                onClick={() => onChange(undefined)}
                                size="sm"
                                className="mr-2 border-dark-400 text-dark-400 rounded-md"
                                icon={
                                  <Icon icon={'Trash-OutLined'} size={12} />
                                }
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end gap-4 mr-auto">
                          <Tooltip
                            title={
                              <div className="flex gap-2">
                                <Icon
                                  icon="InfoCircle-OutLined"
                                  className="text-blue-500"
                                  size={16}
                                />
                                <span className="text-dark-600 !text-sm leading-7">
                                  {tickets.maxFileSize}
                                  (PNG,JPG,ZIP)
                                </span>
                              </div>
                            }
                            placement="top"
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: '#fff',
                                  padding: '20px 14px',
                                  width: '190px',
                                  borderRadius: '8px',
                                  boxShadow:
                                    '0px 0px 30px 0px rgba(7, 16, 58, 0.09)',
                                },
                              },
                              arrow: {
                                sx: {
                                  '&::before': {
                                    color: '#fff',
                                  },
                                },
                              },
                            }}
                          >
                            <div>
                              <IconButton
                                icon={
                                  <Icon icon="PaperClip-OutLined" size={20} />
                                }
                                size="lg"
                                onClick={() => inputRef.current?.click()}
                                className="border-dark-200"
                              />
                            </div>
                          </Tooltip>
                          <Button
                            size="md"
                            disabled={!isValid}
                            onClick={handleSubmit(onSubmitAnswer)}
                          >
                            {tickets.sendReply}
                          </Button>
                        </div>
                      </div>
                    )}
                  </FormGroup>
                )}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
export default ReplyForm;
