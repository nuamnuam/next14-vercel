import * as React from 'react';
import { SVGProps } from 'react';
const SvgConvert = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#Convert_svg__a)">
      <path fill="#fff" fillOpacity={0.01} d="M.11 0h24v24h-24z" />
      <g clipPath="url(#Convert_svg__b)">
        <path
          d="M8.36 5.25h9.929L15.38 7.674a.75.75 0 0 0 .96 1.152l4.5-3.75c.172-.14.27-.356.27-.618a.692.692 0 0 0-.269-.576l-4.5-3.75a.751.751 0 0 0-.96 1.152l2.908 2.466H8.361C3.81 3.75.11 7.411.11 11.958c0 .454.335.792.75.792.414 0 .75-.338.75-.75a6.757 6.757 0 0 1 6.75-6.75Zm15 6a.75.75 0 0 0-.75.75c0 3.722-3.027 6.75-6.707 6.75h-9.97l2.908-2.424a.75.75 0 0 0-.958-1.152l-4.5 3.75a.73.73 0 0 0-.272.534c0 .183.099.433.27.576l4.5 3.75a.6.6 0 0 0 .438.216.751.751 0 0 0 .48-1.326L5.934 20.25h9.928c4.55 0 8.25-3.702 8.25-8.25a.752.752 0 0 0-.75-.75Z"
          fill="#B6B9CC"
        />
      </g>
    </g>
    <defs>
      <clipPath id="Convert_svg__a">
        <path fill="#fff" transform="translate(.11)" d="M0 0h24v24H0z" />
      </clipPath>
      <clipPath id="Convert_svg__b">
        <path fill="#fff" transform="translate(.11)" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgConvert;
