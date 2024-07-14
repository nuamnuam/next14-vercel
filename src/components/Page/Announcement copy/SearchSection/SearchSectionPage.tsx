import React from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button, FormGroup, FormInput } from '@/components/Common';
import SearchIcon from '@/components/Icons/SearchIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { type SearchModel } from '@/types/announcement';
import { useLang } from '@/hooks';

const searchSchema = yup.object().shape({
  search: yup.string(),
});

const SearchSectionPage: React.FC = () => {
  const [announcement, global] = useLang(['announcement', 'global']);

  const methods = useForm<SearchModel>({
    mode: 'onChange',
    resolver: yupResolver(searchSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = methods;
  const onSubmitHandler = async (data: SearchModel) => {};
  return (
    <div>
      <div className="flex w-full flex-col items-center">
        <h3 className="mt-8 w-full text-center text-xs font-bold sm:mt-0 sm:text-right">
          {announcement.whatIsArzinja}
        </h3>
        <h1 className="mt-[.35rem] w-full text-center text-[24px]	 font-black sm:text-right sm:font-black">
          {announcement.announcement}{' '}
        </h1>
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="bloc mt-8 items-center justify-start sm:flex"
        >
          <div className="ml-4 w-full">
            <Controller
              name={'search'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <FormGroup className="mb-4">
                  <FormInput
                    {...register('search')}
                    name="search"
                    placeholder={announcement.searchAnnouncement}
                    value={value}
                    onChange={onChange}
                    hasClear
                    error={invalid}
                    caption={error?.message}
                    rightIcon={<SearchIcon />}
                  />
                </FormGroup>
              )}
            />
          </div>
          <Button
            size="lg"
            className="mb-4 w-full sm:w-fit"
            disabled={!isValid}
            //   isLoading={loginLoading}
          >
            {global.search}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default SearchSectionPage;
