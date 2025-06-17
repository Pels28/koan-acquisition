"use client";
import Button from "@/components/Button";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import useModal from "@/hooks/modalHook";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import * as paths from "@/resources/paths";

import ResetPassword from "./ResetPassword";
// import VerificationSent from "./VerificationSent";
// import ConfirmPassword from "./password/reset/confirm/[uid]/[token]/page";

const Navbar = () => {
  const { showModal, closeModal, showLoadingScreen, MemoizedModal } =
    useModal();
  const searchParams = useSearchParams();
  const router = useRouter();

  // const closeAuthPopUps = useCallback(() => {
  //   if (window)
  //     window.history.pushState({}, "", `/?${paths.AUTH_SEARCH_PARAM_KEY}=''`);
  // }, []);

  // And modify your closeAuthPopUps to not trigger when empty:
  const closeAuthPopUps = useCallback(() => {
    const currentKey = searchParams.get(paths.AUTH_SEARCH_PARAM_KEY);
    if (currentKey) {
      window.history.pushState({}, "", `/?${paths.AUTH_SEARCH_PARAM_KEY}=''`);
    }
  }, [searchParams]);

  const showSignIn = useCallback(() => {
    showModal({
      title: "Login",
      size: "2xl",
      padded: true,
      showCloseButton: true,
      children: (
        <SignIn
          onComplete={() => {
            router.push("/dashboard");
            closeModal();

            showLoadingScreen();
          }}
        />
      ),

      baseClassName: "!pb-0",
      onCloseCallback: () => {
        closeModal();
        closeAuthPopUps();
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, closeModal, showLoadingScreen, closeAuthPopUps]); // Add all dependencies used in the callback

  const showRegister = useCallback(() => {
    showModal({
      title: "Register",
      size: "2xl",
      padded: true,
      children: (
        <SignUp
          onComplete={() => {
            showLoadingScreen()
            closeModal();
            // setTimeout(() => {
            //   showModal({
            //     title: "",
            //     size: "xl",
            //     children: (
            //       <VerificationSent email={email} onClose={closeModal} />
            //     ),
            //   });
            // }, 500);
          }}
        />
      ),
      baseClassName: "!pb-0",
      onCloseCallback: () => {
        closeModal();
        closeAuthPopUps();
      },
    });
     
  }, [showModal, closeModal, showLoadingScreen, closeAuthPopUps]); // Add all dependencies used in the callback

  const showResetPassword = () => {
    showModal({
      title: "",
      size: "xl",
      padded: true,
      children: (
        <ResetPassword
          onComplete={() => {
            closeModal();
           
      
          }}
        />
      ),
      baseClassName: "!pb-0",
      onCloseCallback: () => {
        closeModal();
        closeAuthPopUps();
      },
    });
  }; // Add all dependencies used in the callback

  // const showConfirmPassword = () => {
  //   showModal({
  //     title: "",
  //     size: "xl",
  //     children: <ConfirmPassword onComplete={closeModal} />,
  //     onCloseCallback: () => {
  //       window.history.pushState({}, "", `/?${paths.AUTH_SEARCH_PARAM_KEY}=''`);
  //     },
  //   });
  // };

  useEffect(() => {
    const key = searchParams.get(paths.AUTH_SEARCH_PARAM_KEY);
    if (key) {
      switch (key) {
        case paths.SEARCH_PARAMS.auth.signIn:
          showSignIn();
          break;
        case paths.SEARCH_PARAMS.auth.signUp:
          showRegister();
          break;

        case paths.SEARCH_PARAMS.auth.resetPassword:
          showResetPassword();
          break;
        default:
          // Clear the auth param if it's not recognized
          closeAuthPopUps();
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Remove showRegister and showSignIn from dependencies

  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">
          KOAN WorkFlow System
        </h1>
      </div>
      <div className="flex space-x-4">
        <Button
          onPress={() => {
            window.history.pushState(
              {},
              "",
              `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
            );
          }}
          size="lg"
          radius="md"
          color="primary"
          variant="light"
          className="font-poppins"
        >
          Login
        </Button>
        {/* <Button
          size="lg"
          radius="md"
          color="primary"
          variant="solid"
          className="font-poppins"
          onPress={() => {
            window.history.pushState(
              {},
              "",
              `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signUp}`
            );
          }}
        >
          Sign Up
        </Button> */}
      </div>
      {MemoizedModal}
    </nav>
  );
};

export default Navbar;
