/**
 * A list of custom types to be used throught the application
 */

export type Family = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  numInHousehold: number;
  numChildren: number;
  numElderly: number;
  // Add Visits array
};

export type Visit = {
  visitId: string;
  phoneNumber: string;
  foodWeight: number;
  checkInType: string;
  timestamp: Date;
};

export type Volunteer = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  lastVolunteerDate: Date;
};
