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

interface IWorkOrderFormProps {
  onComplete?: () => void;
}

const WorkOrderForm = ({ onComplete }: IWorkOrderFormProps) => {
  const router = useRouter();
  const {Modal, showLoadingScreen } = useModal();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Work Order Form</h1>
        {/* Replace with your organization's logo */}
        <div className="mt-2 text-sm text-gray-500">
          [Organization Name/Logo]
        </div>
      </div>
      <Formik
        initialValues={{
          date: null,
          workOrderNumber: "",
          requester: "",
          contactNumber: "",
          assignedTechnician: "",
          locationOfWork: "",
          descriptionOfWork: "",
          startDate: null,
          completionDate: null,
          priority: "medium",
          partsAndMaterials: "",
          specialInstructions: "",
          approvalSignature: "",
          nameAndTitle: "",
          dateOfApproval: null,
        }}
        validateOnBlur
        validateOnChange={false}
        validationSchema={Yup.object({})}
        onSubmit={async (values, {}) => {
          console.log(values);
          if (onComplete) {
            onComplete();
          }
          showLoadingScreen();
          router.push("/dashboard/report/work-orders/1");
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
        }) => (
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const errors = await validateForm();

              console.log(errors);

              handleSubmit(e);
            }}
            noValidate
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
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

              <div className="space-y-1">
                <Input
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
                    touched.workOrderNumber ? errors.workOrderNumber : undefined
                  }
                  isRequired
                />
              </div>

              <div className="space-y-1">
                <Input
                  type="text"
                  label="Requester"
                  labelPlacement="outside"
                  name="requester"
                  value={values.requester}
                  placeholder="Requester"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isRequired
                  radius="sm"
                  size="lg"
                  error={touched.requester ? errors.requester : undefined}
                />
              </div>

              <div className="space-y-1">
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

              <div className="space-y-1">
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

              <div className="space-y-1">
                <Input
                  type="text"
                  name="locationOfWork"
                  value={values.locationOfWork}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.locationOfWork ? errors.locationOfWork : undefined
                  }
                  label="Location of work"
                  labelPlacement="outside"
                  isRequired
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <TextArea
                  name="descriptionOfWork"
                  value={values.descriptionOfWork}
                  placeholder="Description of Work"
                  onChange={handleChange}
                  minRows={10}
                  onBlur={handleBlur}
                  isRequired
                />
              </div>

              <div className="space-y-1">
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

              <div className="space-y-1">
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

              <div className="space-y-1 w-full">
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

              <div className="md:col-span-2 space-y-1">
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
      <Modal/>
    </div>
  );
};

export default WorkOrderForm;
