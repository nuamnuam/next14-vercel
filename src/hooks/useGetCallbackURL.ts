import { useRouter } from 'next/router';

const useGetCallbackURL = (): string => {
  const router = useRouter();

  const callbackURL = router.query.callbackURL;

  return typeof callbackURL === 'string' ? callbackURL : '/panel/dashboard';
};

export default useGetCallbackURL;
