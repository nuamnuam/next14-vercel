import React from 'react';
import Link from 'next/link';

import Error from '@/assets/images/404/Error404.png';
import { Button } from '@/components/Common';
import FooterBackground from '@/assets/images/FooterBackground.svg';
import { useBreakpoint, useLang } from '@/hooks';

const NotFoundPage = () => {
  const [notFound] = useLang(['notFound']);

  const { isMobile, isDesktop } = useBreakpoint();
  return (
    <main
      className="w-full bg-contain bg-bottom bg-no-repeat"
      style={{ backgroundImage: `url('${FooterBackground.src}')` }}
    >
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto items-start lg:items-center lg:min-h-screen justify-center gap-8 lg:gap-0">
          <div className="grid col-span-1 justify-center mt-14 lg:mt-0 lg:block">
            <img src={Error.src} alt="404 Error" />
          </div>
          <div className="grid col-span-1 justify-center text-center mt-12 lg:mt-0 lg:text-right">
            <h1 className="text-dark-700 font-black text-3xl">
              {notFound.title}
            </h1>

            <span className="text-dark-600 font-medium text-base lg:text-2xl mt-3 block">
              {notFound.couldNotFindPage}
            </span>
            <p className="text-sm text-dark-500 font-medium mt-8 lg:w-5/6">
              {isDesktop
                ? notFound.description
                : notFound.responsiveDescription}
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button
                className="mt-8 mx-auto md:mx-0 w-fit"
                fullWidth={isMobile}
              >
                <Link href="/">{notFound.returnBackToHome}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
