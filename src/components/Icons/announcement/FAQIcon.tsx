import * as React from 'react';
import { type SVGProps } from 'react';

interface CustomProps {}

const FAQIcon = ({ ...rest }: SVGProps<SVGSVGElement> & CustomProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
  >
    <g clipPath="url(#clip0_3687_1438)">
      <path
        d="M13.0781 3.08984C13.832 3.33594 14.375 4.04297 14.375 4.875V5.8125C14.375 6.33203 13.957 6.75 13.4375 6.75H10H6.5625C6.04297 6.75 5.625 6.33203 5.625 5.8125V4.875C5.625 4.04297 6.16797 3.33594 6.92187 3.08984C7.17187 1.62109 8.45703 0.5 10 0.5C11.543 0.5 12.8281 1.62109 13.0781 3.08984ZM10.9375 3.625C10.9375 3.37636 10.8387 3.1379 10.6629 2.96209C10.4871 2.78627 10.2486 2.6875 10 2.6875C9.75136 2.6875 9.5129 2.78627 9.33709 2.96209C9.16127 3.1379 9.0625 3.37636 9.0625 3.625C9.0625 3.87364 9.16127 4.1121 9.33709 4.28791C9.5129 4.46373 9.75136 4.5625 10 4.5625C10.2486 4.5625 10.4871 4.46373 10.6629 4.28791C10.8387 4.1121 10.9375 3.87364 10.9375 3.625ZM6.63281 10.082C6.94141 9.21094 7.76953 8.625 8.69531 8.625H10.9727C12.3359 8.625 13.4375 9.73047 13.4375 11.0898C13.4375 11.9727 12.9648 12.7891 12.1992 13.2305L10.9375 13.9531C10.9297 14.4609 10.5117 14.875 10 14.875C9.48047 14.875 9.0625 14.457 9.0625 13.9375V13.4102C9.0625 13.0742 9.24219 12.7656 9.53516 12.5977L11.2656 11.6055C11.4492 11.5 11.5625 11.3047 11.5625 11.0938C11.5625 10.7656 11.2969 10.5039 10.9727 10.5039H8.69531C8.5625 10.5039 8.44531 10.5859 8.40234 10.7109L8.38672 10.7578C8.21484 11.2461 7.67578 11.5 7.19141 11.3281C6.70703 11.1562 6.44922 10.6172 6.62109 10.1328L6.63672 10.0859L6.63281 10.082ZM8.75 17.375C8.75 17.0435 8.8817 16.7255 9.11612 16.4911C9.35054 16.2567 9.66848 16.125 10 16.125C10.3315 16.125 10.6495 16.2567 10.8839 16.4911C11.1183 16.7255 11.25 17.0435 11.25 17.375C11.25 17.7065 11.1183 18.0245 10.8839 18.2589C10.6495 18.4933 10.3315 18.625 10 18.625C9.66848 18.625 9.35054 18.4933 9.11612 18.2589C8.8817 18.0245 8.75 17.7065 8.75 17.375Z"
        fill="#028BDC"
      />
      <path
        opacity="0.4"
        d="M13.0781 3.08984C13.832 3.33594 14.375 4.04297 14.375 4.875V5.8125C14.375 6.33203 13.957 6.75 13.4375 6.75H10H6.5625C6.04297 6.75 5.625 6.33203 5.625 5.8125V4.875C5.625 4.04297 6.16797 3.33594 6.92188 3.08984C6.92578 3.05859 6.93359 3.02734 6.9375 3H5C3.62109 3 2.5 4.12109 2.5 5.5V18C2.5 19.3789 3.62109 20.5 5 20.5H15C16.3789 20.5 17.5 19.3789 17.5 18V5.5C17.5 4.12109 16.3789 3 15 3H13.0625C13.0703 3.03125 13.0742 3.0625 13.0781 3.08984ZM6.63281 10.0781C6.94141 9.20703 7.76953 8.62109 8.69531 8.62109H10.9727C12.3359 8.62109 13.4375 9.72656 13.4375 11.0859C13.4375 11.9688 12.9648 12.7852 12.1992 13.2266L10.9375 13.9531C10.9297 14.4609 10.5117 14.875 10 14.875C9.48047 14.875 9.0625 14.457 9.0625 13.9375V13.4102C9.0625 13.0742 9.24219 12.7656 9.53516 12.5977L11.2656 11.6055C11.4492 11.5 11.5625 11.3047 11.5625 11.0938C11.5625 10.7656 11.2969 10.5039 10.9727 10.5039H8.69531C8.5625 10.5039 8.44531 10.5859 8.40234 10.7109L8.38672 10.7578C8.21484 11.2461 7.67578 11.5 7.19141 11.3281C6.70703 11.1562 6.44922 10.6172 6.62109 10.1328L6.63672 10.0859L6.63281 10.0781ZM8.75 17.375C8.75 17.0435 8.8817 16.7255 9.11612 16.4911C9.35054 16.2567 9.66848 16.125 10 16.125C10.3315 16.125 10.6495 16.2567 10.8839 16.4911C11.1183 16.7255 11.25 17.0435 11.25 17.375C11.25 17.7065 11.1183 18.0245 10.8839 18.2589C10.6495 18.4933 10.3315 18.625 10 18.625C9.66848 18.625 9.35054 18.4933 9.11612 18.2589C8.8817 18.0245 8.75 17.7065 8.75 17.375Z"
        fill="#028BDC"
      />
    </g>
    <defs>
      <clipPath id="clip0_3687_1438">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default FAQIcon;
