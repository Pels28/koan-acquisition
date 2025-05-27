"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ReactElement, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@/context/authContext";

interface ProviderProps {
  children: ReactNode | ReactElement;
}

const Provider = ({ children }: ProviderProps) => {
  return (
    <HeroUIProvider>
      <AuthProvider>
      {/* <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}> */}
        <ToastProvider />
        {children}
        <ToastContainer
          autoClose={3000}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          limit={5}
          position="top-right"
          closeButton={true}
          hideProgressBar={true}
          style={{ minWidth: 400 }}
          toastStyle={{ marginInlineEnd: 20 }} // Use toastStyle instead of bodyStyle
        />
        {/* </PersistGate>
      </ReduxProvider> */}
      </AuthProvider>
    </HeroUIProvider>
  );
};

export default Provider;
