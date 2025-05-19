// "use client";
// import Button from "@/components/Button";
// import Link from "next/link";
// import { FC, useRef } from "react";
// import { FiChevronRight } from "react-icons/fi";
// import { IoDownload, IoPrint } from "react-icons/io5";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const Checkbox: FC<{ checked: boolean }> = ({ checked }) => (
//   <span className="mr-2">{checked ? "✓" : "☐"}</span>
// );

// const LandAcquisitionReport = () => {

//   const reportRef = useRef<HTMLDivElement>(null);
//   // Mock data
//   const mockData = {
//     propertyType: "station",
//     location: {
//       region: "Greater Accra",
//       district: "Accra Metropolitan",
//       road: "Liberty Avenue",
//     },
//     stationDetails: {
//       type: "fuel",
//       currentOMC: "Vivo Energy",
//       debtWithOMC: "GHC 12,000",
//       tankCapacity: {
//         diesel: "30,000L",
//         super: "25,000L",
//       },
//     },
//     projectedVolume: "150,000L/month",
//     lease: {
//       years: "15",
//       remaining: "10 years",
//     },
//     loadingLocation: "Tema Port",
//     distance: "25km",
//     decision: "accept",
//     reason:
//       "Strategic location with high growth potential. Meets all safety requirements.",
//     civilWorks: {
//       estimatedCost: "GHC 450,000",
//       forecourt: { required: "yes", comment: "Needs resurfacing" },
//       building: { required: "yes", comment: "New construction needed" },
//       canopy: { required: "no", comment: "Existing structure adequate" },
//       tankFarm: { required: "yes", comment: "Upgrade required" },
//       electricals: { required: "yes", comment: "Full rewiring needed" },
//       interceptor: { status: "available", functional: "functional" },
//       vents: { status: "available", functional: "non-functional" },
//       otherWorks: "Install new fire suppression system",
//     },
//     logistics: [
//       "2x Fuel Trucks",
//       "Loading pumps",
//       "Safety equipment",
//       "POS system",
//     ],
//     totalEstimatedCost: "GHC 2,450,000",
//     originator: "John Doe",
//     distributionManager: "Sarah Smith",
//     position: "Acquisition Specialist",
//     approvals: {
//       generalManager: {
//         name: "Michael Johnson",
//         date: "2024-03-15",
//       },
//       managingDirector: {
//         name: "Emily Davis",
//         date: "2024-03-16",
//       },
//     },
//   };

//   const generatePDF = async () => {
//     if (!reportRef.current) return;

//     const pdf = new jsPDF("p", "mm", "a4");
//     const element = reportRef.current;

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const imgWidth = 210; // A4 width in mm
//     const pageHeight = 297; // A4 height in mm
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     pdf.save(`land-acquisition-report-${new Date().toISOString()}.pdf`);
//   };

//   return (
//     <>
//       <div className="px-6 pt-4 font-montserrat">
//         <nav className="flex" aria-label="Breadcrumb">
//           <ol className="inline-flex items-center space-x-1 md:space-x-2">
//             <li>
//               <div className="flex items-center">
//                 {/* <FiChevronRight className="w-4 h-4 text-gray-400" /> */}
//                 <Link
//                   href="/dashboard/report"
//                   className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
//                 >
//                   Report Dashboard
//                 </Link>
//               </div>
//             </li>
//             <li>
//               <div className="flex items-center">
//                 <FiChevronRight className="w-4 h-4 text-gray-400" />
//                 <Link
//                   href="/dashboard/report/land-acquistions"
//                   className="hover:text-blue-600 "
//                 >
//                   <span className="ml-1 text-sm font-medium hover:text-blue-600 md:ml-2">
//                     Land Acquisition Dashbaord
//                   </span>
//                 </Link>
//               </div>
//             </li>

//             <li aria-current="page">
//               <div className="flex items-center">
//                 <FiChevronRight className="w-4 h-4 text-gray-400" />
//                 <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
//                   Land Acquisition Report
//                 </span>
//               </div>
//             </li>
//           </ol>
//         </nav>
//       </div>
//       <div className="min-h-screen bg-white p-8 font-montserrat">
//       <div ref={reportRef} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
//           {/* Header */}
//           <div className="mb-8 border-b-2 border-gray-200 pb-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   Company Name
//                 </h1>
//                 <p className="text-gray-600">123 Business Street, Accra</p>
//                 <p className="text-gray-600">Tel: +233 123 456 789</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-xs text-gray-500">
//                   Report Date: {new Date().toLocaleDateString()}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Title */}
//           <h2 className="text-2xl font-bold mb-6 text-center uppercase text-gray-800">
//             Land / Station Acquisition Report
//           </h2>

