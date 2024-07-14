import type { Attributes } from '@/requests/home/home';
import type { Blog } from '@/types/blog';
import { IAdvanceMarketpair } from '@/types/wallet';

export type HomeProps = {
  data?: Attributes;
  blogs?: Blog[];
  isLoading?: boolean;
  announcements?: any;
  currencies?: Array<Record<string, IAdvanceMarketpair>>;
};
