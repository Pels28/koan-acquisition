/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "./Button";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { Formik } from "formik";
import * as Yup from "yup";
import { CivilWorkKey, ISectionB } from "@/resources/states";
import Input from "./Input";
import RadioButton from "./RadioButton";
import TextArea from "./TextArea";

interface ISectionBProps {
  onPrevious?: () => void;
  initData: ISectionB;
  onComplete: (data: any) => void;
}

const SectionB = ({ onPrevious, initData, onComplete }: ISectionBProps) => {
  const civilWorkItems: { name: CivilWorkKey; label: string }[] = [
    { name: "forecourt", label: "Forecourt" },
    { name: "building", label: "Building / Offices" },
    { name: "canopy", label: "Canopy" },
    { name: "tankFarm", label: "Tank/Tank farm" },
    { name: "electricals", label: "Electricals" },
  ];

  return (
    <div className="space-y-6">
      <Formik
        initialValues={{
          ...initData,
        }}
        validateOnBlur
        validateOnChange={false}
        validationSchema={Yup.object({})}
        onSubmit={async (values) => {
      
          if (onComplete) {
            onComplete(values);
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
          setFieldValue,
          isSubmitting,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  SECTION B
                </h2>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-8">
                    1. Works required
                  </h3>

                  <div className="mb-4">
                    <Input
                      type="text"
                      name="civilWorks.estimatedCost"
                      value={values.civilWorks.estimatedCost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="(a) Civil works estimated cost"
                      placeholder="Type estimated cost"
                      labelPlacement="outside"
                      error={
                        touched.civilWorks?.estimatedCost
                          ? errors.civilWorks?.estimatedCost
                          : undefined
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    {civilWorkItems.map((item) => (
                      <div
                        key={item.name}
                        className="grid grid-cols-1 md:grid-cols-3 gap-1 items-center"
                      >
                        <label className="text-sm font-medium text-gray-700">
                          {item.label}
                        </label>
                        <div className="flex space-x-4">
                          <RadioButton
                            name={`civilWorks.${item.name}.required`}
                            size="md"
                            orientation="horizontal"
                            options={[
                              { title: "Yes", value: "yes" },
                              { title: "No", value: "no" },
                            ]}
                            value={values.civilWorks[item.name]?.required}
                            onBlur={handleBlur}
                            error={
                              touched.civilWorks?.[item.name]?.required
                                ? errors.civilWorks?.[item.name]?.required
                                : undefined
                            }
                            onValueChange={(v) => {
                              setFieldValue(
                                `civilWorks.${item.name}.required`,
                                v
                              );
                        
                            }}
                            required
                          />
                        </div>
                        <Input
                          type="text"
                          labelPlacement="outside"
                          placeholder="Comment"
                          name={`civilWorks.${item.name}.comment`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.civilWorks[item.name]?.comment}
                          label=""
                          error={
                            touched.civilWorks?.[item.name]?.comment
                              ? errors.civilWorks?.[item.name]?.comment
                              : undefined
                          }
                        />
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Interceptor
                      </label>
                      <div className="flex space-x-4">
                        <RadioButton
                          name={`civilWorks.interceptor.status`}
                          size="sm"
                          orientation="horizontal"
                          options={[
                            { title: "Available", value: "available" },
                            { title: "Not Available", value: "non-available" },
                          ]}
                          value={values.civilWorks.interceptor.status}
                          onBlur={handleBlur}
                          error={
                            touched.civilWorks?.interceptor?.status
                              ? errors.civilWorks?.interceptor?.status
                              : undefined
                          }
                          onValueChange={(v) => {
                            setFieldValue(`civilWorks.interceptor.status`, v);
                        
                          }}
                          required
                        />
                      </div>
                      <div className="flex space-x-4">
                        <RadioButton
                          name={`civilWorks.interceptor.functional`}
                          size="sm"
                          orientation="horizontal"
                          options={[
                            { title: "Functional", value: "functional" },
                            {
                              title: "Non Functional",
                              value: "non-functional",
                            },
                          ]}
                          value={values.civilWorks.interceptor.functional}
                          onBlur={handleBlur}
                          error={
                            touched.civilWorks?.interceptor?.functional
                              ? errors.civilWorks?.interceptor?.functional
                              : undefined
                          }
                          onValueChange={(v) => {
                            setFieldValue(
                              `civilWorks.interceptor.functional`,
                              v
                            );
                        
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Vents
                      </label>
                      <div className="flex space-x-4">
                        <RadioButton
                          name={`civilWorks.vents.status`}
                          size="sm"
                          orientation="horizontal"
                          options={[
                            { title: "Available", value: "available" },
                            { title: "Not Available", value: "non-available" },
                          ]}
                          value={values.civilWorks.vents.status}
                          onBlur={handleBlur}
                          error={
                            touched.civilWorks?.vents?.status
                              ? errors.civilWorks?.vents?.status
                              : undefined
                          }
                          onValueChange={(v) => {
                            setFieldValue(`civilWorks.vents.status`, v);
                       
                          }}
                          required
                        />
                      </div>
                      <div className="flex space-x-4">
                        <RadioButton
                          name={`civilWorks.vents.functional`}
                          size="sm"
                          orientation="horizontal"
                          options={[
                            { title: "Functional", 
                              value: "functional", },
                            {
                              title: "Non Functional",
                              value: "non-functional",
                            },
                          ]}
                          value={values.civilWorks.vents.functional}
                          onBlur={handleBlur}
                          error={
                            touched.civilWorks?.vents?.functional
                              ? errors.civilWorks?.vents?.functional
                              : undefined
                          }
                          onValueChange={(v) => {
                            setFieldValue(`civilWorks.vents.functional`, v);
                        
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <TextArea
                      name="civilWorks.otherWorks"
                      value={values.civilWorks.otherWorks}
                      label={
                        <span className="text-black ">
                          {" "}
                          (b) State other works required
                        </span>
                      }
                      placeholder=""
                      onChange={handleChange}
                      minRows={10}
                      onBlur={handleBlur}
                      isRequired
                      error={
                        touched.civilWorks?.otherWorks
                          ? errors.civilWorks?.otherWorks
                          : undefined
                      }
                    />
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-lg font-medium text-gray-800 mb-6">
                    2. List logistics required
                  </h3>
                  {values.logistics.map((item, index) => (
                    <div key={index} className="">
                      <Input
                        type="text"
                        name={`logistics[${index}]`}
                        value={item}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={`${String.fromCharCode(97 + index)}.`} // 'a.', 'b.', etc.
                        labelPlacement="outside"
                        className="mb-10 "
                      />
                    </div>
                  ))}
                </div>

                <div className="my-6">
                  <Input
                    type="text"
                    name="totalEstimatedCost"
                    value={values.totalEstimatedCost}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="TOTAL ESTIMATED COST (GHC)"
                    labelPlacement="outside"
                    placeholder="Type estimated count.."
                  />
                </div>
              </div>
              <div className="w-full flex flex-row items-start justify-between">
                <Button
                  type="button"
                  startContent={<FaArrowLeft />}
                  size="lg"
                  radius="md"
                  color="primary"
                  onPress={onPrevious}
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  radius="md"
                  color="primary"
                  endContent={<IoMdSend />}
                  isLoading={isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SectionB;
