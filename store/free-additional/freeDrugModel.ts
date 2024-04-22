
export interface FreeDrugModel {
    id: string; // unique key of data
    gpuid: string;
    generic_name: string;
    strength: string;
    dosageform: string;
    contvalue?: string;
    contunit?: string;
    disp_unit: string;
    price: string;
}


export interface FreeDrugSelectorModel {
    id: string; // unique key of data
    code: string;
    name?: string;
    unitPrice: string;
}