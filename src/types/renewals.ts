export interface UpcomingRenewal {
  policyNumber: string;
  buildingName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  effectiveDate: string;
  expirationDate: string;
  daysToExpiration: number;
  annualPremium: number;
  openClaimCount: number;
}

export interface RenewalSummary {
  totalPolicies: number;
  totalAnnualPremium: number;
  policiesWithOpenClaims: number;
  averageDaysToExpiration: number;
}
