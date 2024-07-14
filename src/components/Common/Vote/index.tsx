import React, { useCallback, useState } from 'react';
import clsx from 'classnames';

import { useLang } from '@/hooks';

import Icon from '../Icon';
import Button from '../Button';

const VOTE_TYPES = {
  LIKE: 'like',
  DISLIKE: 'dislike',
};

interface Props {
  onVote: (val: string) => void;
}

const Vote: React.FC<Props> = ({ onVote }) => {
  const [global] = useLang(['global']);

  const [selected, setSelected] = useState<string>();

  const handleVote = useCallback(
    (value: string) => {
      setSelected(value);
      onVote(value);
    },
    [onVote],
  );

  return (
    <div className="flex items-center gap-4">
      <Button
        variant={selected === VOTE_TYPES.LIKE ? 'primary' : 'secondary'}
        onClick={() => {
          handleVote(VOTE_TYPES.LIKE);
        }}
        startIcon={
          <Icon
            icon="Like-Filled"
            size={16}
            className={clsx(
              selected === VOTE_TYPES.LIKE
                ? '[&>*]:!fill-white'
                : '[&>*]:!fill-primary-300',
            )}
          />
        }
      >
        {global.yes}
      </Button>
      <Button
        variant={selected === VOTE_TYPES.DISLIKE ? 'primary' : 'secondary'}
        className={clsx(
          selected === VOTE_TYPES.DISLIKE &&
            'bg-danger-500 border-danger-500 hover:bg-danger-600 focus:border-danger-600 focus:bg-danger-600 hover:border-danger-600',
        )}
        onClick={() => {
          handleVote(VOTE_TYPES.DISLIKE);
        }}
        startIcon={
          <Icon
            icon="DisLike-Filled"
            size={16}
            className={clsx(
              '-mb-1',
              selected === VOTE_TYPES.DISLIKE
                ? '[&>*]:!fill-white'
                : '[&>*]:!fill-danger-300',
            )}
          />
        }
      >
        {global.no}
      </Button>
    </div>
  );
};

export default Vote;
