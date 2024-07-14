import React from 'react';

const CircleLoading: React.FC<React.SVGProps<SVGSVGElement>> = ({
  width = 22,
  height = 22,
  stroke = '#B6B9CC',
  ...props
}) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        background: 'rgb(255, 255, 255)',
        display: 'block',
        shapeRendering: 'auto',
      }}
      width="24px"
      height="24px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke={`${stroke}`}
        strokeWidth="6"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        ></animateTransform>
      </circle>
    </svg>
  );
};

export default CircleLoading;