//           {/* Section A */}
//           <div className="mb-8">
//             <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
//               Section A: Property Details
//             </h3>

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="font-medium">Property Type:</label>
//                 <span className="ml-2">
//                   {mockData.propertyType === "land" ? "Land" : "Station"}
//                 </span>
//               </div>
//               <div>
//                 <label className="font-medium">Location:</label>
//                 <span className="ml-2">
//                   {mockData.location.region}, {mockData.location.district},{" "}
//                   {mockData.location.road}
//                 </span>
//               </div>
//             </div>

//             {mockData.propertyType === "station" && (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="font-medium">Station Type:</label>
//                     <span className="ml-2 capitalize">
//                       {mockData.stationDetails.type}
//                     </span>
//                   </div>
//                   <div>
//                     <label className="font-medium">Current OMC:</label>
//                     <span className="ml-2">
//                       {mockData.stationDetails.currentOMC}
//                     </span>
//                   </div>
//                   <div>
//                     <label className="font-medium">Debt with OMC:</label>
//                     <span className="ml-2">
//                       {mockData.stationDetails.debtWithOMC}
//                     </span>
//                   </div>
//                   <div>
//                     <label className="font-medium">Tank Capacities:</label>
//                     <span className="ml-2">
//                       Diesel: {mockData.stationDetails.tankCapacity.diesel},
//                       Super: {mockData.stationDetails.tankCapacity.super}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label className="font-medium">Projected Volume:</label>
//                 <span className="ml-2">{mockData.projectedVolume}</span>
//               </div>
//               <div>
//                 <label className="font-medium">Lease Term:</label>
//                 <span className="ml-2">
//                   {mockData.lease.years} years ({mockData.lease.remaining}{" "}
//                   remaining)
//                 </span>
//               </div>
//               <div>
//                 <label className="font-medium">Loading Location:</label>
//                 <span className="ml-2">
//                   {mockData.loadingLocation} ({mockData.distance} distance)
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className="font-medium block mb-2">Decision:</label>
//               <div className="flex items-center">
//                 <Checkbox checked={mockData.decision === "accept"} />
//                 <span className="mr-4">Accept</span>
//                 <Checkbox checked={mockData.decision === "reject"} />
//                 <span>Reject</span>
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className="font-medium block mb-2">Reason:</label>
//               <p className="border rounded p-3 text-gray-700">
//                 {mockData.reason}
//               </p>
//             </div>
//           </div>

//           {/* Section B */}
//           <div className="mb-8">
//             <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
//               Section B: Works & Logistics
//             </h3>

//             <div className="mb-6">
//               <h4 className="font-medium mb-2">
//                 Civil Works (Estimated Cost: {mockData.civilWorks.estimatedCost}
//                 )
//               </h4>
//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <div className="col-span-1 font-medium">Item</div>
//                 <div className="col-span-1 font-medium">Required</div>
//                 <div className="col-span-1 font-medium">Comments</div>
//               </div>

//               {[
//                 { label: "Forecourt", key: "forecourt" },
//                 { label: "Building/Offices", key: "building" },
//                 { label: "Canopy", key: "canopy" },
//                 { label: "Tank Farm", key: "tankFarm" },
//                 { label: "Electricals", key: "electricals" },
//               ].map((item) => (
//                 <div key={item.key} className="grid grid-cols-3 gap-4 mb-2">
//                   <div>{item.label}</div>
//                   <div>
//                     <Checkbox
//                       checked={mockData.civilWorks[item.key].required === "yes"}
//                     />
//                   </div>
//                   <div>{mockData.civilWorks[item.key].comment}</div>
//                 </div>
//               ))}

//               <div className="mt-4 grid grid-cols-3 gap-4">
//                 <div>Interceptor</div>
//                 <div>{mockData.civilWorks.interceptor.status}</div>
//                 <div>
//                   Functional: {mockData.civilWorks.interceptor.functional}
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-4 mt-2">
//                 <div>Vents</div>
//                 <div>{mockData.civilWorks.vents.status}</div>
//                 <div>Functional: {mockData.civilWorks.vents.functional}</div>
//               </div>
//             </div>

//             <div className="mt-6">
//               <h4 className="font-medium mb-2">Other Works Required:</h4>
//               <p className="border rounded p-3 text-gray-700">
//                 {mockData.civilWorks.otherWorks}
//               </p>
//             </div>

//             <div className="mt-6">
//               <h4 className="font-medium mb-2">Logistics Required:</h4>
//               <ul className="list-disc pl-6">
//                 {mockData.logistics.map((item, index) => (
//                   <li key={index} className="mb-1">
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="mt-6">
//               <h4 className="font-medium text-lg">Total Estimated Cost:</h4>
//               <p className="text-2xl font-bold mt-2">
//                 {mockData.totalEstimatedCost}
//               </p>
//             </div>
//           </div>

