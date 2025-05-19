"use client";
import { FiFileText, FiPieChart } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";
import Dropdown from "@/components/Dropdown";
import { PiSignOutBold } from "react-icons/pi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (route: string) => pathname.startsWith(route);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-6 shadow-md flex-shrink-0">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-montserrat">Dashboard</h1>
          <Dropdown
            options={[
              {
                id: "sign-out",
                label: <div>Sign Out</div>,
                icon: <PiSignOutBold className="w-5 h-5" />,
                onClick: () => { router.push("/") }
              },
            ]}
          >
            <span className="cursor-pointer">
              <Avatar
                isBordered
                showFallback
                name="Pels"
                size="lg"
                src="https://i.pravatar.cc/150?u=a04258114e29026302d"
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
    </div>
  );
}