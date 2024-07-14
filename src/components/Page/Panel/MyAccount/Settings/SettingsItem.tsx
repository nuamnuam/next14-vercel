import { useEffect, useState } from 'react';

import { Switch } from '@/components/Common';

const SettingsItem = (props: any) => {
  const { name, value, itemKey, schema, handleChange } = props;
  const [active, setActive] = useState(value);

  useEffect(() => setActive(value), [value]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(e.target.checked);
    handleChange?.(schema, itemKey, e.target.checked);
  };

  return (
    <div className="flex w-full items-center justify-between p-4 pt-5 pb-5 sm:pt-6 sm:pb-6 sm:pr-10 sm:pl-10">
      <p className="text-sm font-normal leading-6 text-dark-800">{name}</p>
      <Switch checked={active} onChange={handleOnChange} size="medium" />
    </div>
  );
};

export default SettingsItem;
