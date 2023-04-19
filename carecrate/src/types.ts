/**
 * A list of custom types to be used throught the application
 */
import { User } from 'next-auth';
import { Session as NextAuthSession } from "next-auth";

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

export type Waste = {
  timeOfWaste: string;
  lbs: number;
};

export interface WorkspaceUser extends User {
  id: string;
  workspaceId: number;
  name: string;
  email: string;
  role: string;
}

export interface WorkspaceCredentials {
  workspace: string;
  email: string;
  password: string;
}

export interface SessionUser extends User {
  id: string;
  workspaceId: string;
  role: string;
}