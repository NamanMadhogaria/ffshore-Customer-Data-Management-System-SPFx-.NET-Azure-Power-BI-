import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';

export interface IRigProps {
  description: string;
  listName: string;
  siteUrl: string;
  sp: SPFI;
  context: WebPartContext;
}

export interface Customer {
  Id?: number;
  CustomerName: string;
  Address: string;
  NumberofRigs: number;
  NumberofJackUps: number;
  NumberofMODU_x2019_s: number;
  SiteURLs: { Url: string };
}