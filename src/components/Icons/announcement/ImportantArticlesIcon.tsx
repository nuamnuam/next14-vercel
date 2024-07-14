import * as React from 'react';
import { type SVGProps } from 'react';

interface CustomProps {}

const ImportantArticlesIcon = ({
  ...rest
}: SVGProps<SVGSVGElement> & CustomProps) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <g clipPath="url(#clip0_5457_32199)">
      <path
        d="M16.0146 0.5H3.51465C2.13379 0.5 1.01465 1.61914 1.01465 3V5.5H18.5146V3C18.5146 1.61914 17.3936 0.5 16.0146 0.5ZM9.13965 16.125H5.38965C5.0459 16.125 4.76465 16.4062 4.76465 16.75C4.76465 17.0952 5.04449 17.375 5.38965 17.375H9.13965C9.48481 17.375 9.76465 17.0952 9.76465 16.75C9.76465 16.4062 9.4834 16.125 9.13965 16.125ZM14.1396 8.625H5.38965C5.0459 8.625 4.76465 8.90625 4.76465 9.25C4.76465 9.59516 5.04449 9.875 5.38965 9.875H14.1396C14.4834 9.875 14.7646 9.59375 14.7646 9.25C14.7646 8.90625 14.4834 8.625 14.1396 8.625ZM14.1396 12.375H5.38965C5.0459 12.375 4.76465 12.6562 4.76465 13C4.76465 13.3452 5.04449 13.625 5.38965 13.625H14.1396C14.4848 13.625 14.7646 13.3452 14.7646 13C14.7646 12.6562 14.4834 12.375 14.1396 12.375Z"
        fill="#B6B9CC"
      />
      <path
        opacity="0.4"
        d="M1.01465 5.5V18C1.01465 19.3809 2.13379 20.5 3.51465 20.5H16.0146C17.3955 20.5 18.5146 19.3809 18.5146 18V5.5H1.01465ZM9.13965 17.375H5.38965C5.0459 17.375 4.76465 17.0938 4.76465 16.75C4.76465 16.4048 5.04449 16.125 5.38965 16.125H9.13965C9.48481 16.125 9.76465 16.4048 9.76465 16.75C9.76465 17.0938 9.4834 17.375 9.13965 17.375ZM14.1396 13.625H5.38965C5.0459 13.625 4.76465 13.3438 4.76465 13C4.76465 12.6548 5.04449 12.375 5.38965 12.375H14.1396C14.4848 12.375 14.7646 12.6548 14.7646 13C14.7646 13.3438 14.4834 13.625 14.1396 13.625ZM14.1396 9.875H5.38965C5.0459 9.875 4.76465 9.59375 4.76465 9.25C4.76465 8.90477 5.04449 8.625 5.38965 8.625H14.1396C14.4834 8.625 14.7646 8.90625 14.7646 9.25C14.7646 9.59375 14.4834 9.875 14.1396 9.875Z"
        fill="#B6B9CC"
      />
    </g>
    <defs>
      <clipPath id="clip0_5457_32199">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0.181641 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default ImportantArticlesIcon;
