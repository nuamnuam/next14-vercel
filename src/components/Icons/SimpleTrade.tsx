import * as React from 'react';
import { SVGProps } from 'react';
const SvgSimpleTrade = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#SimpleTrade_svg__a)">
      <path fill="#fff" fillOpacity={0.01} d="M.11 0h24v24h-24z" />
      <g clipPath="url(#SimpleTrade_svg__b)" fill="#B6B9CC">
        <path d="M18.275 5.24A9.004 9.004 0 0 0 2.6 8.923a.748.748 0 1 1-1.458-.343C2.234 3.945 6.397.5 11.361.5c3.244 0 6.14 1.472 8.067 3.778l1.683 1.983V4.5c0-.412.337-.75.75-.75.412 0 .75.338.75.75V8c0 .412-.338.75-.75.75h-3.5a.752.752 0 0 1-.75-.75c0-.412.337-.75.75-.75h1.62L18.28 5.244l-.005-.005ZM.86 20.25a.752.752 0 0 1-.75-.75V16c0-.412.337-.75.75-.75h3.5c.412 0 .75.338.75.75 0 .413-.338.75-.75.75H2.74l1.701 2.006.005.005a9.004 9.004 0 0 0 15.675-3.684.753.753 0 0 1 .904-.558.748.748 0 0 1 .558.9c-1.097 4.636-5.26 8.081-10.223 8.081-3.244 0-6.14-1.472-8.067-3.778L1.61 17.739V19.5c0 .413-.338.75-.75.75Z" />
        <path d="M13.69 7.784a.562.562 0 0 0-.887-.645l-4.5 3.937a.563.563 0 0 0 .371.986h1.96l-1.352 3.154a.562.562 0 0 0 .888.645l4.5-3.937a.563.563 0 0 0-.371-.985h-1.96l1.352-3.155Z" />
      </g>
    </g>
    <defs>
      <clipPath id="SimpleTrade_svg__a">
        <path fill="#fff" transform="translate(.11)" d="M0 0h24v24H0z" />
      </clipPath>
      <clipPath id="SimpleTrade_svg__b">
        <path fill="#fff" transform="translate(.11)" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSimpleTrade;
