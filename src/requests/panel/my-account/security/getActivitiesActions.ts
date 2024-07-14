import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type IActivity } from '@/types/myAccount';

import { SECURITY } from '../../../endpoints';

export type SuccussGetActivitiesActionsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IActivity[];
};

export type ErrorGetActivitiesActionsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getGetActivitiesActions() {
  return Request.get<SuccussGetActivitiesActionsResponse>(
    SECURITY.GET_ACTIVITIES_ACTIONS,
  );
}

export function useGetActivitiesActionsMutation() {
  return useMutation<
    SuccussGetActivitiesActionsResponse,
    ErrorGetActivitiesActionsResponse
  >({
    mutationFn: async () => await getGetActivitiesActions()(),
    mutationKey: ['get-GetActivitiesActions'],
  });
}
