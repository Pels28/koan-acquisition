/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useContext, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Button from "@/components/Button";
import Link from "next/link";
import { FiAlertTriangle, FiCheckCircle, FiChevronRight } from "react-icons/fi";
import { IoDownload } from "react-icons/io5";
import { Image } from "@heroui/react";
import { useParams } from "next/navigation";
import useAxios from "@/utils/useAxios";
import { LandAcquisition } from "@/resources/states";
import ReportSkeleton from "./ReportSkeleton";
import AuthContext, { AuthContextType } from "@/context/authContext";
import { FaCheck, FaTimes } from "react-icons/fa";
import swal from "sweetalert2";
import useModal from "@/hooks/modalHook";
import { Formik } from "formik";
import * as Yup from "yup";
import TextArea from "@/components/TextArea";

const LandAcquisitionReport = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const api = useAxios();
  const [landAcquisitionData, setLandAcquisitionData] =
    useState<LandAcquisition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext) as AuthContextType;
  const { MemoizedModal, closeModal, showModal } = useModal();

  useEffect(() => {
    const fetchLandAcquistion = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`land-acquisitions/${params.id}/`);

        setLandAcquisitionData(response.data);

      
      } catch (error: any) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandAcquistion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const showAcceptOrRejectModal = (actionType: string) => {
    showModal({
      title: "",
      size: "xl",
      padded: true,
      backdrop: false,
      children: (
        <div className="text-center p-5">
          <Formik
            initialValues={{ reason: "" }}
            validateOnBlur
            validateOnChange={false}
            validationSchema={Yup.object().shape({
              reason: Yup.string().required("Please give a reason"),
            })}
            onSubmit={async (values) => {
              const { reason } = values;

              try {
                const response = await api.post(
                  `land-acquisitions/${params.id}/review/`,
                  {
                    action: actionType, // 'approve' or 'reject'
                    notes: reason, // State variable for textarea
                  }
                );


                // Handle success - update state, show notification, etc.

                swal.fire({
                  title: `${
                    actionType === "approve" ? "approved" : "rejected"
                  } successfully!`,
                  icon: "success",
                  toast: true,
                  timer: 3000,
                  position: "top-right",
                  timerProgressBar: true,
                  showConfirmButton: false,
                });
                setLandAcquisitionData(response.data);
                closeModal();
              } catch (error: any) {
                console.error("Review failed:", error);

                swal.fire({
                  title: `Review failed: ${
                    error.response?.data?.error || error.message
                  }`,
                  icon: "error",
                  toast: true,
                  timer: 3000,
                  position: "top-right",
                  timerProgressBar: true,
                  showConfirmButton: false,
                });
              }
            }}
          >
            {({
              handleBlur,
              handleSubmit,
              values,
              handleChange,
              errors,
              touched,
              isSubmitting,
            }) => {
              return (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <TextArea
                    name="reason"
                    value={values.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="State your reason for your decision"
                    minRows={10}
                    isRequired
                    error={touched.reason ? errors.reason : undefined}
                  />
                  <Button
                    className="mb-4"
                    fullWidth
                    size="lg"
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Submit
                  </Button>
                </form>
              );
            }}
          </Formik>
        </div>
      ),
      baseClassName: "!pb-0",
      onCloseCallback: () => {
        closeModal();
      },
    });
  };

  const getBase64Image = async (src: string): Promise<string> => {
    return new Promise((resolve) => {
      // Create a normal HTML image element
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve("");

        // Set canvas size to match image but limit maximum size
        const maxDimension = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compressed JPEG
      };
      img.onerror = () => resolve("");
    });
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const element = reportRef.current;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;
    let firstPage = true; // Flag to track first page

    // Add centered header with logo ONLY on first page
    const addHeader = async () => {
      if (!firstPage) return; // Skip if not first page

      try {
        // Add logo (centered)
        const logoData = await getBase64Image("/images/koan-logo.jpg");
        if (logoData) {
          const logoWidth = 30; // mm
          const logoHeight = 30; // mm
          pdf.addImage(
            logoData,
            "JPEG",
            pageWidth / 2 - logoWidth / 2,
            yPos,
            logoWidth,
            logoHeight
          );
          yPos += logoHeight + 5;
        }

        // Add company name (centered)
        pdf.setFontSize(14);
        pdf.setFont("montserrat", "bold");
        pdf.text("KOAN TECHNICAL SERVICES", pageWidth / 2, yPos, {
          align: "center",
        });
        yPos += 7;

        // Add address (centered)
        pdf.setFontSize(10);
        pdf.text(
          "123 Business Street, Accra • Tel: +233 123 456 789",
          pageWidth / 2,
          yPos,
          { align: "center" }
        );
        yPos += 10;
      } catch (error) {
        console.error("Header error:", error);
        yPos += 10;
      }
    };

    // Add header only on first page
    await addHeader();

    // Get all printable sections
    const sections = Array.from(element.querySelectorAll(".print-section"));

    // Add text content manually for missing data (only on first page)
    if (firstPage) {
      pdf.setFontSize(12);
      pdf.setFont("montserrat", "bold");
      pdf.text("Decision: ", margin, yPos);
      pdf.setFont("montserrat", "normal");
      pdf.text(
        landAcquisitionData?.decision.toUpperCase() || "N/A",
        margin + 25,
        yPos
      );
      yPos += 10;
    }

    for (const section of sections) {
      const sectionElement = section as HTMLElement;

      // Check if we need a page break (leave 20mm margin at bottom)
      if (yPos > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        yPos = margin;
        firstPage = false; // No longer on first page
      }

      // Convert section to canvas with optimized settings
      const canvas = await html2canvas(sectionElement, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        ignoreElements: (el) => el.classList.contains("no-print"),
      });

      // Calculate image dimensions to fit page width
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add to PDF as compressed JPEG
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.7),
        "JPEG",
        margin,
        yPos,
        imgWidth,
        imgHeight
      );

      yPos += imgHeight + 5;
    }
    // Save with compressed output
    const pdfOutput = pdf.output("arraybuffer");
    const compressedPdf = new Blob([pdfOutput], { type: "application/pdf" });
    const url = URL.createObjectURL(compressedPdf);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `land-acquisition-report-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <ReportSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onPress={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!landAcquisitionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">No data available</div>
          <Button onPress={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Navigation (hidden in PDF) */}
      <div className="px-6 pt-4 font-montserrat print:hidden">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li>
              <div className="flex items-center">
                <Link
                  href="/dashboard/report"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  Report Dashboard
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                <Link
                  href="/dashboard/report/land-acquisitions"
                  className="hover:text-blue-600"
                >
                  <span className="ml-1 text-sm font-medium hover:text-blue-600 md:ml-2">
                    Land Acquisitions Dashboard
                  </span>
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Land Acquisition Report
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {landAcquisitionData?.review_status == "pending_review" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Approval pending</strong> - This work order must be
                approved by a manager before the report can be downloaded.
              </p>
            </div>
          </div>
        </div>
      )}

      {landAcquisitionData?.review_status == "approved" && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Approved</strong> - This work order has been approved by{" "}
                <span>{landAcquisitionData.reviewed_by?.full_name}</span>&nbsp;
                ready to be downloaded.
              </p>
            </div>
          </div>
        </div>
      )}

      {landAcquisitionData?.review_status == "rejected" && (
        <div className="bg-green-50 border-l-4 border-red-400 p-4 my-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheckCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Rejected</strong> - This work order has been rejected.
              </p>
            </div>
          </div>
        </div>
      )}

      {landAcquisitionData?.review_status == "pending_review" &&
        user?.is_manager && (
          <div className="w-full p-2 flex flex-row items-start justify-end gap-2">
            <Button
              className="text-white"
              color="success"
              size="md"
              radius="sm"
              onPress={() => {
                showAcceptOrRejectModal("approve");
              }}
              endContent={<FaCheck className="text-white" />}
            >
              Accept
            </Button>
            <Button
              className="text-white"
              color="danger"
              size="md"
              radius="sm"
              onPress={() => {
                showAcceptOrRejectModal("reject");
              }}
              endContent={<FaTimes />}
            >
              Reject
            </Button>
          </div>
        )}

      {/* Main Content */}
      <div className="min-h-screen bg-white p-8 font-montserrat print:p-0">
        <div
          ref={reportRef}
          className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm print:shadow-none print:max-w-full"
        >
          {/* Header */}
          <div className="mb-8 border-b-2 border-primary pb-4 print:border-b print:border-gray-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <Image
                    src="/images/koan-logo.jpg"
                    alt="Company Logo"
                    className="h-12 mr-4 print:h-10"
                  />
                  <h1 className="text-2xl font-bold text-gray-800 print:text-xl">
                    KOAN TECHNICAL SERVICES
                  </h1>
                </div>
                <p className="text-gray-600 print:text-sm">
                  123 Business Street, Accra
                </p>
                <p className="text-gray-600 print:text-sm">
                  Tel: +233 123 456 789
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 print:text-xs">
                  Report Date: {new Date().toLocaleDateString("en-GB")}
                </div>
                <div className="mt-2 text-xs text-gray-500 print:text-xs">
                  Document ID:{landAcquisitionData.id}
                  {/* {Math.random().toString(36).substring(2, 10).toUpperCase()} */}
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold mb-2 text-center uppercase text-gray-800 print:text-xl">
              LAND / STATION ACQUISITION REPORT
            </h2>
            <div className="text-center text-sm text-gray-600 print:text-xs">
              CONFIDENTIAL - FOR INTERNAL USE ONLY
            </div>
          </div>

          {/* Summary Card */}
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50 print:p-3 print:border-gray-300">
            <div className="grid grid-cols-2 gap-4 print:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-600 print:text-xs">
                  Property Type
                </h4>
                <p className="font-medium print:text-sm">
                  {landAcquisitionData.propertyType}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-600 print:text-xs">
                  Location
                </h4>
                <p className="font-medium print:text-sm">
                  {landAcquisitionData.locationRoad}
                </p>
              </div>
              {/* <div>
                <h4 className="text-sm font-semibold text-gray-600 print:text-xs">
                  Decision
                </h4>
                <p
                  className={`font-medium print:text-sm ${
                    landAcquisitionData.decision === "accept"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {landAcquisitionData.decision.toUpperCase()}
                </p>
              </div> */}
            </div>
          </div>

          {/* Section A */}
          <div className="print-section" style={{ pageBreakInside: "avoid" }}>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 print:text-base print:border-gray-300">
              SECTION A: PROPERTY DETAILS
            </h3>

            <div className="grid grid-cols-2 gap-6 print:gap-4">
              <div>
                <h4 className="text-md font-medium mb-2 print:text-sm">
                  Location Information
                </h4>
                <table className="w-full text-sm print:text-xs">
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-600 w-1/3">Region:</td>
                      <td className="py-1 font-medium">
                        {landAcquisitionData.locationRegion}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">District:</td>
                      <td className="py-1 font-medium">
                        {landAcquisitionData.locationDistrict}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Road:</td>
                      <td className="py-1 font-medium">
                        {landAcquisitionData.locationRoad}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {landAcquisitionData.propertyType === "land" ? (
                <div>
                  <h4 className="text-md font-medium mb-2 print:text-sm">
                    Land Details
                  </h4>
                  <table className="w-full text-sm print:text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 text-gray-600 w-1/3">Land Size:</td>
                        <td className="py-1 font-medium">
                          {landAcquisitionData.landSize}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-600">Land Value:</td>
                        <td className="py-1 font-medium">
                          {landAcquisitionData.landValue}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  <h4 className="text-md font-medium mb-2 print:text-sm">
                    Station Details
                  </h4>
                  <table className="w-full text-sm print:text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 text-gray-600 w-1/3">Type:</td>
                        <td className="py-1 font-medium">
                          {landAcquisitionData.stationType}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-600">Current OMC:</td>
                        <td className="py-1 font-medium">
                          {landAcquisitionData.stationCurrentOMC}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-600">Debt with OMC:</td>
                        <td className="py-1 font-medium">
                          {landAcquisitionData.stationDebtWithOMC}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium mb-2 print:text-sm">
                Tank Capacity
              </h4>
              <div className="grid grid-cols-2 gap-4 print:gap-2">
                <div className="p-3 border border-gray-200 rounded-lg print:p-2 print:border-gray-300">
                  <div className="text-sm text-gray-600 print:text-xs">
                    Diesel
                  </div>
                  <div className="font-medium print:text-sm">
                    {landAcquisitionData.stationTankCapacityDiesel}
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg print:p-2 print:border-gray-300">
                  <div className="text-sm text-gray-600 print:text-xs">
                    Super
                  </div>
                  <div className="font-medium print:text-sm">
                    {landAcquisitionData.stationTankCapacitySuper}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium mb-2 print:text-sm">
                Lease Information
              </h4>
              <table className="w-full text-sm print:text-xs">
                <tbody>
                  <tr>
                    <td className="py-1 text-gray-600 w-1/3">
                      Total Lease Years:
                    </td>
                    <td className="py-1 font-medium">
                      {landAcquisitionData.leaseYears}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-600">Remaining Lease:</td>
                    <td className="py-1 font-medium">
                      {/* {mockData.lease.remaining} */}
                      {landAcquisitionData.leaseRemaining}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Page Break */}
          <div
            className="page-break"
            style={{ pageBreakAfter: "always" }}
          ></div>

          {/* Section B */}
          <div className="print-section" style={{ pageBreakInside: "avoid" }}>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 print:text-base print:border-gray-300">
              SECTION B: WORKS & LOGISTICS
            </h3>

            <div className="mb-6">
              <h4 className="text-md font-medium mb-2 print:text-sm">
                Civil Works Required
              </h4>
              <table className="w-full text-sm border-collapse print:text-xs">
                <thead>
                  <tr className="bg-gray-100 print:bg-gray-200">
                    <th className="p-2 text-left border border-gray-200 print:border-gray-300">
                      Item
                    </th>
                    <th className="p-2 text-left border border-gray-200 print:border-gray-300">
                      Required
                    </th>
                    <th className="p-2 text-left border border-gray-200 print:border-gray-300">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Forecourt
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {/* {mockData.civilWorks.forecourt.required} */}
                      {landAcquisitionData.civilWorksForecourtRequired}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {/* {mockData.civilWorks.forecourt.comment} */}
                      {landAcquisitionData.civilWorksForecourtComment}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Building
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {landAcquisitionData.civilWorksBuildingRequired}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {landAcquisitionData.civilWorksBuildingComment}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Canopy
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {landAcquisitionData.civilWorksCanopyComment}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {landAcquisitionData.civilWorksCanopyComment}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Tank Farm
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {landAcquisitionData.civilWorksTankFarmRequired}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {landAcquisitionData.civilWorksTankFarmComment}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Electricals
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {landAcquisitionData.civilWorksElectricalsRequired}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {landAcquisitionData.civilWorksElectricalsComment}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-6">
              <h4 className="text-md font-medium mb-2 print:text-sm">
                Safety Equipment Status
              </h4>
              <div className="grid grid-cols-2 gap-4 print:gap-2">
                <div className="p-3 border border-gray-200 rounded-lg print:p-2 print:border-gray-300">
                  <div className="text-sm text-gray-600 print:text-xs">
                    Interceptor
                  </div>
                  <div className="font-medium print:text-sm">
                    {landAcquisitionData.civilWorksInterceptorStatus} (
                    {landAcquisitionData.civilWorksInterceptorFunctional})
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg print:p-2 print:border-gray-300">
                  <div className="text-sm text-gray-600 print:text-xs">
                    Vents
                  </div>
                  <div className="font-medium print:text-sm">
                    {landAcquisitionData.civilWorksVentsStatus} (
                    {landAcquisitionData.civilWorksVentsFunctional})
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-md font-medium mb-2 print:text-sm">
                Other Works
              </h4>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg print:p-2 print:border-gray-300 print:bg-gray-100">
                <p className="text-sm print:text-xs">
                  {landAcquisitionData.civilWorksOtherWorks}
                </p>
              </div>
            </div>

            <div className="">
              <h4 className=" text-md font-medium mb-2 print:text-sm">
                Logistics Requirements
              </h4>
              <ul className="list-disc pl-5 text-sm print:text-xs">
                {landAcquisitionData.logistics.map((item, index) => (
                  <li key={index} className="mb-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Financial Summary */}
          <div
            className="mb-8 print-section p-4 border border-gray-200 rounded-lg bg-gray-50 print:p-3 print:border-gray-300"
            style={{ pageBreakInside: "avoid" }}
          >
            <h4 className="text-md font-medium mb-3 print:text-sm">
              Financial Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 print:gap-2">
              <div>
                <div className="text-sm text-gray-600 print:text-xs">
                  Estimated Civil Works Cost
                </div>
                <div className="font-medium print:text-sm">
                  {landAcquisitionData.civilWorksEstimatedCost}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 print:text-xs">
                  Total Estimated Cost
                </div>
                <div className="font-bold print:text-sm">
                  {landAcquisitionData.totalEstimatedCost}
                </div>
              </div>
            </div>
          </div>

          {/* Decision & Justification */}
          <div
            className="mb-8 print-section"
            style={{ pageBreakInside: "avoid" }}
          >
            <h4 className="text-md font-medium mb-2 print:text-sm">
              Decision Justification
            </h4>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg print:p-2 print:border-gray-300 print:bg-gray-100">
              <p className="text-sm print:text-xs">
                {landAcquisitionData.reason}
              </p>
            </div>
          </div>

          <div
            className="mt-12 border-t-2 print-section border-gray-200 pt-8 print:pt-6"
            style={{ pageBreakInside: "avoid" }}
          >
            <div className="grid grid-cols-2 gap-8 print:gap-6">
              {/* Originator & Distribution Manager Section */}
              <div>
                <h4 className="text-md font-medium mb-6 print:text-sm">
                  Prepared & Verified By
                </h4>

                {/* Originator */}
                <div className="mb-6">
                  <div className="mb-1 text-sm font-medium print:text-xs">
                    Originator
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-300 relative">
                    <div className="text-xs text-gray-500 absolute top-0 print:text-2xs">
                      Signature
                    </div>
                  </div>
                </div>

                {/* Distribution/Marketing Manager */}
                <div className="mb-6">
                  <div className="mb-1 text-sm font-medium print:text-xs">
                    Distribution/Marketing Manager
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-300 relative">
                    <div className="text-xs text-gray-500 absolute top-0 print:text-2xs">
                      Signature
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-1 text-sm font-medium print:text-xs">
                    Position
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-300 relative">
                    <div className="text-xs text-gray-500 absolute top-0 print:text-2xs">
                      Signature
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Section */}
              <div>
                <h4 className="text-md font-medium mb-6 print:text-sm">
                  Approved By
                </h4>

                {/* General Manager */}
                <div className="mb-6">
                  <div className="mb-1 text-sm font-medium print:text-xs">
                    General Manager
                  </div>
                  <p> {landAcquisitionData.reviewed_by?.full_name || "NA"}</p>
                  <div className="mt-3 pt-6 border-t border-gray-300 relative">
                    <div className="text-xs text-gray-500 absolute top-0 print:text-2xs">
                      Signature
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 print:text-2xs">
                    Date:
                    {landAcquisitionData?.review_date
                      ? new Date(
                          landAcquisitionData.review_date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </div>
                </div>

                {/* Managing Director */}
                <div className="mb-6">
                  <div className="mb-1 text-sm font-medium print:text-xs">
                    Managing Director
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-300 relative">
                    <div className="text-xs text-gray-500 absolute top-0 print:text-2xs">
                      Signature
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 print:text-2xs">
                    Date:
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 text-center print:hidden">
          <Button
            onPress={generatePDF}
            color="primary"
            variant="solid"
            size="lg"
            radius="md"
            endContent={<IoDownload className="text-lg" />}
            isDisabled={landAcquisitionData.review_status !== "approved"}
          >
            Download PDF Report
          </Button>
          {landAcquisitionData.review_status == "approved" ? (
            <p className="mt-4 text-sm text-gray-500">
              this document is now approved and ready to be downloaded
            </p>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              this document can be downloaded after approval from a manager
            </p>
          )}
        </div>
      </div>
      {MemoizedModal}
    </>
  );
};

export default LandAcquisitionReport;
