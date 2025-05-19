"use client";
import { useEffect, useRef, useState } from "react";
import SectionB from "./SectionB";
import SectionA from "./SectionA";
import { Stepper } from "./Stepper";
import { ISectionA, ISectionB } from "@/resources/states";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/modalHook";

const LandStationAcquisitionForm = () => {
  const router = useRouter();
  const [sectionAFormData] = useState<ISectionA>({
    // Section A

    propertyType: "land",
    location: {
      region: "",
      district: "",
      road: "",
    },
    landDetails: {
      size: "",
      value: "",
    },
    stationDetails: {
      type: "",
      currentOMC: "",
      debtWithOMC: "",
      tankCapacity: {
        diesel: "",
        super: "",
      },
    },
    projectedVolume: "",
    lease: {
      years: "",
      remaining: "",
    },
    loadingLocation: "",
    distance: "",
    decision: "",
    reason: "",
    originator: "",
    distributionManager: "",
    position: "",
    approvals: {
      generalManager: "",
      managingDirector: "",
      gmDate: "",
      mdDate: "",
    },

    // Section B
  });

  const [sectionBFormData] = useState<ISectionB>({
    civilWorks: {
      estimatedCost: "",
      forecourt: { required: "", comment: "" },
      building: { required: "", comment: "" },
      canopy: { required: "", comment: "" },
      tankFarm: { required: "", comment: "" },
      electricals: { required: "", comment: "" },
      interceptor: { status: "", functional: "" },
      vents: { status: "", functional: "" },
      otherWorks: "",
    },
    logistics: ["", "", "", "", "", ""],
    totalEstimatedCost: "",
  });

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

  // const scrollContainerToTop = () => {
  //   if (containerRef.current) {
  //     containerRef.current.scroll({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  const nextStep = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
      // scrollContainerToTop();
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      // scrollContainerToTop();
    }
  };

  const STEPS = [
    <SectionA key="section-a" initData={sectionAFormData} onNext={nextStep} />,
    <SectionB
      key="section-b"
      initData={sectionBFormData}
      onPrevious={prevStep}
      onComplete={() => {
        showLoadingScreen();
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
        <div className="mt-2 text-sm text-gray-500">
          [COMPANY ADDRESS AND LOGO]
        </div>
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
      <Modal/>
    </div>
  );
};

export default LandStationAcquisitionForm;
