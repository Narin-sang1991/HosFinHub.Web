import type { PatientDetailModel } from "@/store/patient/patientModel";
import type { DrugModel, InvoiceDrugEditorModel } from "@/store/patient/drugModel";
import type { InsureDetailModel } from "@/store/financial/insureModel";
import type {
  InvoiceModel,
  InvoiceItemModel,
  InvoiceEditorModel,
} from "@/store/financial/invoiceModel";
import {
  AdditionalPaymentModel,
  AdditPaymentModelEditorModel,
} from "@/store/free-additional/additionalModel";

export interface OpdEditorModel {
  opd: OpdDetailModel;
  patient: PatientDetailModel;
  insureItems: InsureDetailModel[];
  additPayments: AdditPaymentModelEditorModel[];
  aer: any[];
  cht: InvoiceModel[];
  invoiceItems: InvoiceEditorModel[];
  drugItems: InvoiceDrugEditorModel[];
}

export interface OpdValids {
  an: string;
  code_error: string;
  code_error_descriptions: string;
  did: string;
  didname: string;
  file: string;
  hn: string;
  id: string;
  seq: string;
}
export interface OpdValidModel {
  opd: OpdValids[];
  pat: OpdValids[];
  ins: OpdValids[];
  adp: OpdValids[];
  aer: OpdValids[];
  cht: OpdValids[];
  cha: OpdValids[];
  dru: OpdValids[];
  labfu: OpdValids[];
  odx: OpdValids[];
  oop: OpdValids[];
  orf: OpdValids[];
}

export interface OpdResponeModel {
  opd: OpdDetailModel[];
  pat: PatientDetailModel[];
  ins: InsureDetailModel[];
  adp: AdditionalPaymentModel[];
  aer: any[];
  cht: InvoiceModel[];
  cha: InvoiceItemModel[];
  dru: DrugModel[];
}

export interface OpdResponst {
  data: OpdResponeModel;
  error: Array<OpdValidModel>;
}
export interface OpdDetailModel {
  id: string; // unique key of data
  hn: string; // patient number
  clinic: string; // code of clinic or service point
  dateopd: Date;
  timeopd: string;
  uuc: number;
  seq: number; // transaction key
  detail?: string;

  /**
   * #Description => Body's temperature of patient;
   * unit => °C
   **/
  btemp?: number;

  /**
   * #Description => Systolic blood pressure;
   * unit => mmHg
   **/
  sbp?: number;

  /**
   * #Description => Diastolic blood pressure;
   * unit => mmHg
   **/
  dbp?: number;

  /**
   * #Description => Pulse rate or heart rate;
   * unit => per minute
   **/
  pr?: number;

  /**
   * #Description => Respiratory rate;
   * unit => per minute
   **/
  rr?: number;

  /**
   * #Description => Type of service provider;
   * #Remind =>
   * Refer-In-Network-Zone: 0,
   * Refer-Out-Network-Zone: 1,
   * AE-In-Network-Account: 2,
   * AE-Out-Network-Account: 3,
   * OP-Handicapped: 4,
   * OP-Self-Patient-Card: 5,
   * Clearing-House: 6,
   * OP-Other(Individual data): 7,
   * Patient-OP-or-IP(NONI):8 ,
   * Thai-Service: 9,
   **/
  optype?: number;

  /**
   * #Description => Type of visit patient;
   * Walk-in: 1,
   * Appointment: 2,
   * Refer-in: 3,
   * EMS-in: 4,
   **/
  typein: number;

  /**
   * #Description => Status of patient as discharge;
   * Discharge: 1,
   * Admit: 2,
   * Refer-out: 3,
   * Death-in-hospital: 4,
   * Death-before-arrive: 5,
   * Death-in-Refer: 6,
   * Reject-to-heal: 7,
   * Escape: 8,
   **/
  typeout: number;
}
