import AuthBg from '@/assets/images/AuthBackground.svg';
import { useCaptchaQuery } from '@/requests/captcha/captchaQuery';

interface Props {
  children: React.ReactNode;
  layout?: 'right' | 'left';
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  useCaptchaQuery();

  return (
    <div
      className="flex min-h-screen flex-col "
      style={{ backgroundImage: `url('${AuthBg.src}')` }}
    >
      <div className="flex flex-grow items-stretch justify-center">
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default AuthLayout;
