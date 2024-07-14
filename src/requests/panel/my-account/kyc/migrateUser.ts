import { useMutation } from '@tanstack/react-query';
import { Request } from '@/utils';
import { KYC } from '../../../endpoints';

export type MigrateUserPayload = {
  first_name: string;
  last_name: string;
  birthday: string;
  national_code: string;
};

export type SuccussMigrateUserResponse = {
  result: [];
  message: string;
  success: boolean;
  code: number;
};

export type ErrorMigrateUserResponse = {
  result: {};
  message: string;
  success: boolean;
  code: number;
};

function migrateUser(data: MigrateUserPayload) {
  return Request.post<SuccussMigrateUserResponse>(KYC.MIGRATE_USER, data);
}

export function useMigrateUser() {
  return useMutation<
    SuccussMigrateUserResponse,
    ErrorMigrateUserResponse,
    MigrateUserPayload
  >({
    mutationFn: async (data) => await migrateUser(data)(),
    mutationKey: ['migrate-user'],
  });
}
