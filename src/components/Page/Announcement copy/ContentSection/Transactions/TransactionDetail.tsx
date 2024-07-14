interface IProps {
  title: string;
  date: string;
  important?: boolean;
  handleBackBtn?: () => void;
  description: string;
}

const TransactionDetail = ({
  title,
  date,
  important,
  handleBackBtn,
  description,
}: IProps) => {
  return (
    <div>
      <p
        className="p-6 text-sm font-medium leading-6 text-dark-500	"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default TransactionDetail;
