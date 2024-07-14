import React from 'react';

interface Props {
  children: React.ReactNode;
}

const SingleItemLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-card">
      <div className="py-6 px-4 sm:px-6">{children}</div>
    </div>
  );
};

export default SingleItemLayout;
