import Button from "./Button";
import { FaArrowRight } from "react-icons/fa";
import { ISectionA } from "@/resources/states";
import { Formik } from "formik";
import * as Yup from "yup";
import RadioButton from "./RadioButton";
import Input from "./Input";
import Autocomplete from "./Autocomplete";
import { fetchDistricts } from "@/utils/fetchDistricts";
import { Spinner } from "@heroui/react";
import { regionCodes } from "@/resources/codes";
import { useState } from "react";

interface ISectionAProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  initData?: ISectionA;
  onComplete?: (data: ISectionA) => void;
}

const SectionA = ({ onNext, initData }: ISectionAProps) => {
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegionSelection = async (regionCode: any) => {
    // Set region value

    if (regionCode) {
      setLoadingDistricts(true);
      try {
        const data = await fetchDistricts(regionCode);
        setDistricts(data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    } else {
      setDistricts([]);
    }
  };

  return (
    <div className="space-y-6">
      <Formik
        initialValues={{ ...initData }}
        validateOnBlur
        validateOnChange={false}
        validationSchema={Yup.object({})}
        onSubmit={async () => {
          // onComplete(values);
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
          console.log("answeer", values.location?.region);
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
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
                <Autocomplete
                  name="location.region"
                  value={values.location?.region}
                  onInputChange={(value) => {
                    console.log("value", value);
                    setFieldValue("location.region", value);
                    // setSelectedRegion(value)
                  }}
                  onSelectionChanege={handleRegionSelection}
                  label="Select a region"
                  items={Object.entries(regionCodes).map(([code, name]) => ({
                    key: code,
                    label: name,
                    description: `Code: ${code}`,
                  }))}
                  labelPlacement="outside"
                  size="lg"
                  isRequired
                  onChange={handleChange}
                  onBlur={handleBlur}
                  radius="sm"
                  placeholder="select a region"
                  error={touched.location ? errors.location : undefined}
                  inputValue={values.location?.region}
                />
                <div>
                  <Autocomplete
                    name="location.district"
                    value={values.location?.district}
                    onInputChange={(value) =>
                      setFieldValue("location.district", value)
                    }
                    onSelectionChanege={(id) => {
                      console.log(id);
                    }}
                    label="District"
                    items={districts}
                    labelPlacement="outside"
                    placeholder={
                      loadingDistricts
                        ? "Loading districts..."
                        : "Select district"
                    }
                    size="lg"
                    isRequired
                    onChange={handleChange}
                    onBlur={handleBlur}
                    radius="sm"
                    endContent={loadingDistricts ? <Spinner size="sm" /> : null}
                    inputValue={values.location?.district}
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
                      label="Station Type"
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
                        label="Current Operating OMC"
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
                        label="Debt with operating OMC"
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
                        label="Tank capacity(Diesel)"
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
                        label="Tank capacity(Super)"
                        labelPlacement="outside"
                        placeholder="Type super capacity."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
                    <div>
                      <Input
                        type="text"
                        name="projectedVolume"
                        value={values.projectedVolume}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Projected Volume per month"
                        labelPlacement="outside"
                        placeholder="Type projected volume.."
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
                        label="Loading Location"
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
                        label="Distance"
                        labelPlacement="outside"
                        placeholder="Type distance.."
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="my-2">Lease:</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div>
                  <Input
                    type="text"
                    name="lease.years"
                    value={values.lease?.years}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="How many years"
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
                    label="Remaining Lease Period"
                    labelPlacement="outside"
                    placeholder="Type remaining period"
                  />
                </div>
              </div>
{/* 
              <div className="my-5">
                <RadioButton
                  name="decision"
                  size="md"
                  label="Decision"
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
                  }}
                />
              </div> */}
{/* 
              <div className="mb-5">
                <TextArea
                  name="reason"
                  value={values.reason}
                  label={<span>Reason for Acceptance or Rejection</span>}
                  placeholder="Give your reason here.."
                  onChange={handleChange}
                  minRows={10}
                  onBlur={handleBlur}
                  isRequired
                />
              </div> */}

              <div className="flex justify-end mt-5">
                <Button
                  color="primary"
                  onPress={() => {
                    onNext(values);
                    console.log("values", values)
                  }}
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
