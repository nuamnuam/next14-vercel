const PersonalInfoItem = (props: any) => {
  const { name, value } = props;

  return (
    <div className="flex w-full items-center justify-between p-4 pt-5 pb-5 sm:pl-10 sm:pt-6 sm:pb-6 sm:pr-10 border-b-[1px] border-[#EFF2F5]">
      <p className="text-sm font-normal text-dark-500	 ">{name}</p>
      <p className="tex-dark-800 text-sm font-medium	">{value}</p>
    </div>
  );
};

export default PersonalInfoItem;
