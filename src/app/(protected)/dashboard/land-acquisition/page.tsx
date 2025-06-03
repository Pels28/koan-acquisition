import LandStationAcquisitionForm from "@/components/LandStationAcquisitionForm";

export default function LandAcquisitionPage() {
  return (
    <LandStationAcquisitionForm
      sectionAInitData={{
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
      }}
      sectionBInitData={{
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
      }}
    />
  );
}
