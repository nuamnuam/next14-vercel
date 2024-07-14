import { Dispatch, SetStateAction, createContext, useState } from 'react';

interface ModalContext {
  forceUpdate: Dispatch<SetStateAction<{}>>;
}

export const modalContext = createContext<ModalContext>({
  forceUpdate: () => {},
});

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [_, forceUpdate] = useState({});

  return (
    <modalContext.Provider value={{ forceUpdate }}>
      {children}
    </modalContext.Provider>
  );
};

export default ModalProvider;
