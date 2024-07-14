import * as React from 'react';
import { type SVGProps } from 'react';

interface CustomProps {}

const HelpIcon = ({ ...rest }: SVGProps<SVGSVGElement> & CustomProps) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2243_1847)">
      <path
        d="M0.181641 9.06252V17.3633C0.181641 17.9199 0.635547 18.3887 1.2168 18.418C3.12383 18.5156 7.2207 18.9102 9.55664 20.4961V10.0781C7.26758 8.52736 3.30625 8.10939 1.34727 8.00002C0.7125 7.96486 0.181641 8.45314 0.181641 9.06252ZM19.0176 8.00002C17.0609 8.11127 13.1074 8.52619 10.8496 10.0738C10.8105 10.0781 10.8066 10.082 10.8066 10.0899V20.5C13.152 18.9223 17.2402 18.5172 19.1465 18.4188C19.7285 18.3867 20.1816 17.918 20.1816 17.3633V9.06252C20.1816 8.45314 19.6504 7.96486 19.0176 8.00002Z"
        fill="#E8B100"
      />
      <path
        opacity="0.4"
        d="M13.9316 4.25C13.9316 2.17969 12.252 0.5 10.1816 0.5C8.11133 0.5 6.43164 2.17969 6.43164 4.25C6.43164 6.32031 8.11133 8 10.1816 8C12.252 8 13.9316 6.32031 13.9316 4.25Z"
        fill="#E8B100"
      />
    </g>
    <defs>
      <clipPath id="clip0_2243_1847">
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

export default HelpIcon;
