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
import { MdAddAPhoto, MdMenu } from "react-icons/md";
import useAxios from "@/utils/useAxios";
import { TbLockQuestion } from "react-icons/tb";
import useModal from "@/hooks/modalHook";
import ResetPassword from "@/components/ResetPassword";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const api = useAxios();
  const [userImage, setUserImage] = useState("");

  const isActive = (route: string) => pathname.startsWith(route);
  const { MemoizedModal, closeModal, showModal } = useModal();
  const [noOfPendingWorkOrders, setNoOfPendingWorkOrders] = useState(0);
  const [noOfPendingLandAcquisitions, setNoOfPendingLandAcquisitions] =
    useState(0);

  const { user, logoutUser, setUser } = useContext(
    AuthContext
  ) as AuthContextType;
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
        const noOfPendingWorkOrders = await api.get(
          `work-orders/?review_status=pending_review`
        );
        const noOfPendingLA = await api.get(
          `land-acquisitions/?review_status=pending_review`
        );
        setNoOfPendingWorkOrders(noOfPendingWorkOrders.data.results.length);
        setNoOfPendingLandAcquisitions(noOfPendingLA.data.results.length);

        setUserImage(userResponse.data.profile.image);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.put("api/user/image/", formData);

      setUserImage(response.data.user.profile.image);
      setUser((prev) => ({ ...prev, image: response.data.user.profile.image }));
    } catch (error) {
      console.error(error);
    }
  };

  const closeAuthPopUps = useCallback(() => {
    const currentPath = window.location.pathname;
    const currentKey = searchParams.get(paths.AUTH_SEARCH_PARAM_KEY);
    if (currentKey) {
      window.history.pushState(
        {},
        "",
        `${currentPath}?${paths.AUTH_SEARCH_PARAM_KEY}=''`
      );
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
  };

  useEffect(() => {
    const key = searchParams.get(paths.AUTH_SEARCH_PARAM_KEY);
    if (key) {
      switch (key) {
        case paths.SEARCH_PARAMS.auth.resetPassword:
          showResetPassword();
          break;
        default:
          closeAuthPopUps();
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile
  const closeSidebar = () => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  // Ensure sidebar is always visible on desktop
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isDesktop, pathname]);

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
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            {!isDesktop && (
              <button
                onClick={toggleSidebar}
                className="text-white focus:outline-none"
              >
                <MdMenu className="w-6 h-6" />
              </button>
            )}
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold font-montserrat">Dashboard</h1>
            </Link>
          </div>

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
                id: "reset-password",
                label: <div className="font-montserrat">Reset Password</div>,
                icon: <TbLockQuestion className="w-5 h-5" />,
                onClick: () => {
                  const currentPath = window.location.pathname;
                  window.history.pushState(
                    {},
                    "",
                    `${currentPath}?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.resetPassword}`
                  );
                  window.dispatchEvent(new Event("popstate"));
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
          <div
            className={clsx(
              "bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-all duration-300",
              "fixed md:relative z-50 top-0 left-0 h-full w-64",
              {
                "translate-x-0": isSidebarOpen,
                "-translate-x-full": !isSidebarOpen,
              },
              "md:translate-x-0"
            )}
          >
            {/* Mobile close button */}
            {!isDesktop && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={closeSidebar}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            )}

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
                  onClick={closeSidebar}
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
                  onClick={closeSidebar}
                >
                  <FiFileText className="text-lg" />
                  <span>Land Acquisition</span>
                </Link>
              </li>

              <li
                className="relative"
                onClick={() => {
                  handleToggleDropdown();
                }}
              >
                {noOfPendingWorkOrders > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2  text-white py-auto text-center bg-red-500 rounded-full z-10" />
                )}

                <div
                  className={`w-full flex items-center  space-x-1 hover:bg-gray-100 hover:text-gray-600 
                   
                  p-3 rounded-lg font-montserrat font-medium relative`}
                  onClick={() => {
                    handleToggleDropdown();
                  }}
                >
                  <FiPieChart className="" />
                  <span className="m">Reports Dashboard</span>
                  <FaChevronDown
                    className={clsx(
                      "w-3 h-3 text-primary transition-transform duration-300",
                      {
                        "transform rotate-180": isOpen,
                      }
                    )}
                  />
                </div>

                {isOpen && (
                  <div className="ml-6 mt-2 text-sm relative">
                    {noOfPendingWorkOrders > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5  text-white py-auto text-center bg-red-500 rounded-full z-10">
                        {noOfPendingWorkOrders}
                      </div>
                    )}
                    <Link
                      href="/dashboard/report/work-order"
                      className={`w-full flex items-center  space-x-1 hover:bg-gray-100 hover:text-gray-600 ${
                        isActive("/dashboard/report/work-order") &&
                        "bg-primary/10 text-primary"
                      } p-3 rounded-lg font-montserrat font-medium relative`}
                      onClick={closeSidebar}
                    >
                      <span>Work Order </span>
                    </Link>

                    <div className="relative">
                      {noOfPendingLandAcquisitions > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5  text-white py-auto text-center bg-red-500 rounded-full z-10">
                          {noOfPendingLandAcquisitions}
                        </div>
                      )}
                      <Link
                        href="/dashboard/report/land-acquisition"
                        className={`w-full mt-2 flex items-center space-x-1 hover:bg-gray-100 hover:text-gray-600 ${
                          isActive("/dashboard/report/land-acquisition") &&
                          "bg-primary/10 text-primary"
                        } p-3 rounded-lg font-montserrat font-medium relative`}
                        onClick={closeSidebar}
                      >
                        <span>Land/Station Acquisition </span>
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>

          {/* Overlay for mobile */}
          {isSidebarOpen && !isDesktop && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeSidebar}
            />
          )}

          {/* Main Content */}
          <div
            className={clsx(
              "flex-1 min-h-0 transition-all",
              isSidebarOpen && !isDesktop && "blur pointer-events-none"
            )}
            onClick={closeSidebar}
          >
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