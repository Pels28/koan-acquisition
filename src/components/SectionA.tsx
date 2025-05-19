import Button from "./Button";
import { FaArrowRight } from "react-icons/fa";
import { ISectionA } from "@/resources/states";
import { Formik } from "formik";
import * as Yup from "yup";
import RadioButton from "./RadioButton";
import Input from "./Input";
import TextArea from "./TextArea";

interface ISectionAProps {
  onNext?: () => void;
  initData?: ISectionA;
}

const SectionA = ({ onNext, initData }: ISectionAProps) => {
  return (
    <div className="space-y-6">
      <Formik
        initialValues={{ ...initData }}
        validateOnBlur
        validateOnChange={false}
        validationSchema={Yup.object({})}
        onSubmit={async (values) => {
          console.log(values);
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
        }) => {
          return (
            <form
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();

                handleSubmit(e);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <RadioButton
                    name="propertyType"
                    size="md"
                    label="Property Type"
                    orientation="horizontal"
                    options={[
                      { title: "Land", value: "land" },
                      { title: "Station", value: "station" },
                    ]}
                    value={values.propertyType}
                    onBlur={handleBlur}
                    error={
                      touched.propertyType ? errors.propertyType : undefined
                    }
                    onValueChange={(v) => {
                      setFieldValue("propertyType", v);
                      console.log(v);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Input
                    type="text"
                    name="location.region"
                    value={values.location?.region}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Region"
                    labelPlacement="outside"
                    placeholder="Type region"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="location.district"
                    value={values.location?.district}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="District"
                    labelPlacement="outside"
                    placeholder="Type District.."
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="location.road"
                    value={values.location?.road}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Road"
                    labelPlacement="outside"
                    placeholder="Type Road.."
                  />
                </div>
              </div>

              {values.propertyType === "land" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                  <div>
                    <Input
                      type="text"
                      name="landDetails.size"
                      value={values.landDetails?.size}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Size"
                      labelPlacement="outside"
                      placeholder="Type Size.."
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      name="landDetails.value"
                      value={values.landDetails?.value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Value"
                      labelPlacement="outside"
                      placeholder="Type Value.."
                    />
                  </div>
                </div>
              )}

              {values.propertyType === "station" && (
                <>
                  <div className="my-5">
                    <RadioButton
                      name="values.stationDetails.type"
                      size="md"
                      label="4A. Station Type"
                      orientation="horizontal"
                      options={[
                        { title: "Fuel", value: "fuel" },
                        { title: "LPG", value: "lpg" },
                        { title: "CRM", value: "crm" },
                        { title: "Premix", value: "premix" },
                      ]}
                      value={values.stationDetails?.type}
                      onBlur={handleBlur}
                      error={
                        touched.stationDetails
                          ? errors.stationDetails
                          : undefined
                      }
                      onValueChange={(v) => {
                        setFieldValue("stationDetails.type", v);
                        console.log(v);
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                    <div>
                      <Input
                        type="text"
                        name="stationDetails.currentOMC"
                        value={values.stationDetails?.currentOMC}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="4B. Current Operating OMC"
                        labelPlacement="outside"
                        placeholder="Type OMC"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="stationDetails.debtWithOMC"
                        value={values.stationDetails?.debtWithOMC}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="4C. Debt with operating OMC"
                        labelPlacement="outside"
                        placeholder="Type debt with OMC"
                        error={
                          touched.stationDetails
                            ? errors.stationDetails
                            : undefined
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                    <div>
                      <Input
                        type="text"
                        name="stationDetails.tankCapacity.diesel"
                        value={values.stationDetails?.tankCapacity.diesel}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="4D. Tank capacity(Diesel)"
                        labelPlacement="outside"
                        placeholder="Type diesel capacity."
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="stationDetails.tankCapacity.super"
                        value={values.stationDetails?.tankCapacity.super}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="4D. Tank capacity(Super)"
                        labelPlacement="outside"
                        placeholder="Type super capacity."
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
                <div>
                  <Input
                    type="text"
                    name="projectedVolume"
                    value={values.projectedVolume}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="5. Projected Volume per month"
                    labelPlacement="outside"
                    placeholder="Type projected volume.."
                  />
                </div>
              </div>

              <div className="mb-2">Lease:</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div>
                  <Input
                    type="text"
                    name="lease.years"
                    value={values.lease?.years}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="6A. How many years"
                    labelPlacement="outside"
                    placeholder="Type years.."
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="lease.remaining"
                    value={values.lease?.remaining}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="6B. Remaining Lease Period"
                    labelPlacement="outside"
                    placeholder="Type remaining period"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="text"
                    name="loadingLocation"
                    value={values.loadingLocation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="7A. Loading Location"
                    labelPlacement="outside"
                    placeholder="Type location"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="distance"
                    value={values.distance}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="7B. Distance"
                    labelPlacement="outside"
                    placeholder="Type distance.."
                  />
                </div>
              </div>

              <div className="my-5">
                <RadioButton
                  name="decision"
                  size="md"
                  label="8. Decision"
                  orientation="horizontal"
                  options={[
                    { title: "Accept", value: "accept" },
                    { title: "Reject", value: "reject" },
                  ]}
                  value={values.decision}
                  onBlur={handleBlur}
                  error={touched.decision ? errors.decision : undefined}
                  onValueChange={(v) => {
                    setFieldValue("decision", v);
                    console.log(v);
                  }}
                />
              </div>

              <div className="mb-5">
                <TextArea
                  name="reason"
                  value={values.reason}
                  label={<span>9. Reason for Acceptance or Rejection</span>}
                  placeholder="Give your reason here.."
                  onChange={handleChange}
                  minRows={10}
                  onBlur={handleBlur}
                  isRequired
                />
              </div>

              <div className="flex justify-end mt-5">
                <Button
                  color="primary"
                  onPress={onNext}
                  size="lg"
                  radius="md"
                  endContent={<FaArrowRight />}
                >
                  Next
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SectionA;
