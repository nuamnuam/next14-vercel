export type TableHeaderItem = {
  title: string | JSX.Element;
  name: string;
  classNames?: string;
  width: string;
  columnClassNames?: string;
  align?: string;
  sort?: boolean;
};

export type TableProps = {
  data: Array<Record<string, any>>;
  headerItems: TableHeaderItem[];
  isLoading?: boolean;
  isFetching?: boolean;
  isInitialLoad?: boolean;
  hasNextPage?: boolean;
  headerExtraClassname?: string;
  bodyExtraClassname?: string;
  showHeader?: boolean;
  onRowClick?: (idx) => void;
};
