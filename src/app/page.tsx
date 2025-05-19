import Link from "next/link";

import Navbar from "./Navbar";
import Button from "@/components/Button";

export default function Home() {


  return (
    <section className="min-h-screen font-montserrat bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Work Orders & Land Acquisition Portal
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Centralized platform for managing station acquisitions, work orders,
          and operational workflows
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" radius="md" color="primary">
              Access Forms
            </Button>
          </Link>
          <Button size="lg" radius="md" color="primary" variant="bordered">
            View Reports
          </Button>
        </div>
      </div>

      {/* Forms Preview Section */}
      <div className="container mx-auto px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Standardized Company Forms
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Land/Station Acquisition Form Card */}
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">
                Land/Station Acquisition
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Standard form for evaluating new land or station acquisitions
              including property details, assessments, and approvals.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Property Type
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Location Details
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Station Assessment
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Approval Workflow
              </span>
            </div>
          </div>

          {/* Work Order Form Card */}
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg
                  className="w-6 h-6 text-blue-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Work Order</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive work order form for maintenance requests, technician
              assignments, and work completion tracking.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Requester Details
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Work Description
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Technician Assignment
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Priority Level
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Operational Insights
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="text-blue-800 text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-3">
              Form Completion Analytics
            </h3>
            <p className="text-gray-600">
              Track form completion rates and identify bottlenecks in approval
              workflows.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="text-blue-800 text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold mb-3">Processing Times</h3>
            <p className="text-gray-600">
              Monitor average processing times for acquisitions and work orders.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="text-blue-800 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3">Department Metrics</h3>
            <p className="text-gray-600">
              Department-level performance metrics and workload distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Streamlined Approval Workflows
          </h2>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 md:w-1/2">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-600 rounded-full p-2 mr-4">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Automated routing to department managers</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-600 rounded-full p-2 mr-4">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Digital signatures and approvals</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-600 rounded-full p-2 mr-4">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Audit trail for all form submissions</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">
                  Approval Hierarchy
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <span className="text-blue-800 font-medium">1</span>
                    </div>
                    <span>Originator → Distribution Manager</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <span className="text-blue-800 font-medium">2</span>
                    </div>
                    <span>General Manager Review</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <span className="text-blue-800 font-medium">3</span>
                    </div>
                    <span>Managing Director Final Approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              © {new Date().getFullYear()} OMC WorkFlow System. Internal Use
              Only.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-300">
                Terms of Use
              </a>
              <a href="#" className="hover:text-blue-300">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
