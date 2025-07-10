/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISectionA {
  propertyType: string;
  location: {
    region: string;
    district: string;
    road: string;
  };
  landDetails: {
    size: string;
    value: string;
  };
  stationDetails: {
    type: string;
    currentOMC: string;
    debtWithOMC: string;
    tankCapacity: {
      diesel: string;
      super: string;
    };
  };
  projectedVolume: string;
  lease: {
    years: string;
    remaining: string;
  };
  loadingLocation: string;
  distance: string;
  decision: string;
  reason: string;
  originator: string;
  distributionManager: string;
  position: string;
  approvals: {
    generalManager: string;
    managingDirector: string;
    gmDate: string;
    mdDate: string;
  };


}

export interface ISectionB {
  civilWorks: {
    estimatedCost: string;
    forecourt: {
      required: string;
      comment: string;
    };
    building: {
      required: string;
      comment: string;
    };
    canopy: {
      required:string;
      comment: string;
    };
    tankFarm: {
      required: string;
      comment: string;
    };
    electricals: {
      required: string;
      comment: string;
    };
    interceptor: {
      status: string;
      functional: string;
    };
    vents: {
      status: string;
      functional:string;
    };
    otherWorks: string;
  };

  logistics: Array<string>;
  totalEstimatedCost: string;
}

export type CivilWorkKey = 'forecourt' | 'building' | 'canopy' | 'tankFarm' | 'electricals';

export interface LandAcquisition {
  id: number;
  propertyType: string;
  locationRegion: string;
  locationDistrict: string;
  locationRoad: string;
  landSize: string;
  landValue: string;
  stationType: string | null;
  stationCurrentOMC: string | null;
  stationDebtWithOMC: string | null;
  stationTankCapacityDiesel: string | null;
  stationTankCapacitySuper: string | null;
  projectedVolume: string;
  leaseYears: string;
  leaseRemaining: string;
  loadingLocation: string;
  distance: string;
  decision: string;
  reason: string;
  originator: string;
  distributionManager: string;
  position: string;
  civilWorksEstimatedCost: string;
  civilWorksForecourtRequired: string;
  civilWorksForecourtComment: string;
  civilWorksBuildingRequired: string;
  civilWorksBuildingComment: string;
  civilWorksCanopyRequired: string;
  civilWorksCanopyComment: string;
  civilWorksTankFarmRequired: string;
  civilWorksTankFarmComment: string;
  civilWorksElectricalsRequired: string;
  civilWorksElectricalsComment: string;
  civilWorksInterceptorStatus: string;
  civilWorksInterceptorFunctional: string;
  civilWorksVentsStatus: string;
  civilWorksVentsFunctional: string;
  civilWorksOtherWorks: string;
  logistics: string[];
  totalEstimatedCost: string;
  created_at: string;
  updated_at: string;
  user: number;
  review_status: string
  review_date?: string
  review_notes?: string
  reviewed_by: any
}

