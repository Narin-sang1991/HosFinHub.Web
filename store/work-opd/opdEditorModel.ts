import type { PatientDetailModel } from "@/store/patient/patientModel";
import type { InvoiceDrugModel, InvoiceDrugEditorModel } from "@/store/financial/invoiceDrugModel";
import type { InsureDetailModel } from "@/store/financial/insureModel";
import type { InvoiceModel, } from "@/store/financial/invoiceModel";
import type { InvoiceItemModel, InvoiceItemEditorModel } from "@/store/financial/invoiceItemModel";
import { OpdDianosisModel } from "../dianosis/dianosisModel";
import { LabfuModel } from "../medical-tech/labfuModel";
import { AccidentEmergencyModel } from "../refer/accidentEmergencyModel";
import { OpdReferModel } from "../refer/referModel";
import { AdditionalPaymentModel, AdditPaymentModelEditorModel } from "../fee-additional/additionalModel";
import { OpdOperationModel } from '@/store/operation/operationModel'
import { WorkValidModel } from "../work/workValidModel";

export interface OpdEditorModel {

  /**
   * #origin => ADP
   **/
  additPayments: AdditPaymentModelEditorModel[];

  /**
   * #origin => AER
   **/
  accidenEmergencies: AccidentEmergencyModel[];

  /**
  * #origin => CHT
  **/
  invoices: InvoiceModel[];

  /**
   * #origin => CHA
   **/
  invoiceItems: InvoiceItemEditorModel[];

  /**
  * #origin => DRU
  **/
  drugItems: InvoiceDrugEditorModel[];

  /**
  * #origin => INS
  **/
  insureItems: InsureDetailModel[];

  /**
  * #origin => LABFU
  **/
  labfuItems: LabfuModel[];

  /**
  * #origin => ODX
  **/
  diagnosisItems: OpdDianosisModel[],

  /**
  * #origin => OPD
  **/
  opdDetail: OpdDetailModel;

  /**
  * #origin => ORF
  **/
  opdRefer: OpdReferModel;

  /**
  * #origin => PAT
  **/
  patient: PatientDetailModel;

  /**
 * #origin => OOP
 **/
  procedureItems: OpdOperationModel[];

  accidenEmergencyRefer: {
    accidenEmergencyItems?: AccidentEmergencyModel[],
    insRefercl?: string,
    referType?: string,
    referDate?: string,
  };
}

export interface OpdValidModel {
  opd: WorkValidModel[];
  pat: WorkValidModel[];
  ins: WorkValidModel[];
  adp: WorkValidModel[];
  aer: WorkValidModel[];
  cht: WorkValidModel[];
  cha: WorkValidModel[];
  dru: WorkValidModel[];
  labfu: WorkValidModel[];
  odx: WorkValidModel[];
  oop: WorkValidModel[];
  orf: WorkValidModel[];
}

export interface OpdDataModel {
  adp: AdditionalPaymentModel[];
  aer: AccidentEmergencyModel[];
  cha: InvoiceItemModel[];
  cht: InvoiceModel[];
  dru: InvoiceDrugModel[];
  ins: InsureDetailModel[];
  labfu: LabfuModel[];
  odx: OpdDianosisModel[],
  oop: OpdOperationModel[],
  opd: OpdDetailModel[];
  orf: OpdReferModel[];
  pat: PatientDetailModel[];
}

export interface OpdResponse {
  data: OpdDataModel;
  error: Array<OpdValidModel>;
}
export interface OpdDetailModel {
  id: string; // unique key of data
  hn: string; // patient number
  clinic: string; // code of clinic or service point
  dateopd: Date;
  timeopd: string;
  uuc: string;
  seq: string; // transaction key
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


export function instanceOfOpdDetail(object: any): object is OpdDetailModel {
  return true;
}
export function instanceOfOpdValid(object: any): object is OpdValidModel {
  return true;
}
export function instanceOfOpdValids(object: any): object is OpdValidModel[] {
  return true;
}
