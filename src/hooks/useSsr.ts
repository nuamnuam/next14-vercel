const useSsr = () => {
  const isServer = !(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.documentElement
  );

  return {
    isServer,
  };
};

export default useSsr;
