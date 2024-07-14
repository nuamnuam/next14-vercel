import React from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import {
  Alert,
  Button,
  FormGroup,
  FormLabel,
  FormTextarea,
  RatingStar,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type ReferenceFormSchema } from '@/types/ticketing';
import { useSendReview } from '@/requests/ticket/sendReview';
import { useGetSingleTicketDataQuery } from '@/requests/ticket/getSingleTicketById';
import { useRouter } from 'next/router';
import { useModal } from '@/hooks/useModal';
import { referenceModalName } from './TicketDetailsPageContent';
import { useLang } from '@/hooks';

interface Props {
  ticketId: string;
}

const formSchema = yup.object().shape({
  rating: yup.number().default(1),
  feedback: yup.string().required().min(5).max(500),
});

const ReferenceForm: React.FC<Props> = ({ ticketId }) => {
  const [tickets] = useLang(['tickets']);

  const { closeSyncModal } = useModal(referenceModalName);

  const { mutateAsync, isPending: isLoading } = useSendReview();
  const router = useRouter();

  const { refetch } = useGetSingleTicketDataQuery(
    Number(router.query.id),
    router.isReady,
  );

  const methods = useForm<ReferenceFormSchema>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;
  const onSubmitHandler = async ({ feedback, rating }: ReferenceFormSchema) => {
    const body = {
      ticket_id: Number(ticketId),
      score: rating || 1,
      review: feedback,
    };

    const { success } = await mutateAsync(body);
    if (success) {
      refetch();
      closeSyncModal();
      return reset({
        feedback: '',
        rating: 1,
      });
    }
  };

  return (
    <>
      <div>
        <Alert message={tickets.ticketNote} variant="info" hasIcon={false} />
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="block items-center justify-start sm:flex-col"
        >
          <div className="flex w-full flex-wrap gap-x-11 mt-6">
            <div className="w-full">
              <Controller
                name={'rating'}
                render={({ field: { onChange, value } }) => (
                  <FormGroup className="mb-4 [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div]:w-full">
                    <FormLabel
                      htmlFor="rating"
                      className="m-0 text-sm font-medium text-dark-600"
                    >
                      {tickets.rateTicketing}
                    </FormLabel>

                    <RatingStar
                      rating={value || 1}
                      totalStars={5}
                      onChange={onChange}
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                name={'feedback'}
                render={({ field: { onChange, value } }) => (
                  <FormGroup className="mb-4">
                    <FormLabel htmlFor="feedback">
                      {tickets.yourfeedbackToTicketing}
                    </FormLabel>

                    <FormTextarea
                      {...register('feedback')}
                      name="feedback"
                      placeholder={tickets.writeYourFeedback}
                      value={value}
                      onChange={onChange}
                      maxLength={500}
                      counter
                    />
                  </FormGroup>
                )}
              />
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={!isValid}
            isLoading={isLoading}
          >
            {tickets.confirmAndSend}
          </Button>
        </form>
      </FormProvider>
    </>
  );
};
export default ReferenceForm;
