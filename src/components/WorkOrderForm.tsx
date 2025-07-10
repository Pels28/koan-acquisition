/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "./Input";
import DatePicker from "./DatePicker";
import TextArea from "./TextArea";
import Select from "./Select";
import Button from "./Button";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/modalHook";
import { useRef } from "react";
import useAxios from "@/utils/useAxios";
import swal from "sweetalert2";
import { CalendarDate } from "@heroui/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { departments } from "@/resources/departments";

interface WorkOrder {
  id?: string;
  workOrderNumber: string;
  date: null | CalendarDate;
  requester: string;
  contactNumber: string;
  assignedTechnician: string;
  location: string;
  description: string;
  startDate: null | CalendarDate;
  completionDate: null | CalendarDate;
  priority: string;
  partsAndMaterials: string;
  specialInstructions: string;
  // serviceType?: string
  // status?: "Completed" | "In Progress" | "Pending";
}

interface IWorkOrderFormProps {
  onComplete?: () => void;
  initialData: WorkOrder;
}

const WorkOrderForm = ({ onComplete, initialData }: IWorkOrderFormProps) => {
  const router = useRouter();
  const { Modal } = useModal();
  const dateRef = useRef<HTMLDivElement | null>(null);
  const workOrderNumberRef = useRef<HTMLDivElement | null>(null);
  const requesterRef = useRef<HTMLDivElement | null>(null);
  const contactNumberRef = useRef<HTMLDivElement | null>(null);
  const assignedTechnicianRef = useRef<HTMLDivElement | null>(null);
  const locationOfWorkRef = useRef<HTMLDivElement | null>(null);
  const descriptionOfWorkRef = useRef<HTMLDivElement | null>(null);
  const startDateRef = useRef<HTMLDivElement | null>(null);
  const completionDateRef = useRef<HTMLDivElement | null>(null);
  const priorityRef = useRef<HTMLDivElement | null>(null); // Fixed typo
  const partsAndMaterialsRef = useRef<HTMLDivElement | null>(null);
  const api = useAxios();
  const params = useParams();

  const scrollToErrorField = (errors: any) => {
    if (errors.date) {
      dateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (errors.workOrderNumber) {
      workOrderNumberRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.requester) {
      requesterRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.contactNumber) {
      contactNumberRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.assignedTechnician) {
      assignedTechnicianRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.locationOfWork) {
      locationOfWorkRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.descriptionOfWork) {
      descriptionOfWorkRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.startDate) {
      startDateRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.completionDate) {
      completionDateRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.priority) {
      priorityRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.partsAndMaterials) {
      partsAndMaterialsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };



  const formatDate = (dateObj: any) => {
    if (!dateObj) return null;
    return `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(
      dateObj.day
    ).padStart(2, "0")}`;
  };

  return (
    <>
      {params.id && (
        <div className="px-6 pt-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li>
                <div className="flex items-center">
                  <Link
                    href="/dashboard/report/work-orders"
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    Report Dashboard
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <FiChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Work Order
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Work Order Form</h1>
          {/* Replace with your organization's logo */}
        
        </div>
        <Formik
          initialValues={initialData}
          validateOnBlur
          validateOnChange={false}
          validationSchema={Yup.object({
            date: Yup.date().required("Date is required"),
            // Fixed field name to match initialValues
            // workOrderNumber: Yup.string()
            //   .trim()
            //   .required("Work order number is required"),
            requester: Yup.string().trim().required("Requester is required"),
            contactNumber: Yup.string()
              .trim()
              .required("Contact number is required"),
            assignedTechnician: Yup.string()
              .trim()
              .required("Assign a technician"),
            location: Yup.string()
              .trim()
              .required("Location of work is required"),
            description: Yup.string()
              .trim()
              .required("Description of work is required"),
            startDate: Yup.date().required("Start date is required"),
            completionDate: Yup.date().required("Completion date is required"),
            priority: Yup.string().trim().required("Assign priority"),
            partsAndMaterials: Yup.string()
              .trim()
              .required("Parts and materials are required"),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if (params.id) {
                await api.patch(`work-orders/${params.id}/`, {
                  date: formatDate(values.date),
                  // work_order_number: values.workOrderNumber,
                  requester: values.requester,
                  contact_number: values.contactNumber,
                  assigned_technician: values.assignedTechnician,
                  location: values.location,
                  description: values.description,
                  start_date: formatDate(values.startDate),
                  completion_date: formatDate(values.completionDate),
                  priority: values.priority,
                  parts_and_materials: values.partsAndMaterials,
                  special_instructions: values.specialInstructions,
                });

                swal.fire({
                  title: "work order updated successfully",
                  icon: "success",
                  toast: true,
                  timer: 2000,
                  position: "top-right",
                  timerProgressBar: true,
                  showConfirmButton: false,
                });

                router.push(`/dashboard/report/work-orders/`);
              } else {
                const response = await api.post("work-orders/", {
                  date: formatDate(values.date),
                  // work_order_number: values.workOrderNumber,
                  requester: values.requester,
                  contact_number: values.contactNumber,
                  assigned_technician: values.assignedTechnician,
                  location: values.location,
                  description: values.description,
                  start_date: formatDate(values.startDate),
                  completion_date: formatDate(values.completionDate),
                  priority: values.priority,
                  parts_and_materials: values.partsAndMaterials,
                  special_instructions: values.specialInstructions,
                });
                swal.fire({
                  title: "work order created successfully",
                  icon: "success",
                  toast: true,
                  timer: 2000,
                  position: "top-right",
                  timerProgressBar: true,
                  showConfirmButton: false,
                });

                router.push(
                  `/dashboard/report/work-orders/${response.data.id}`
                );
              }

              resetForm();

              if (onComplete) {
                onComplete();
              }
              // showLoadingScreen();
            } catch (error: unknown) {
              let errorMessage = "Failed to create. Please check your details.";

              if (typeof error === "string") {
                errorMessage = error;
              } else if (error instanceof Error) {
                errorMessage = error.message;
              }

              // toast.error(errorMessage);
              swal.fire({
                title: errorMessage,
                icon: "error",
                toast: true,
                timer: 6000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            validateForm,
            setTouched,
          }) => (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                // Mark all fields as touched to show errors
                const touchedFields = Object.keys(values).reduce(
                  (acc, field) => {
                    acc[field] = true;
                    return acc;
                  },
                  {} as any
                );

                setTouched(touchedFields);

                const errors = await validateForm();

                if (Object.keys(errors).length > 0) {
                  scrollToErrorField(errors);
                } else {
                  handleSubmit(e);
                }
              }}
              noValidate
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1" ref={dateRef}>
                  <DatePicker
                    name="date"
                    className=""
                    value={values.date}
                    label="Pick Date"
                    labelPlacement="outside"
                    // onChange={handleChange}
                    onChange={(val) => {
                      setFieldValue("date", val); // Update the 'dateOfMarriage' field in the form values
                    }}
                    size="lg"
                    radius="sm"
                    isRequired
                    onBlur={handleBlur}
                    error={touched.date ? errors.date : undefined}
                  />
                </div>

                {/* <div className="space-y-1" ref={workOrderNumberRef}> */}
                {/* <Input
                    radius="sm"
                    size="lg"
                    type="text"
                    placeholder="Work Order Number"
                    label="Work Order Number"
                    labelPlacement="outside"
                    name="workOrderNumber"
                    value={values.workOrderNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.workOrderNumber
                        ? errors.workOrderNumber
                        : undefined
                    }
                    isRequired
                  /> */}
                {/* </div> */}

                <div className="space-y-1" ref={requesterRef}>
                  {/* <Select
                    // type="text"
                    label="Requester"
                    labelPlacement="outside"
                    name="requester"
                    options={[

                    ]}
                    // value={values.requester}
                    placeholder="Requester"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    radius="sm"
                    size="lg"
                    error={touched.requester ? errors.requester : undefined}
                  /> */}
                  <Select
                    label="Requester"
                    labelPlacement="outside"
                    name="requester"
                    options={departments}
                    value={
                      values.requester
                        ? {
                            id: values.requester
                              .toLowerCase()
                              .replace(/\s+/g, "_"),
                            label: values.requester,
                            value: values.requester,
                          }
                        : undefined
                    }
                    placeholder="Select Department"
                    
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    radius="sm"
                    size="lg"
                    error={touched.requester ? errors.requester : undefined}
                    onValueChange={(val) => {
                      if (!val) {
                        setFieldValue("requester", "");
                      } else if (Array.isArray(val)) {
                        setFieldValue("requester", val[0]?.value || "");
                      } else {
                        setFieldValue("requester", val.value);
                      }
                    }}
                  />
                </div>

                <div className="space-y-1" ref={contactNumberRef}>
                  <Input
                    type="tel"
                    name="contactNumber"
                    label="Contact Number"
                    labelPlacement="outside"
                    value={values.contactNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.contactNumber ? errors.contactNumber : undefined
                    }
                    isRequired
                  />
                </div>

                <div className="space-y-1" ref={assignedTechnicianRef}>
                  <Input
                    type="text"
                    name="assignedTechnician"
                    label="Assigned Techinician"
                    labelPlacement="outside"
                    value={values.assignedTechnician}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.assignedTechnician
                        ? errors.assignedTechnician
                        : undefined
                    }
                    isRequired
                  />
                </div>

                <div className="space-y-1" ref={locationOfWorkRef}>
                  <Input
                    type="text"
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.location ? errors.location : undefined}
                    label="Location of work"
                    labelPlacement="outside"
                    isRequired
                  />
                </div>

                <div
                  className="md:col-span-2 space-y-1"
                  ref={descriptionOfWorkRef}
                >
                  <TextArea
                    name="description"
                    value={values.description}
                    placeholder="Description of Work"
                    onChange={handleChange}
                    minRows={10}
                    onBlur={handleBlur}
                    isRequired
                    error={touched.description ? errors.description : undefined}
                  />
                </div>

                <div className="space-y-1" ref={startDateRef}>
                  <DatePicker
                    name="startDate"
                    value={values.startDate}
                    onChange={(val) => {
                      setFieldValue("startDate", val); // Update the 'dateOfMarriage' field in the form values
                    }}
                    size="lg"
                    radius="sm"
                    onBlur={handleBlur}
                    label="Start Date"
                    labelPlacement="outside"
                    error={touched.startDate ? errors.startDate : undefined}
                  />
                </div>

                <div className="space-y-1" ref={completionDateRef}>
                  <DatePicker
                    name="completionDate"
                    value={values.completionDate}
                    onChange={(val) => {
                      setFieldValue("completionDate", val); // Update the 'dateOfMarriage' field in the form values
                    }}
                    size="lg"
                    radius="sm"
                    onBlur={handleBlur}
                    label="Completion Date"
                    labelPlacement="outside"
                    error={
                      touched.completionDate ? errors.completionDate : undefined
                    }
                  />
                </div>

                <div className="space-y-1 w-full" ref={priorityRef}>
                  <Select
                    name="priority"
                    label="Priority"
                    options={[
                      { id: "low", label: "Low", value: "low" },
                      { id: "medium", label: "Medium", value: "medium" },
                      { id: "high", label: "High", value: "high" },
                    ]}
                    value={
                      values.priority
                        ? {
                            id: values.priority,
                            label:
                              values.priority.charAt(0).toUpperCase() +
                              values.priority.slice(1),
                            value: values.priority,
                          }
                        : undefined // Changed from null to undefined
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    size="lg"
                    radius="sm"
                    error={touched.priority ? errors.priority : undefined}
                    required
                    onValueChange={(val) => {
                      if (!val) {
                        setFieldValue("priority", "");
                      } else if (Array.isArray(val)) {
                        setFieldValue("priority", val[0]?.id ?? "");
                      } else {
                        setFieldValue("priority", val.id);
                      }
                    }}
                  />
                </div>

                <div
                  className="md:col-span-2 space-y-1"
                  ref={partsAndMaterialsRef}
                >
                  <TextArea
                    name="partsAndMaterials"
                    value={values.partsAndMaterials}
                    placeholder="Parts And Materials Needed"
                    onChange={handleChange}
                    minRows={10}
                    onBlur={handleBlur}
                    isRequired
                    error={
                      touched.partsAndMaterials
                        ? errors.partsAndMaterials
                        : undefined
                    }
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <TextArea
                    name="specialInstructions"
                    value={values.specialInstructions}
                    placeholder="Special Instructions"
                    onChange={handleChange}
                    minRows={10}
                    onBlur={handleBlur}
                    isRequired
                    error={
                      touched.specialInstructions
                        ? errors.specialInstructions
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  size="lg"
                  radius="md"
                  color="primary"
                  isLoading={isSubmitting}
                >
                  Submit Work Order
                </Button>
              </div>
            </form>
          )}
        </Formik>
        <Modal />
      </div>
    </>
  );
};

export default WorkOrderForm;