//           {/* Signatures Section */}
//   <div className="mt-8 border-t-2 border-gray-200 pt-6">
//   <div className="grid grid-cols-2 gap-8">
//       <div>
//         <div className="mb-4">
//           <label className="block font-medium">Originator:</label>
//           <div className="mt-1 border-b-2 border-gray-400 pb-1 w-48">
//             {mockData.originator}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block font-medium">
//             Distribution/Marketing Manager:
//           </label>
//           <div className="mt-1 border-b-2 border-gray-400 pb-1 w-48">
//             {mockData.distributionManager}
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium">Position:</label>
//           <div className="mt-1 border-b-2 border-gray-400 pb-1 w-48">
//             {mockData.position}
//           </div>
//         </div>
//       </div>

//       {/* Approvals Section */}
//       <div>
//         <h3 className="font-medium mb-4">Approvals:</h3>
//         <div className="space-y-6">
//           <div>
//             <label className="block font-medium">
//               General Manager:
//             </label>
//             <div className="mt-1 border-b-2 border-gray-400 pb-1 w-48">
//               {mockData.approvals.generalManager.name}
//             </div>
//             <div className="mt-2 text-sm">
//               Date: {mockData.approvals.generalManager.date}
//             </div>
//           </div>

//           <div>
//             <label className="block font-medium">
//               Managing Director:
//             </label>
//             <div className="mt-1 border-b-2 border-gray-400 pb-1 w-48">
//               {mockData.approvals.managingDirector.name}
//             </div>
//             <div className="mt-2 text-sm">
//               Date: {mockData.approvals.managingDirector.date}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//         {/* Print Button - Not included in print output */}
//       </div>
//       <div className="mt-8 text-center print:hidden">
//           <Button
//             onPress={generatePDF}
//             color="primary"
//             variant="solid"
//             size="lg"
//             radius="md"
//             endContent={<IoDownload className="text-lg" />}
//           >
//             Download PDF Report
//           </Button>
//           <p className="mt-4 text-sm text-gray-500">
//             Official document requires authorized signatures and company stamp
//           </p>
//         </div>
//     </>
//   );
// };

// export default LandAcquisitionReport;

"use client";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Button from "@/components/Button";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { IoDownload } from "react-icons/io5";
import { Image } from "@heroui/react";



