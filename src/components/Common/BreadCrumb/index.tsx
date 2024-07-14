import clsx from 'classnames';
import Link from 'next/link';

interface Props {
  classNames?: string;
  items: Array<{ label: string; href?: string | undefined }>;
}

const BreadCrumb: React.FC<Props> = ({ items = [], classNames }) => {
  return (
    <div className={clsx('flex items-center p-2', classNames)}>
      {items.map(({ label, href }, index) => {
        return href ? (
          <Link
            href={href}
            key={index}
            className={clsx(
              'text-2xs flex items-center ml-1',
              index === items.length - 1 ? 'text-primary-600' : 'text-dark-300',
            )}
          >
            <span
              className="ml-1 block"
              dangerouslySetInnerHTML={{ __html: label }}
            />
            {index !== items.length - 1 ? '/' : null}
          </Link>
        ) : (
          <span
            key={index}
            className={clsx(
              'text-2xs flex items-center ml-1',
              index === items.length - 1 ? 'text-primary-600' : 'text-dark-300',
            )}
          >
            <span className="ml-1 block">{label}</span>
            {index !== items.length - 1 ? '/' : null}
          </span>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
