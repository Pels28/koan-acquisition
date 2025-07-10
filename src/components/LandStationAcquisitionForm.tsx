"use client";
import { useEffect, useRef, useState } from "react";
import SectionB from "./SectionB";
import SectionA from "./SectionA";
import { Stepper } from "./Stepper";
import { ISectionA, ISectionB } from "@/resources/states";
import { useParams, useRouter } from "next/navigation";
import useModal from "@/hooks/modalHook";
import useAxios from "@/utils/useAxios";
import swal from "sweetalert2";

interface LandStationAcquisitionFormProps {
  sectionAInitData: ISectionA;
  sectionBInitData: ISectionB;
}

const LandStationAcquisitionForm = ({
  sectionAInitData,
  sectionBInitData,
}: LandStationAcquisitionFormProps) => {
  const router = useRouter();
  const api = useAxios();
  const params = useParams();
  const [sectionAFormData, setSectionAFormData] =
    useState<ISectionA>(sectionAInitData);

  const [sectionBFormData, setSectionBFormData] = useState<ISectionB>(

    sectionBInitData
  );

  const [activeStep, setActiveStep] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const { Modal, showLoadingScreen } = useModal();

  useEffect(() => {
    // Scroll to header whenever step changes
    if (headerRef.current) {
      headerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeStep]);

  const nextStep = (data: ISectionA) => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
      // scrollContainerToTop();
    }

    setSectionAFormData(data);
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      // scrollContainerToTop();
    }
  };

  const submitForm = async (sectionA: ISectionA, sectionB: ISectionB) => {
    showLoadingScreen();

    try {
      // Transform data to match backend model
      const payload = {
        propertyType: sectionA.propertyType,
        locationRegion: sectionA.location?.region || "",
        locationDistrict: sectionA.location?.district || "",
        locationRoad: sectionA.location?.road || "",

        // Land-specific fields
        landSize:
          sectionA.propertyType === "land" ? sectionA.landDetails?.size : null,
        landValue:
          sectionA.propertyType === "land" ? sectionA.landDetails?.value : null,

        // Station-specific fields
        stationType:
          sectionA.propertyType === "station"
            ? sectionA.stationDetails?.type
            : null,
        stationCurrentOMC:
          sectionA.propertyType === "station"
            ? sectionA.stationDetails?.currentOMC
            : null,
        stationDebtWithOMC:
          sectionA.propertyType === "station"
            ? sectionA.stationDetails?.debtWithOMC
            : null,
        stationTankCapacityDiesel:
          sectionA.propertyType === "station"
            ? sectionA.stationDetails?.tankCapacity?.diesel
            : null,
        stationTankCapacitySuper:
          sectionA.propertyType === "station"
            ? sectionA.stationDetails?.tankCapacity?.super
            : null,

        projectedVolume: sectionA.projectedVolume,
        leaseYears: sectionA.lease?.years || "",
        leaseRemaining: sectionA.lease?.remaining || "",
        loadingLocation: sectionA.loadingLocation,
        distance: sectionA.distance,
        // decision: sectionA.decision,
        // reason: sectionA.reason,
        originator: sectionA.originator,
        distributionManager: sectionA.distributionManager,
        position: sectionA.position,

        // Section B
        civilWorksEstimatedCost: sectionB.civilWorks?.estimatedCost || "",
        civilWorksForecourtRequired:
          sectionB.civilWorks?.forecourt?.required || "",
        civilWorksForecourtComment:
          sectionB.civilWorks?.forecourt?.comment || "",
        civilWorksBuildingRequired:
          sectionB.civilWorks?.building?.required || "",
        civilWorksBuildingComment: sectionB.civilWorks?.building?.comment || "",
        civilWorksCanopyRequired: sectionB.civilWorks?.canopy?.required || "",
        civilWorksCanopyComment: sectionB.civilWorks?.canopy?.comment || "",
        civilWorksTankFarmRequired:
          sectionB.civilWorks?.tankFarm?.required || "",
        civilWorksTankFarmComment: sectionB.civilWorks?.tankFarm?.comment || "",
        civilWorksElectricalsRequired:
          sectionB.civilWorks?.electricals?.required || "",
        civilWorksElectricalsComment:
          sectionB.civilWorks?.electricals?.comment || "",
        civilWorksInterceptorStatus:
          sectionB.civilWorks?.interceptor?.status || "",
        civilWorksInterceptorFunctional:
          sectionB.civilWorks?.interceptor?.functional || "",
        civilWorksVentsStatus: sectionB.civilWorks?.vents?.status || "",
        civilWorksVentsFunctional: sectionB.civilWorks?.vents?.functional || "",
        civilWorksOtherWorks: sectionB.civilWorks?.otherWorks || "",

        logistics: sectionB.logistics || [],
        totalEstimatedCost: sectionB.totalEstimatedCost || "",
      };

      if (params.id) {
        await api.patch(`land-acquisitions/${params.id}/`, payload);
        swal.fire({
          title: "Updated Successfully",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        router.push(`/dashboard/report/land-acquisitions/`);
      } else {
        const response = await api.post("land-acquisitions/", payload);
        swal.fire({
          title: "Created Successfully",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        router.push(`/dashboard/report/land-acquisitions/${response.data.id}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      // Handle error (show error message)
      if (params.id) {
        swal.fire({
          title: "update failed",
          icon: "error",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        swal.fire({
          title: "Submission failed",
          icon: "error",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  };

  const STEPS = [
    <SectionA
      key="section-a"
      initData={sectionAFormData}
      onNext={(data) => nextStep(data)}
      // onComplete={(data) => {
      //   setSectionAFormData(data);
      // }}
    />,
    <SectionB
      key="section-b"
      initData={sectionBFormData}
      onPrevious={prevStep}
      onComplete={(data) => {
        showLoadingScreen();
        setSectionBFormData(data);
        submitForm(sectionAFormData, data);
        router.push("/dashboard/report/land-acquisitions/1");
      }}
    />,
  ];



  return (
    <div className="max-w-4xl  mx-auto p-6 bg-white rounded-lg shadow-md font-montserrat">
      <div ref={headerRef} className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          LAND / STATION ACQUISITION FORM
        </h1>
     
      </div>

      <Stepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        disableSwitchOnclick
        steps={[
          {
            label: "Section A",
          },
          {
            label: "Section B",
          },
        ]}
      />

      <div
        // ref={containerRef}
        className=" pr-1"
      >
        <div>{STEPS[activeStep]}</div>
      </div>
      <Modal />
    </div>
  );
};

export default LandStationAcquisitionForm;
