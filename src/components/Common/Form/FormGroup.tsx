import { createContext, useId } from 'react';

interface FormGroupContext {
  required?: boolean;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  type?: string;
}

export const FormGroupContext = createContext<
  FormGroupContext & { color: () => string; id: string }
>({
  required: false,
  error: '',
  type: '',
  success: false,
  id: '',
  color: () => '',
});

interface Props extends FormGroupContext, React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  grow?: boolean;
}

const FormGroup: React.FC<Props> = ({
  children,
  error,
  required,
  success,
  disabled,
  type,
  grow,
  ...props
}) => {
  const id = useId();

  const color = () => {
    if (error) return '!border-error';
    if (success) return '!border-success';
    return '';
  };
  return (
    <FormGroupContext.Provider
      value={{ error, required, success, color, disabled, id }}
    >
      <div role="group" aria-disabled={disabled} {...props}>
        <div>{children}</div>
        {error && type !== 'search' && (
          <div className="mt-1 h-4 px-2 text-right">
            <p role="alert" className="text-xs font-normal text-error">
              {error}
            </p>
          </div>
        )}
      </div>
    </FormGroupContext.Provider>
  );
};

export default FormGroup;
