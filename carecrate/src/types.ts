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
  visits: string[];
};

export type Visit = {
  id: number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  foodWeight: number;
  checkInType: string;
  timeOfVisit: string;
};

export type Volunteer = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  lastVolunteerDate: Date;
};

export type Weight = {
  weight: number;
};
