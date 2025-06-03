"use client";
import LandStationAcquisitionForm from "@/components/LandStationAcquisitionForm";
import { LandAcquisition } from "@/resources/states";
import useAxios from "@/utils/useAxios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";

const LandAcquisitionEditPage = () => {
  const [landAcquisitionData, setLandAcquisitionData] = useState<LandAcquisition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useAxios();
  const params = useParams();

  useEffect(() => {
    const fetchLandAcquisition = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`land-acquisitions/${params.id}/`);
        setLandAcquisitionData(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch land acquisition data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandAcquisition();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transform API data to form inputs
  const transformToSectionA = (data: LandAcquisition) => ({
    propertyType: data.propertyType,
    location: {
      region: data.locationRegion,
      district: data.locationDistrict,
      road: data.locationRoad
    },
    landDetails: {
      size: data.landSize || "",
      value: data.landValue || ""
    },
    stationDetails: {
      type: data.stationType || "",
      currentOMC: data.stationCurrentOMC || "",
      debtWithOMC: data.stationDebtWithOMC || "",
      tankCapacity: {
        diesel: data.stationTankCapacityDiesel || "",
        super: data.stationTankCapacitySuper || ""
      }
    },
    projectedVolume: data.projectedVolume || "",
    lease: {
      years: data.leaseYears || "",
      remaining: data.leaseRemaining || ""
    },
    loadingLocation: data.loadingLocation || "",
    distance: data.distance || "",
    decision: data.decision || "",
    reason: data.reason || "",
    originator: data.originator || "",
    distributionManager: data.distributionManager || "",
    position: data.position || "",
    approvals: {
      generalManager: "",
      managingDirector: "",
      gmDate: "",
      mdDate: ""
    }
  });

  const transformToSectionB = (data: LandAcquisition) => ({
    civilWorks: {
      estimatedCost: data.civilWorksEstimatedCost || "",
      forecourt: {
        required: data.civilWorksForecourtRequired || "",
        comment: data.civilWorksForecourtComment || ""
      },
      building: {
        required: data.civilWorksBuildingRequired || "",
        comment: data.civilWorksBuildingComment || ""
      },
      canopy: {
        required: data.civilWorksCanopyRequired || "",
        comment: data.civilWorksCanopyComment || ""
      },
      tankFarm: {
        required: data.civilWorksTankFarmRequired || "",
        comment: data.civilWorksTankFarmComment || ""
      },
      electricals: {
        required: data.civilWorksElectricalsRequired || "",
        comment: data.civilWorksElectricalsComment || ""
      },
      interceptor: {
        status: data.civilWorksInterceptorStatus || "",
        functional: data.civilWorksInterceptorFunctional || ""
      },
      vents: {
        status: data.civilWorksVentsStatus || "",
        functional: data.civilWorksVentsFunctional || ""
      },
      otherWorks: data.civilWorksOtherWorks || ""
    },
    logistics: data.logistics || [],
    totalEstimatedCost: data.totalEstimatedCost || ""
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-32 w-full mt-6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium">Error loading data</h3>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!landAcquisitionData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p>No land acquisition data found</p>
      </div>
    );
  }

  return (
    <LandStationAcquisitionForm 
      sectionAInitData={transformToSectionA(landAcquisitionData)}
      sectionBInitData={transformToSectionB(landAcquisitionData)}
    //   isEditMode={true}
    //   acquisitionId={params.id as string}
    />
  );
};

export default LandAcquisitionEditPage;