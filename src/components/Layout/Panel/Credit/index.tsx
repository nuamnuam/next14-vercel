import { Icon } from '@/components/Common';
import Paper from '@/components/Common/Paper';
import { useLang } from '@/hooks';
import { useGlobalStore } from '@/store';
import { toPrice } from '@/utils';
import Link from 'next/link';

const Credit = () => {
  const [global] = useLang(['global']);
  const { userCredit } = useGlobalStore();

  return (
    <Paper classNames="p-2">
      <span className="text-dark-300 ml-2 text-sm">{global.balance}:</span>
      <span className="text-dark-600 ml-4 text-sm">
        {toPrice(userCredit?.balance_available ?? 0)} {global.toman}
      </span>
      <Link href={'/panel/wallet/toman-deposit'}>
        <Icon
          icon="Plus-OutLined"
          className="text-primary-600 cursor-pointer"
          size={18}
        />
      </Link>
    </Paper>
  );
};

export default Credit;
