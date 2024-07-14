interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: string;
}

const FormCheckbox: React.FC<Props> = ({ children, ...props }) => {
  return (
    <label className="flex items-center gap-x-3" htmlFor={props.name}>
      <div>
        <input type="checkbox" className="custom-radio" {...props} />
      </div>
      <span className="text-sm md:text-base">{children}</span>
    </label>
  );
};

export default FormCheckbox;
