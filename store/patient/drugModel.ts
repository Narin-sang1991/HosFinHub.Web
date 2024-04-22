import { OpdValids } from "../work-opd/opdEditorModel";

export interface DrugModel {
  id: string; // unique key of data
  hcode: string; // key of hospital
  hn: string; // patient number
  an?: string; // admit number
  clinic: string; // code of clinic or service point
  date_serv: Date; // start visit date in AD
  did: string; // code of medicine in clinic or service point
  didname: string; // name of medicine in clinic or service point
  amount: number; // amount of medicine
  drugprice: number; // price per unit
  drugcost: number; // cost per unit
  didstd: number; // key of medicine (24 digit)
  unit: string; // common unit of medicine
  unit_pack: string; // package unit of medicine
  seq: string; // transaction key
  drugremark: string;
  pa_no?: string; // permit number for special medicine using
  totcopay: number; // total amount of exclude cliaming
  use_status: number; // category of medicine using (internal:1, take-home:2, long-take-home:3, chronic-take-home:4)
  total: number; // total amount
  sigcode: string; // code of explain to medicine using
  sigtext: string; // text of explain to medicine using
  provider?: string;
}

export interface DrugEditorModel extends DrugModel {
  dummyKey: number; // dummy key for UI component
  totalreq: number;
  idDurty: boolean;
  hasError: boolean;
  validError?: OpdValids[];
}
