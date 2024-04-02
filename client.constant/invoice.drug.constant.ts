import type { DrugModel, DrugEditorModel } from "@/store/patient/drugModel";

export function genarateDrugEditors(drugItems: DrugModel[]) {
    let results: DrugEditorModel[] = [];
    drugItems.forEach((drugItem, i) => {
        let dummyKey: number = i + 1;
        let data: DrugEditorModel = {
            ...drugItem,
            dummyKey,
            idDurty: false,
            status: 2,
        }
        results.push(data);
    });
    return results;
}