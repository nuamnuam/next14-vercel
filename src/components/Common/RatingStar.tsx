import React, { useMemo, type Dispatch, type SetStateAction } from 'react';
import { Icon } from '@/components/Common';
import clsx from 'classnames';

interface RatingStarProps {
  rating: number;
  totalStars: number;
  onChange?: Dispatch<SetStateAction<string>>;
}

const RatingStar: React.FC<RatingStarProps> = ({
  rating = 0,
  totalStars,
  onChange,
}) => {
  const filledStar = (index: number) => {
    return (
      <Icon
        icon="Star-Filled"
        className={clsx(
          '[&>*]:fill-warning-500',
          typeof onChange === 'function' && 'cursor-pointer',
        )}
        size={24}
        onClick={() => onChange?.(`${index + 1}`)}
      />
    );
  };

  const outlinedStar = (index: number) => {
    return (
      <Icon
        icon="Star-OutLined"
        className={clsx(
          '[&>*]:fill-dark-500',
          typeof onChange === 'function' && 'cursor-pointer',
        )}
        size={24}
        onClick={() => onChange?.(`${index + 1}`)}
      />
    );
  };

  const halfStar = (index: number) => {
    return (
      <div className="flex items-center justify-center">
        <div className="w-3 overflow-hidden">
          <Icon
            icon="Star-OutLined"
            className={clsx(
              '[&>*]:fill-dark-500',
              typeof onChange === 'function' && 'cursor-pointer',
            )}
            size={24}
            onClick={() => onChange?.(`${index + 1}`)}
          />
        </div>
        <div className="w-3 overflow-hidden dir-ltr">
          <Icon
            icon="Star-Filled"
            className={clsx(
              '[&>*]:fill-warning-500',
              typeof onChange === 'function' && 'cursor-pointer',
            )}
            size={24}
            onClick={() => onChange?.(`${index + 1}`)}
          />
        </div>
      </div>
    );
  };

  const isFloat = useMemo(() => {
    return rating % 1 !== 0;
  }, [rating]);

  const countOfFills = useMemo(() => {
    return parseInt(rating.toString());
  }, [rating]);

  const countOfOutlines = useMemo(() => {
    return totalStars - (countOfFills + (isFloat ? 1 : 0));
  }, [totalStars, countOfFills, isFloat]);

  return (
    <div className="flex flex-row-reverse items-center gap-x-2">
      {Array(countOfFills)
        .fill('')
        .map((_, fIndex) => filledStar(fIndex))}
      {isFloat && halfStar(countOfFills + 1)}
      {Array(countOfOutlines)
        .fill('')
        .map((_, oIndex) =>
          outlinedStar(countOfFills + (isFloat ? 1 : 0) + oIndex),
        )}
    </div>
  );
};

export default RatingStar;
