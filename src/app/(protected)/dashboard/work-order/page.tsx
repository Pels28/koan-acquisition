import WorkOrderForm from "@/components/WorkOrderForm";

export default function WorkOrderPage() {
 const initialData = {
    date: null,
    workOrderNumber: "",
    requester: "",
    contactNumber: "",
    assignedTechnician: "",
    location: "",
    description: "",
    startDate: null,
    completionDate: null,
    priority: "medium",
    partsAndMaterials: "",
    specialInstructions: "",
    approvalSignature: "",
    nameAndTitle: "",
    dateOfApproval: null,
  }


  return <WorkOrderForm initialData={initialData} />;
}