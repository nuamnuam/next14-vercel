import * as React from 'react';
import { type SVGProps } from 'react';

interface CustomProps {}

const CoinsIcon = ({ ...rest }: SVGProps<SVGSVGElement> & CustomProps) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <g clipPath="url(#clip0_5457_32192)">
      <path
        d="M15.1816 9.875C15.1816 10.5781 14.623 11.2266 13.6816 11.75C12.3145 12.5078 10.1348 13 7.68164 13C5.35352 13 3.26992 12.5586 1.89414 11.8633C1.82109 11.8242 1.75 11.7539 1.68125 11.75C0.739453 11.2266 0.181641 10.5781 0.181641 9.875C0.181641 8.14844 3.53945 6.75 7.68164 6.75C11.8223 6.75 15.1816 8.14844 15.1816 9.875ZM7.68164 14.25C9.87695 14.25 11.9238 13.8828 13.4668 13.2383C14.1035 12.9727 14.6934 12.6445 15.1816 12.2422V13.625C15.1816 14.3281 14.623 14.9766 13.6816 15.5C13.6113 15.5039 13.541 15.5742 13.4707 15.6133C12.0918 16.3086 10.0098 16.75 7.68164 16.75C5.22852 16.75 3.04922 16.2578 1.68125 15.5C0.739453 14.9766 0.181641 14.3281 0.181641 13.625V12.2422C0.667969 12.6445 1.26055 12.9727 1.89766 13.2383C3.44102 13.8828 5.48633 14.25 7.68164 14.25ZM15.1816 15.9922V17.375C15.1816 19.1016 11.8223 20.5 7.68164 20.5C3.53945 20.5 0.181641 19.1016 0.181641 17.375V15.9922C0.667969 16.3945 1.26055 16.7227 1.89766 16.9883C3.44102 17.6328 5.48633 18 7.68164 18C9.87695 18 11.9238 17.6328 13.4668 16.9883C14.1035 16.7227 14.6934 16.3945 15.1816 15.9922Z"
        fill="#B6B9CC"
      />
      <path
        opacity="0.4"
        d="M20.1816 3.625C20.1816 4.32852 19.623 4.97656 18.6816 5.5C17.5449 6.12891 15.8535 6.57422 13.9043 6.70703C13.7637 6.64062 13.6152 6.57422 13.4668 6.51172C11.9238 5.86719 9.87695 5.5 7.68164 5.5C7.35742 5.5 7.04102 5.50781 6.72461 5.52344C6.70898 5.51563 6.69727 5.50781 6.68164 5.5C5.74023 4.97656 5.18164 4.32852 5.18164 3.625C5.18164 1.89922 8.50586 0.5 12.6816 0.5C16.8223 0.5 20.1816 1.89922 20.1816 3.625ZM16.4316 11.3633C17.1387 11.168 17.8574 10.9922 18.4668 10.7383C19.1035 10.4727 19.6934 10.1445 20.1816 9.74219V11.125C20.1816 12.2813 18.6738 13.293 16.4316 13.832V11.3633ZM16.4316 9.875C16.4316 9.01953 16.0176 8.31641 15.4902 7.78906C16.5957 7.61719 17.6074 7.34375 18.4668 6.98828C19.1035 6.72266 19.6934 6.39453 20.1816 5.99219V7.375C20.1816 8.07812 19.623 8.72656 18.6816 9.25C18.6113 9.25391 18.541 9.32422 18.4707 9.36328C17.9004 9.64844 17.209 9.89453 16.4316 10.082V9.875Z"
        fill="#B6B9CC"
      />
    </g>
    <defs>
      <clipPath id="clip0_5457_32192">
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

export default CoinsIcon;
