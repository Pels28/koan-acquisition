"use client";
import { FiFileText, FiPieChart } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar } from "@heroui/react";
import Dropdown from "@/components/Dropdown";
import { PiSignOutBold } from "react-icons/pi";
import * as paths from "@/resources/paths";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import AuthContext, { AuthContextType } from "@/context/authContext";
import swal from "sweetalert2";
import { MdAddAPhoto } from "react-icons/md";
import useAxios from "@/utils/useAxios";
import { TbLockQuestion } from "react-icons/tb";
import useModal from "@/hooks/modalHook";
import ResetPassword from "@/components/ResetPassword";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const api = useAxios();
  const [userImage, setUserImage] = useState("");

  const isActive = (route: string) => pathname.startsWith(route);
  const {MemoizedModal, closeModal, showModal} = useModal()

  const { user, logoutUser, setUser } = useContext(
    AuthContext
  ) as AuthContextType;

  useEffect(() => {
    if (!user) {
      router.replace(
        `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
      );
    }
  }, [user, router]);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const userResponse = await api.get("api/user/me/");

        setUserImage(userResponse.data.profile.image);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserImage();
  });

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.put("api/user/image/", formData);

      setUserImage(response.data.user.profile.image);
      setUser((prev) => ({ ...prev, image: response.data.user.profile.image }));
    } catch (error) {
      // swal.fire({
      //     title: 'Upload Failed',
      //     text: 'Could not update profile image',
      //     icon: 'error',
      //     toast: true,
      //     timer: 3000,
      //     position: 'top-right'
      // });
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (user?.access) {
  //     dispatch(getUserInfo());
  //   }
  // }, [dispatch, user?.access])

  const closeAuthPopUps = useCallback(() => {
    const currentPath = window.location.pathname;
    const currentKey = searchParams.get(paths.AUTH_SEARCH_PARAM_KEY);
    if (currentKey) {
      window.history.pushState({}, "", `${currentPath}?${paths.AUTH_SEARCH_PARAM_KEY}=''`);
    }
  }, [searchParams]);

  const showResetPassword = () => {
    showModal({
      title: "",
      size: "xl",
      padded: true,
      backdropStyle: "opaque",
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

  useEffect(() => {
    const key = searchParams.get(paths.AUTH_SEARCH_PARAM_KEY);
    if (key) {
      switch (key) {


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
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <input
        type="file"
        ref={inputFileRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />
      {/* Header */}
      <header className="bg-primary text-white py-4 px-6 shadow-md flex-shrink-0">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-montserrat">Dashboard</h1>
          <Dropdown
            options={[
              {
                id: "add-photo",
                label: <div className="font-montserrat">Add Photo</div>,

                icon: <MdAddAPhoto className="w-5 h-5" />,
                onClick: () => {
                  inputFileRef.current?.click();
                },
              },
              {
                id: "sign-out",
                label: <div className="font-montserrat">Sign Out</div>,
                icon: <PiSignOutBold className="w-5 h-5" />,
                onClick: () => {
                  logoutUser();
                  swal.fire({
                    title: "Logged out Successfully",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                  });
                  // router.replace(`/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`)
                  // window.history.replaceState(
                  //   {},
                  //   "",
                  //   `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
                  // );
                },
              },
              {
                id: "reset-password",
                label: <div className="font-montserrat">Reset Password</div>,
                icon: <TbLockQuestion className="w-5 h-5" />,
                onClick: () => {
                  // Get current path without search params
                  const currentPath = window.location.pathname;
                  // Append the auth search param to current URL
                  window.history.pushState(
                    {},
                    "",
                    `${currentPath}?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.resetPassword}`
                  );
                  // Force a re-render to trigger the modal
                  window.dispatchEvent(new Event('popstate'));
                },
              },
            ]}
          >
            <span className="cursor-pointer">
              <Avatar
                isBordered
                showFallback
                name={user?.first_name}
                size="lg"
                src={userImage}
              />
            </span>
          </Dropdown>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 pb-0">
              <h2 className="font-montserrat font-bold text-lg mb-6 text-gray-700">
                Navigation
              </h2>
            </div>
            <ul className="space-y-3 p-4 flex-1 overflow-y-auto">
              <li>
                <Link
                  href="/dashboard/work-order"
                  className={`w-full flex items-center space-x-3 hover:bg-gray-100 hover:text-gray-600 ${
                    isActive("/dashboard/work-order") &&
                    "bg-primary/10 text-primary"
                  } p-3 rounded-lg font-montserrat font-medium`}
                >
                  <FiFileText className="text-lg" />
                  <span>Work Order</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/land-acquisition"
                  className={`w-full flex items-center space-x-3 hover:bg-gray-100 hover:text-gray-600  ${
                    isActive("/dashboard/land-acquisition") &&
                    "bg-primary/10 text-primary"
                  }  p-3 rounded-lg font-montserrat font-medium`}
                >
                  <FiFileText className="text-lg" />
                  <span>Land Acquisition</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/report"
                  className={`w-full flex items-center space-x-3 hover:bg-gray-100 hover:text-gray-600  ${
                    isActive("/dashboard/report") &&
                    "bg-primary/10 text-primary"
                  }  p-3 rounded-lg font-montserrat font-medium`}
                >
                  <FiPieChart className="text-lg" />
                  <span>Reports Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-0">
            <div className="bg-white h-full p-6 rounded-lg shadow-sm overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
      {MemoizedModal}
    </div>
  );
}
