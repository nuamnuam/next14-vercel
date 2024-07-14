import * as React from 'react';
import { type SVGProps } from 'react';

const LeftArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_5457_13444)">
      <path
        d="M14.7599 18.2489C14.4404 18.5837 13.9224 18.5837 13.6028 18.2489L8.69374 13.1061C8.384 12.7816 8.37316 12.2591 8.66916 11.9208L13.1692 6.77796C13.4745 6.429 13.9921 6.40542 14.3252 6.7253C14.6582 7.04518 14.6807 7.58738 14.3754 7.93634L10.4048 12.4742L14.7599 17.0368C15.0794 17.3715 15.0794 17.9142 14.7599 18.2489Z"
        fill="#686D87"
      />
    </g>
    <defs>
      <clipPath id="clip0_5457_13444">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="translate(24 0.5) rotate(90)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default LeftArrowIcon;
