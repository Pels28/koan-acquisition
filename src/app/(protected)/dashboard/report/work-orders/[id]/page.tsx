/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import jsPDF from "jspdf";
import Button from "@/components/Button";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { IoDownload } from "react-icons/io5";
import { useEffect, useState } from "react";
import useAxios from "@/utils/useAxios";
import { useParams } from "next/navigation";

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
  // serviceType?: string
  // status?: "Completed" | "In Progress" | "Pending";
}

const WorkOrderReport = () => {
  const api = useAxios();
  const params = useParams();
  const id = params.id;

  const [reportData, setReportData] = useState<WorkOrder | null>(null);


  

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
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkOrder();
  }, []);



  const generatePDF = () => {
    if (!reportData) return;
  
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;
  
    const labelColor = "#555";
    const valueColor = "#000";
  
    pdf.setFont("helvetica"); // Use clean default font
  
    // Title
    pdf.setFontSize(18);
    pdf.setFont("montserrat", "bold");
    pdf.text("Work Order Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
  
    // Subheading
    pdf.setFontSize(11);
    pdf.setFont("montserrat", "normal");
    pdf.setTextColor(labelColor);
    pdf.text("KOAN Technical Services", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
  
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
    drawParagraphSection("Special Instructions", reportData.specialInstructions);
  
    // Authorization Section
    yPos += 10;
    pdf.setFont("montserrat", "bold");
    pdf.setFontSize(12);
    pdf.text("Authorization & Approval", margin, yPos);
    yPos += 12;
  
    const drawSignatureLine = (label: string) => {
      pdf.setFontSize(11);
      pdf.setTextColor(labelColor);
      pdf.text(label, margin, yPos);
      yPos += 5;
      pdf.setDrawColor(180);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;
    };
  
    drawSignatureLine("Approval Signature");
    drawSignatureLine("Name and Title");
    drawSignatureLine("Date of Approval");
  
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
    <div className="min-h-screen font-montserrat bg-white p-8">
      {/* Breadcrumb Navigation */}
      <div className="px-6 pt-4">
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

      {/* Report Preview */}
      <div  id="report-preview" className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border border-gray-200">
        <div className="text-center mb-8 border-b-2 pb-6">
          <h1 className="text-3xl font-bold mb-2">
            KOAN TECHNICAL SERVICES
          </h1>
          <p className="text-gray-600">
            123 Industrial Way • Tech City, TC 12345 • (555) 987-6543
          </p>
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
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Requester
              </label>
              <p className="border-b border-gray-200 pb-1">
                {reportData?.requester}
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
          <h3 className="text-sm font-semibold text-gray-600  mb-2">
            PARTS AND MATERIALS NEEDED
          </h3>
          <div className="whitespace-pre-line text-gray-800">
            {reportData?.partsAndMaterials}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
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
              <label className="text-sm font-semibold text-gray-600">
                Approval Signature
              </label>
              <div className="h-12 border-b-2 border-gray-300"></div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Name and Title
              </label>
              <div className="h-12 border-b-2 border-gray-300"></div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Date of Approval
              </label>
              <div className="h-12 border-b-2 border-gray-300"></div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 text-center">
          <Button
            onPress={generatePDF}
            size="lg"
            variant="solid"
            color="primary"
            endContent={<IoDownload className="text-lg" />}
            className="w-full md:w-auto"
            id="download-button"
          >
            Download PDF Report
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            This preview matches the downloadable PDF format
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderReport;
