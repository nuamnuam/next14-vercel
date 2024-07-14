import React from 'react';

interface Props {
  title?: string;
  children: React.ReactNode;
}

const ListItemsLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-card">
      {title ? (
        <div className="hidden items-center justify-between border-b border-dark-50 p-6 lg:flex">
          <span className="text-xl font-medium text-dark-700">{title}</span>
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
};

export default ListItemsLayout;
