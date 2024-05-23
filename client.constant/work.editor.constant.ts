import { IpdDetailModel, instanceOfIpdDetail } from "@/store/work-ipd/ipdEditorModel";
import { OpdDetailModel, instanceOfOpdDetail } from "@/store/work-opd/opdEditorModel";
import { VisitDetailModel } from "@/store/work/workEditorModel";


export function getVisitDetail(visitDetail: any, isIPD: boolean): VisitDetailModel {
    let result: VisitDetailModel | undefined = undefined;

    if (isIPD) {
        let visitData = visitDetail as IpdDetailModel;
        const wardNo = (visitDetail as IpdDetailModel).dept;
        result = {
            hn: visitData.hn,
            seq: "",
            an: visitData.an,
            clinic: `1${wardNo}00`,
            isIPD: true,
            visitDate: visitData.datedsc,
        };
    } else {
        let visitData = visitDetail as OpdDetailModel;
        result = {
            hn: visitData.hn,
            seq: visitData.seq,
            an: "",
            clinic: (visitDetail as OpdDetailModel)?.clinic || "09900",
            isIPD: false,
            visitDate: visitData.dateopd,
        };
    }

    if (result == undefined) result = {
        hn: "",
        seq: "",
        an: "",
        clinic: "",
        isIPD: false,
        visitDate: new Date,
    }

    return result;
}