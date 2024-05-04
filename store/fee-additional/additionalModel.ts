
import { OpdValids } from "../work-opd/opdEditorModel";
import { FeeDrugSelectorModel } from "./feeDrugModel";
import { FeeScheduleSelectorModel } from "./feeScheduleModel";


export interface AdditionalPaymentModel {
    id: string; // unique key of data
    hn: string; // patient number
    an?: string; // admit number
    dateopd: Date;
    type: string;
    code: string;
    qty: number;
    rate: number;
    seq: string; // transaction key
    cagcode?: string;
    dose?: string;
    ca_type?: string;
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
    qtyday?: number;
}

export interface AdditPaymentModelEditorModel extends AdditionalPaymentModel {
    dummyKey: number; // dummy key for UI component
    isDurty: boolean;
    feeDrug?: FeeDrugSelectorModel,
    feeSchedule?: FeeScheduleSelectorModel,
    feeEditor: FeeDrugSelectorModel | FeeScheduleSelectorModel,
    typeDisplay?: string;
    typeEditor: { id: string, text: string },
    isFeeDrug: boolean;
    hasError: boolean;
    validError?: OpdValids[];
}
