const PersonalInfoItem = (props: any) => {
  const { name, value } = props;

  return (
    <div className="flex w-full items-center justify-between border-b-[1px] border-[#EFF2F5] py-6 px-4 sm:px-10">
      <p className="text-sm font-normal text-dark-500">{name}</p>
      <p className="tex-dark-800 text-sm font-medium dir-ltr">{value}</p>
    </div>
  );
};

export default PersonalInfoItem;
