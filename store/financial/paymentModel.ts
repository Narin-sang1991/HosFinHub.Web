export interface InvoiceModel {
  id: string; // unique key of data
  hn: string; // patient number
  an?: string; // admit number
  date: Date; // start date or discharge date or insurance change date
  total: number; // total of payment
  paid: number; // paid
  pttype: number;
  person_id: string; // id of person
  seq: number; // transaction key
  opd_memo?: string;
  invoice_no?: string; // invoice number
  invoice_lt?: string; // invoice number of service point
}

export interface InvoiceItemModel {
  id: string; // unique key of data
  hn: string; // patient number
  an?: string; // admit number
  date: Date; // start date or discharge date or insurance change date
  chrgitem: string; // code of payment method in announcement
  amount: number; // amount of invoice item
  person_id: string; // id of person
  seq: number; // transaction key
}

export interface InvoiceEditorModel {
  id: string; // unique key of data
  seq: number; // transaction key
  dummyKey: number; // dummy key for UI component
  idDurty: boolean;
  totalAmount: number;
  overAmount: number;
  approvedAmount: number;
  chargeCode: string;
  chargeDetail: string;
  status: number;
  valid?: any[];
}

export interface AdditionalPaymentModel {
  id: string; // unique key of data
  hn: string; // patient number
  an?: string; // admit number
  dateopd: Date;
  type: string;
  code: string;
  qty: number;
  rate: number;
  seq: number; // transaction key
  cagcode?: string;
  dose?: string;
  ca_type?: number;
  serialno?: string;
  totcopay: number = 0.0; // total amount of exclude cliaming
  use_status?: string;
  total: number;
  tmltcode?: string;
  status1?: string;
  bi?: string;
  clinic: string; // code of clinic or service point
  itemsrc: number;
  provider?: string;
  gravida?: string;
  ga_week?: string;
  dcip_e_screen?: string;
  lmp?: string;
}
