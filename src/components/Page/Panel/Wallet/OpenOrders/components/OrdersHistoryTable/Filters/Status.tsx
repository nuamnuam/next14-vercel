import { SelectInput } from '@/components/Common';
import { useLang } from '@/hooks';
import { getLang } from '@/utils';
import React, { useState } from 'react';

const [wallet] = getLang(['wallet']);

const Status = () => {
  const [wallet] = useLang(['wallet']);

  const [selected, setSelected] = useState(options[0].value);
  return (
    <SelectInput
      name="status"
      fullWidth
      label={wallet.status}
      options={options}
      value={selected}
      onChange={setSelected}
    />
  );
};

export default Status;

const options = [
  {
    label: wallet.all,
    value: 'all',
  },
  {
    label: wallet.ended,
    value: 'done',
  },
  {
    label: wallet.inProgress,
    value: 'pending',
  },
];
