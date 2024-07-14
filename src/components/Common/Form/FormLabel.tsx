import classNames from 'classnames';
import { useContext } from 'react';
import { FormGroupContext } from './FormGroup';
import CustomTooltip from '../Tooltip';
import Icon from '../Icon';

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: string | React.ReactNode;
  tooltip?: string;
}

const FormLabel: React.FC<Props> = ({
  children,
  htmlFor,
  tooltip,
  ...props
}) => {
  const context = useContext(FormGroupContext);

  const labelId = () => {
    if (htmlFor && context.id) {
      return `${htmlFor}-${context.id}`;
    } else if (!htmlFor) {
      return context.id;
    } else {
      return '';
    }
  };

  return (
    <label
      className={classNames(
        context.disabled && 'opacity-40',
        'mb-2 flex items-center text-sm font-medium text-dark-600',
      )}
      {...props}
      htmlFor={labelId()}
    >
      {tooltip ? (
        <div className="flex items-center">
          {children}
          <div className="mr-2">
            <CustomTooltip
              title={tooltip}
              anchor={
                <Icon
                  icon="InfoCircle-OutLined"
                  size={16}
                  className="text-dark-600"
                />
              }
            />
          </div>
        </div>
      ) : (
        children
      )}
    </label>
  );
};

export default FormLabel;
