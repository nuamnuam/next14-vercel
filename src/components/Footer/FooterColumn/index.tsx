import Link from 'next/link';

interface ColumnItem {
  cta: string;
  ctaUrl: string;
  id: number;
}

interface Props {
  title: string;
  items: ColumnItem[];
}

export const FooterColumn = ({ title, items }: Props) => {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-right">
      <span className="text-xl font-bold text-dark-700">{title}</span>
      <div className="flex flex-col">
        {items.map((item) => {
          if (item.ctaUrl)
            return (
              <Link
                href={item.ctaUrl}
                key={item.ctaUrl}
                className="relative font-medium mt-[16px] text-sm text-dark-600 before:absolute before:top-2 before:right-0 before:hidden before:h-1 before:w-1 before:rounded-lg before:bg-dark-600 md:pr-3 before:md:block"
              >
                {item.cta}
              </Link>
            );
        })}
      </div>
    </div>
  );
};

export default FooterColumn;
