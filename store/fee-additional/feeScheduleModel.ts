
export interface FeeScheduleModel {
    id: string,
    item_code: string,
    item_name: string,
    unit: string,
    type: string,
    price: number,
}


export interface FeeScheduleSelectorModel {
    item_code: string,
    item_name: string,
    unit?: string,
    type?: string,
    price?: number,
}