const LandAcquisitionReport = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  // Mock data
  const mockData = {
    propertyType: "station",
    location: {
      region: "Greater Accra",
      district: "Accra Metropolitan",
      road: "Liberty Avenue",
    },
    stationDetails: {
      type: "fuel",
      currentOMC: "Vivo Energy",
      debtWithOMC: "GHC 12,000",
      tankCapacity: {
        diesel: "30,000L",
        super: "25,000L",
      },
    },
    projectedVolume: "150,000L/month",
    lease: {
      years: "15",
      remaining: "10 years",
    },
    loadingLocation: "Tema Port",
    distance: "25km",
    decision: "accept",
    reason:
      "Strategic location with high growth potential. Meets all safety requirements.",
    civilWorks: {
      estimatedCost: "GHC 450,000",
      forecourt: { required: "yes", comment: "Needs resurfacing" },
      building: { required: "yes", comment: "New construction needed" },
      canopy: { required: "no", comment: "Existing structure adequate" },
      tankFarm: { required: "yes", comment: "Upgrade required" },
      electricals: { required: "yes", comment: "Full rewiring needed" },
      interceptor: { status: "available", functional: "functional" },
      vents: { status: "available", functional: "non-functional" },
      otherWorks: "Install new fire suppression system",
    },
    logistics: [
      "2x Fuel Trucks",
      "Loading pumps",
      "Safety equipment",
      "POS system",
    ],
    totalEstimatedCost: "GHC 2,450,000",
    originator: "John Doe",
    distributionManager: "Sarah Smith",
    position: "Acquisition Specialist",
    approvals: {
      generalManager: {
        name: "Michael Johnson",
        date: "2024-03-15",
      },
      managingDirector: {
        name: "Emily Davis",
        date: "2024-03-16",
      },
    },
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const element = reportRef.current;

    // PDF configuration
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    let yPos = margin;

    // Add font and set initial style
    pdf.setFont("montserrat", "normal");
    pdf.setFontSize(11);

    // First page header
    const addHeader = () => {
      pdf.setFontSize(14);
      pdf.setFont("montserrat", "bold");
      pdf.text("KOAN TECHNICAL SERVICES", margin, yPos);
      pdf.setFontSize(10);
      pdf.text(
        "123 Business Street, Accra • Tel: +233 123 456 789",
        margin,
        yPos + 5
      );
      yPos += 20;
    };

    // Check for page break
    const checkPageBreak = (spaceNeeded: number) => {
      if (yPos + spaceNeeded > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        // addHeader();
      }
    };

    // Initial header
    addHeader();

    // Get all printable sections
    const sections = Array.from(element.querySelectorAll(".print-section"));

    for (const section of sections) {
      const sectionHeight = section.clientHeight * 0.264583; // Convert px to mm

      // Check if section fits on current page
      if (yPos + sectionHeight > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        // addHeader();
      }

      // Convert section to canvas
      const canvas = await html2canvas(section as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Add section to PDF
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", margin, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 10;

      // Add section spacing
      checkPageBreak(10);
    }

    pdf.save("land-acquisition-report.pdf");
  };

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
                    src="/logo.png"
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
                  Document ID:{" "}
                  {Math.random().toString(36).substring(2, 10).toUpperCase()}
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
            <div className="grid grid-cols-3 gap-4 print:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-600 print:text-xs">
                  Property Type
                </h4>
                <p className="font-medium print:text-sm">
                  {mockData.propertyType}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-600 print:text-xs">
                  Location
                </h4>
                <p className="font-medium print:text-sm">
                  {mockData.location.road}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-600 print:text-xs">
                  Decision
                </h4>
                <p
                  className={`font-medium print:text-sm ${
                    mockData.decision === "accept"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {mockData.decision.toUpperCase()}
                </p>
              </div>
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
                        {mockData.location.region}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">District:</td>
                      <td className="py-1 font-medium">
                        {mockData.location.district}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Road:</td>
                      <td className="py-1 font-medium">
                        {mockData.location.road}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="text-md font-medium mb-2 print:text-sm">
                  Station Details
                </h4>
                <table className="w-full text-sm print:text-xs">
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-600 w-1/3">Type:</td>
                      <td className="py-1 font-medium">
                        {mockData.stationDetails.type}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Current OMC:</td>
                      <td className="py-1 font-medium">
                        {mockData.stationDetails.currentOMC}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Debt with OMC:</td>
                      <td className="py-1 font-medium">
                        {mockData.stationDetails.debtWithOMC}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                    {mockData.stationDetails.tankCapacity.diesel}
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg print:p-2 print:border-gray-300">
                  <div className="text-sm text-gray-600 print:text-xs">
                    Super
                  </div>
                  <div className="font-medium print:text-sm">
                    {mockData.stationDetails.tankCapacity.super}
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
                    <td className="py-1 font-medium">{mockData.lease.years}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-600">Remaining Lease:</td>
                    <td className="py-1 font-medium">
                      {mockData.lease.remaining}
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
                      {mockData.civilWorks.forecourt.required}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.forecourt.comment}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Building
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.building.required}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.building.comment}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Canopy
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.canopy.required}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.canopy.comment}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Tank Farm
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.tankFarm.required}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.tankFarm.comment}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      Electricals
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.electricals.required}
                    </td>
                    <td className="p-2 border border-gray-200 print:border-gray-300">
                      {mockData.civilWorks.electricals.comment}
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
                    {mockData.civilWorks.interceptor.status} (
                    {mockData.civilWorks.interceptor.functional})
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg print:p-2 print:border-gray-300">
                  <div className="text-sm text-gray-600 print:text-xs">
                    Vents
                  </div>
                  <div className="font-medium print:text-sm">
                    {mockData.civilWorks.vents.status} (
                    {mockData.civilWorks.vents.functional})
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
                  {mockData.civilWorks.otherWorks}
                </p>
              </div>
            </div>

            <div className="">
              <h4 className=" text-md font-medium mb-2 print:text-sm">
                Logistics Requirements
              </h4>
              <ul className="list-disc pl-5 text-sm print:text-xs">
                {mockData.logistics.map((item, index) => (
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
                  {mockData.civilWorks.estimatedCost}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 print:text-xs">
                  Total Estimated Cost
                </div>
                <div className="font-bold print:text-sm">
                  {mockData.totalEstimatedCost}
                </div>
              </div>
            </div>
          </div>

          {/* Decision & Justification */}
          <div className="mb-8 print-section" style={{ pageBreakInside: "avoid" }}>
            <h4 className="text-md font-medium mb-2 print:text-sm">
              Decision Justification
            </h4>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg print:p-2 print:border-gray-300 print:bg-gray-100">
              <p className="text-sm print:text-xs">{mockData.reason}</p>
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

                  <div className="mt-6 pt-6 border-t border-gray-300 relative">
                    <div className="text-xs text-gray-500 absolute top-0 print:text-2xs">
                      Signature
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 print:text-2xs">
                    Date:
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
          >
            Download PDF Report
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Official document requires authorized signatures and company stamp
          </p>
        </div>
      </div>
    </>
  );
};

export default LandAcquisitionReport;
