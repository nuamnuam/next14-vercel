import React from 'react';

const Spinner: React.FC<
  React.SVGProps<SVGSVGElement> & { type?: 'primary' | 'secondary' }
> = ({ width = 30, height = 30, type = 'primary', ...props }) => {
  if (type === 'secondary') {
    return (
      <svg
        {...props}
        width="27"
        height="9"
        viewBox="0 0 120 30"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <circle cx="15" cy="15" r="15">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="0s"
            dur="0.8s"
            values="15;9;15"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="1"
            to="1"
            begin="0s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="60" cy="15" r="9" fillOpacity="0.3">
          <animate
            attributeName="r"
            from="9"
            to="9"
            begin="0s"
            dur="0.8s"
            values="9;15;9"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="0.5"
            to="0.5"
            begin="0s"
            dur="0.8s"
            values=".5;1;.5"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="105" cy="15" r="15">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="0s"
            dur="0.8s"
            values="15;9;15"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="1"
            to="1"
            begin="0s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    );
  }
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width={width}
      height={height}
      fill="currentColor"
    >
      <g d="Mode=Light, Color=Primary, Rotation=360">
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#8af0d1"
          strokeWidth="7"
          r="35"
          strokeDasharray="164.93361431346415 56.97787143782138"
          strokeLinecap="square"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur=".5s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          ></animateTransform>
        </circle>
        <g></g>
      </g>
    </svg>
  );
};

export default Spinner;
