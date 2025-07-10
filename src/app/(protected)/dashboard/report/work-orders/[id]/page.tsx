/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import jsPDF from "jspdf";
import Button from "@/components/Button";
import Link from "next/link";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronRight,
  FiLock,
} from "react-icons/fi";
import { IoDownload } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import useAxios from "@/utils/useAxios";
import { useParams } from "next/navigation";
import Image from "next/image";
import { departments } from "@/resources/departments";
import AuthContext, { AuthContextType } from "@/context/authContext";
import { FaCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import useModal from "@/hooks/modalHook";
import TextArea from "@/components/TextArea";
import swal from "sweetalert2";
import { Formik } from "formik";
import * as Yup from "yup";

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  date: string;
  requester: string;
  contactNumber: string;
  assignedTechnician: string;
  location: string;
  description: string;
  startDate: string;
  completionDate: string;
  priority: string;
  partsAndMaterials: string;
  specialInstructions: string;
  approvalSignature?: string;
  approverNameAndTitle?: string;
  dateOfApproval?: string;
  isApproved?: boolean;
  reviewDate?: string;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewStatus?: string;
}

const WorkOrderReport = () => {
  const api = useAxios();
  const params = useParams();
  const id = params.id;

  const [reportData, setReportData] = useState<WorkOrder | null>(null);
  const { user } = useContext(AuthContext) as AuthContextType;
  const { showModal, closeModal, MemoizedModal } = useModal();

  const getDepartmentLabel = (id: string | undefined) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.label : id;
  };

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        const response = await api.get(`work-orders/${id}`);
       
        setReportData({
          id: response.data.id,
          assignedTechnician: response.data.assigned_technician,
          completionDate: response.data.completion_date,
          contactNumber: response.data.contact_number,
          date: response.data.date,
          location: response.data.location,
          description: response.data.description,
          partsAndMaterials: response.data.parts_and_materials,
          priority: response.data.priority,
          requester: response.data.requester,
          specialInstructions: response.data.special_instructions,
          startDate: response.data.start_date,
          workOrderNumber: response.data.work_order_number,
          approvalSignature: response.data.approval_signature,
          approverNameAndTitle: response.data.approver_name_and_title,
          dateOfApproval: response.data.date_of_approval,
          isApproved: response.data.is_approved,
          reviewDate: response.data.review_date,
          reviewedBy: response.data.reviewed_by?.full_name || "NA",
          reviewNotes: response.data.review_notes,
          reviewStatus: response.data.review_status,
        });

        
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkOrder();
  
  }, []);



 



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
                  `work-orders/${params.id}/review/`,
                  {
                    action: actionType, // 'approve' or 'reject'
                    notes: reason, // State variable for textarea
                  }
                );

       

                // Handle success - update state, show notification, etc.

                swal.fire({
                  title: `Work order ${
                    actionType === "approve" ? "approved" : "rejected"
                  } successfully!`,
                  icon: "success",
                  toast: true,
                  timer: 3000,
                  position: "top-right",
                  timerProgressBar: true,
                  showConfirmButton: false,
                });
                setReportData(response.data);
                closeModal()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const generatePDF = () => {
    if (!reportData) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;

    const labelColor = "#555";
    const valueColor = "#000";

    // Add watermark
    const watermarkOpacity = 0.1;
    pdf.setGState(pdf.GState({ opacity: watermarkOpacity }));
    pdf.setFontSize(120);
    pdf.setTextColor(200, 200, 200);
    pdf.text("KOAN", pageWidth / 2, pdf.internal.pageSize.getHeight() / 2, {
      angle: 45,
      align: "center",
    });
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Add company logo centered at the top
    const logoUrl = "/images/koan-logo.jpg";
    const logoWidth = 40;
    const logoHeight = 20;

    // Calculate center position for logo
    const logoX = (pageWidth - logoWidth) / 2;
    pdf.addImage(logoUrl, "PNG", logoX, yPos, logoWidth, logoHeight);
    yPos += logoHeight + 5; // Space below logo

    // Company name and address centered below logo
    pdf.setFontSize(14);
    pdf.setFont("montserrat", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("KOAN TECHNICAL SERVICES", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 7; // Space below company name

    pdf.setFontSize(10);
    pdf.setFont("montserrat", "normal");
    pdf.text("123 Industrial Way • Tech City, TC 12345", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 5; // Space below address
    pdf.text("(555) 987-6543 • www.koan-technical.com", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 15; // Extra space before title

    // Title
    pdf.setFontSize(18);
    pdf.setFont("montserrat", "bold");
    pdf.text("Work Order Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    // Subheading
    pdf.setFontSize(11);
    pdf.setFont("montserrat", "normal");
    pdf.setTextColor(labelColor);
    pdf.text("KOAN Technical Services", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 10;

    // Rest of your PDF generation code remains the same...
    const drawSection = (title: string, items: [string, string][]) => {
      yPos += 8;
      pdf.setFont("montserrat", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(valueColor);
      pdf.text(title, margin, yPos);
      yPos += 5;

      pdf.setFont("montserrat", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(labelColor);

      items.forEach(([label, value]) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.text(`${label}:`, margin, yPos);
        pdf.setTextColor(valueColor);
        pdf.text(value || "-", margin + 50, yPos);
        pdf.setTextColor(labelColor);
        yPos += 7;
      });
    };

    // Sections
    drawSection("Work Order Details", [
      ["Work Order Number", reportData.workOrderNumber],
      ["Date Issued", reportData.date],
      ["Requester", reportData.requester],
      ["Contact Number", reportData.contactNumber],
      ["Assigned Technician", reportData.assignedTechnician],
      ["Priority Level", reportData.priority?.toUpperCase()],
    ]);

    drawSection("Schedule & Location", [
      ["Work Location", reportData.location],
      ["Start Date", reportData.startDate],
      ["Completion Date", reportData.completionDate],
    ]);

    const drawParagraphSection = (title: string, content: string) => {
      yPos += 8;
      pdf.setFont("montserrat", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(valueColor);
      pdf.text(title, margin, yPos);
      yPos += 5;

      pdf.setFont("montserrat", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(valueColor);

      const lines = pdf.splitTextToSize(content || "-", pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.text(line, margin, yPos);
        yPos += 7;
      });
    };

    drawParagraphSection("Work Description", reportData.description);
    drawParagraphSection("Parts and Materials", reportData.partsAndMaterials);
    drawParagraphSection(
      "Special Instructions",
      reportData.specialInstructions
    );

    // Authorization Section - UPDATED WITH PROPER SPACING
    yPos += 10;
    pdf.setFont("montserrat", "bold");
    pdf.setFontSize(12);
    pdf.text("Authorization & Approval", margin, yPos);
    yPos += 12;

    const drawSignatureField = (label: string, value?: string) => {
      // Draw label
      pdf.setFontSize(11);
      pdf.setTextColor(labelColor);
      pdf.text(label, margin, yPos);
      yPos += 7; // Small space between label and value

      // Draw value (if exists)
      if (value) {
        pdf.setTextColor(valueColor);
        pdf.setFont("montserrat", "normal");
        pdf.text(value, margin, yPos);
        yPos += 5; // Space between value and line
      } else {
        yPos += 2; // Less space if no value
      }

      // Draw the signature line
      pdf.setDrawColor(180);
      pdf.line(margin, yPos, pageWidth - margin, yPos);

      // Add space after line
      yPos += 10;
    };

    // Draw each approval field with proper spacing
    drawSignatureField("Approval Signature", reportData.approvalSignature);
    drawSignatureField("Name and Title", reportData?.reviewedBy ? reportData?.reviewedBy : "");
    drawSignatureField("Date of Approval",      reportData?.reviewDate
      ? new Date(reportData.reviewDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "N/A");

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor("#888");
    pdf.text(
      `Generated on ${new Date().toLocaleDateString()} by KOAN Workflow System`,
      margin,
      pdf.internal.pageSize.getHeight() - 10
    );

    pdf.save(`work-order-${reportData.workOrderNumber}.pdf`);
  };





  return (
    <div className="min-h-screen font-montserrat bg-white p-8 relative">
      {/* Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-gray-100 text-9xl font-bold opacity-10 transform rotate-45">
          KOAN
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="px-6 pt-4 relative z-10">
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
                  href="/dashboard/report/work-orders"
                  className="hover:text-blue-600"
                >
                  <span className="ml-1 text-sm font-medium hover:text-blue-600 md:ml-2">
                    Work Orders Dashboard
                  </span>
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Work Order Report
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {reportData?.reviewStatus == "pending_review" && (
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

      {reportData?.reviewStatus == "approved" && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Approved</strong> - This work order has been approved by &quot;<span className="">{reportData.reviewedBy}</span>&quot;&nbsp;
                ready to be downloaded.
              </p>
            </div>
          </div>
        </div>
      )}

      {reportData?.reviewStatus == "rejected" && (
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

      {reportData?.reviewStatus == "pending_review" && user?.is_manager && (
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

      {/* Report Preview */}
      <div
        id="report-preview"
        className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border border-gray-200 relative z-10"
      >
        {/* Company Logo */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-32 h-16 relative">
            <Image
              src="/images/koan-logo.jpg"
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              123 Industrial Way • Tech City, TC 12345
            </p>
            <p className="text-sm text-gray-600">(555) 987-6543</p>
          </div>
        </div>

        <div className="text-center mb-8 border-b-2 pb-6">
          <h2 className="text-2xl font-semibold mt-4 text-gray-800">
            WORK ORDER REPORT
          </h2>
        </div>

        {/* Work Order Details */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Date
              </label>
              <p className="border-b border-gray-200 pb-1">
                {reportData?.date}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Work Order Number
              </label>
              <p className="border-b border-gray-200 pb-1">
                {reportData?.workOrderNumber}
                {/* {id ? `W0-${String(id).padStart(3, '0')}` : ""} */}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Requester
              </label>
              <p className="border-b border-gray-200 pb-1">
                {/* {reportData?.requester} */}
                {getDepartmentLabel(reportData?.requester)}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Contact Number
              </label>
              <p className="border-b border-gray-200 pb-1">
                {reportData?.contactNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Assigned Technician
              </label>
              <p className="border-b border-gray-200 pb-1">
                {reportData?.assignedTechnician}
          
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Priority
              </label>
              <p className="border-b border-gray-200 pb-1">
                {reportData?.priority}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">
              Location of Work
            </label>
            <p className="border-b border-gray-200 pb-1">
              {reportData?.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Start Date
              </label>
              <p className="border-b border-gray-200 pb-1">
                {reportData?.startDate}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Completion Date
              </label>
              <p className="border-b border-gray-200 pb-1">
                {reportData?.completionDate}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600  mb-2">
            Description
          </h3>
          <div className="whitespace-pre-line text-gray-800">
            {reportData?.description}
          </div>
        </div>

        {/* Parts & Materials */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 ">
            PARTS AND MATERIALS NEEDED
          </h3>
          <div className="whitespace-pre-line text-gray-800">
            {reportData?.partsAndMaterials}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 ">
            SPECIAL INSTRUCTIONS
          </h3>

          <div className="whitespace-pre-line text-gray-800">
            {reportData?.specialInstructions}
          </div>
        </div>

        {/* Approval Section */}
        <div className="mt-8 pt-6 border-t-2">
          <h3 className="text-lg font-semibold  mb-6">
            AUTHORIZATION & APPROVAL
          </h3>
          <div className="space-y-8">
            <div>
              <label className="text-sm font-semibold text-gray-600 ">
                Approval Signature
              </label>
              <div className="h-8 border-b-2 border-gray-300">
                {reportData?.approvalSignature}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Name and Title
              </label>
              <div className="h-8 border-b-2 border-gray-300">
                {reportData?.reviewedBy}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Date of Approval
              </label>
              <div className="h-8 border-b-2 border-gray-300">
                {reportData?.reviewDate
                  ? new Date(reportData.reviewDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
      </div>
      <div className="mt-8 text-center">
        <div
          className={`p-4 rounded-lg ${
            reportData?.isApproved
              ? "bg-blue-50 border border-blue-200"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          {reportData?.isApproved ? (
            <div className="flex items-center gap-2 mb-3 justify-center">
              <FiCheckCircle className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
              <p className="text-green-600 font-medium">
                This work order has been approved and is ready for download
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-3 justify-center">
              <FiLock className="text-yellow-500 text-lg mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">
                Download will be available after manager approval
              </p>
            </div>
          )}

          <Button
            onPress={generatePDF}
            size="lg"
            variant="solid"
            color="primary"
            endContent={<IoDownload className="text-lg" />}
            isDisabled={!reportData?.isApproved}
            className="w-full md:w-auto"
          >
            Download PDF Report
          </Button>
        </div>
      </div>
      {MemoizedModal}
    </div>
  );
};

export default WorkOrderReport;
