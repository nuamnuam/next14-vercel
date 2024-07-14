import React from 'react';
import classNames from 'classnames';
import { FormControl, FormControlLabel, RadioGroup } from '@mui/material';

import Paper from '@/components/Common/Paper';
import { Radio } from '@/components/Common';

import List from '../../Dashboard/List/List';

interface IProps {
  title?: string;
  items?: any;
  className?: string;
  type?: 'RADIO' | 'SWITCH';
  defaultValue?: string;
  schema?: string | null;
  isLoading?: boolean;
  itemComponent?: (props: any) => JSX.Element | React.ReactElement<any, any>;
  handleChange?: (
    schema: string | null,
    key: string,
    value: string | boolean,
  ) => void;
}

const SettingsCard = ({
  items,
  title,
  className,
  type = 'SWITCH',
  defaultValue,
  schema = null,
  isLoading = false,
  itemComponent,
  handleChange,
}: IProps) => {
  return (
    <Paper
      classNames={classNames('w-full flex flex-col', className, {
        'opacity-50 pointer-events-none cursor-not-allowed': isLoading,
      })}
    >
      <div className="flex w-full items-center justify-start p-4 pt-7 pl-7 sm:pl-10 sm:pr-6 sm:pt-7 sm:pb-7">
        <p className="text-base font-normal leading-6 text-dark-800	">{title}</p>
      </div>
      <div className="h-5 w-full border-t border-dark-100 bg-dark-50 opacity-30 sm:h-7" />
      {type === 'SWITCH' ? (
        <List
          items={items}
          ItemComponent={itemComponent!}
          hasBottomBorder
          schema={schema}
          handleChange={handleChange}
        />
      ) : (
        <>
          {items.map(
            (
              {
                name,
                value,
                key,
              }: { name: string; value: string; key: string },
              idx: number,
            ) => (
              <>
                <FormControl className="w-full">
                  <RadioGroup
                    value={defaultValue}
                    onChange={(e) =>
                      handleChange?.(schema, key, e.target.value)
                    }
                  >
                    <div className="w-full flex justify-between items-center px-8 py-5 sm:py-6 sm:px-10">
                      <div className="flex flex-col">
                        <p className="text-sm font-normal leading-6 text-dark-800">
                          {name}
                        </p>
                      </div>
                      <FormControlLabel
                        value={value}
                        control={<Radio value={value} />}
                        className="flex flex-col"
                        label=""
                      />
                    </div>
                  </RadioGroup>
                </FormControl>
                {idx !== items.length - 1 ? (
                  <hr className="border-dark-100 bg-dark-50 w-full opacity-20" />
                ) : null}
              </>
            ),
          )}
        </>
      )}
    </Paper>
  );
};

export default SettingsCard;
