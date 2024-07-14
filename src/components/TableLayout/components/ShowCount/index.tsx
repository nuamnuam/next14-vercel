import SelectInput from '@/components/Common/SelectInput';
import { useLang } from '@/hooks';

interface Props {
  onChange: (val: string | number) => void;
  value: string | number;
  classNames?: string;
  customItems?: Array<{ label: string; value: number }>;
}

const TableShowCount: React.FC<Props> = ({
  onChange,
  value,
  classNames,
  customItems = undefined,
}) => {
  const [global] = useLang(['global']);

  const items = [
    {
      value: 10,
      label: global.show10Items,
    },
    {
      value: 50,
      label: global.show50Items,
    },
    {
      value: 100,
      label: global.show100Items,
    },
  ];

  return (
    <SelectInput
      options={customItems || items}
      onChange={onChange}
      fullWidth
      value={value}
      classNames={classNames}
    />
  );
};

export default TableShowCount;
