import React, { HTMLProps, PropsWithChildren } from 'react';
import NextLink, { LinkProps } from 'next/link';
import classNames from 'classnames';

type LinkWeight = 'regular' | 'medium';
type LinkVariant = 'gray' | 'green';
type LinkShape = 'neutral' | 'underline' | 'box';

interface Props extends HTMLProps<HTMLAnchorElement> {
  weight: LinkWeight;
  variant: LinkVariant;
  shape: LinkShape;
}

const LinkButton = ({
  as,
  children,
  href,
  replace,
  scroll,
  shallow,
  passHref,
  weight,
  variant,
  shape,
  ...props
}: PropsWithChildren<LinkProps & Props>) => {
  return (
    <NextLink
      as={as}
      href={href}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
    >
      <a className={getLinkButtonClassNames(variant, weight, shape)} {...props}>
        {children}
      </a>
    </NextLink>
  );
};

export default LinkButton;

function getLinkButtonClassNames(
  variant: LinkVariant,
  weight: LinkWeight,
  shape: LinkShape,
) {
  return classNames(
    'text-base',
    variant === 'green'
      ? 'text-primary-600 border-primary-300'
      : 'text-dark-900 border-dark-500',
    weight === 'regular' ? 'font-normal' : 'font-medium',
    shape === 'underline' ? 'border-b-2' : shape === 'box' ? 'border' : '',
    shape === 'underline' && variant === 'green'
      ? 'border-primary-200'
      : 'border-dark-400',
  );
}
