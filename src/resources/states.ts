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
      comment: "";
    };
    building: {
      required: string;
      comment: "";
    };
    canopy: {
      required:string;
      comment: "";
    };
    tankFarm: {
      required: string;
      comment: "";
    };
    electricals: {
      required: string;
      comment: "";
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

