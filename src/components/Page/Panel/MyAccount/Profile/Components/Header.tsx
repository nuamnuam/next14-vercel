import { Icon, IconButton } from '@/components/Common';
import { useRouter } from 'next/router';
import { title } from 'process';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  extra?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, extra }) => {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-dark-100 p-4 sm:px-8 mb-8 h-[76px]">
      <div className="flex items-center justify-between">
        <div
          className="flex gap-8 items-center justify-start cursor-pointer"
          onClick={() => onBack?.()}
        >
          {onBack && (
            <Icon size={18} icon="Right-OutLined" className="text-dark-200" />
          )}
          <span className="text-dark-600 text-lg font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          {extra}
          <IconButton
            size="lg"
            className="border-dark-200"
            icon={
              <Icon
                className="text-dark-600"
                icon="QuestionCircle-OutLined"
                size={20}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
