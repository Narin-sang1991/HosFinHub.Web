import { IpdDetailModel, instanceOfIpdDetail } from "@/store/work-ipd/ipdEditorModel";
import { OpdDetailModel, instanceOfOpdDetail } from "@/store/work-opd/opdEditorModel";
import { VisitDetailModel } from "@/store/work/workEditorModel";

const defaultStrEmpty: string = "ไม่สามารถระบุได้";

export function getVisitDetail(visitDetail: any, isIPD: boolean): VisitDetailModel {
    let result: VisitDetailModel | undefined = undefined;
    console.log();


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

export const clinicAllItems = [
    { prefixKey: '000', text: "รายละเอียดหน่วยงานระดับสถานีอนามัย และศูนย์สุขภาพชุมชน(ยกเว้น PCU ที่อยู่ในรพ.)" },
    { prefixKey: '001', text: "อายุรกรรม" },
    { prefixKey: '002', text: "ศัลยกรรม" },
    { prefixKey: '003', text: "สูติกรรม" },
    { prefixKey: '004', text: "นรีเวชกรรม" },
    { prefixKey: '005', text: "กุมารเวชกรรม" },
    { prefixKey: '006', text: "โสด ศอ นาสัก" },
    { prefixKey: '007', text: "จักษุวิทยา" },
    { prefixKey: '008', text: "ศัลยกรรมออร์โธปี้ดิกส์" },
    { prefixKey: '009', text: "จิตเวช" },
    { prefixKey: '010', text: "รังสีวิทยา" },
    { prefixKey: '011', text: "ทันตกรรม" },
    { prefixKey: '012', text: "เวชศาสตร์ฉุกเฉินและนิติเวช" },
    { prefixKey: '013', text: "เวชกรรมฟื้นฟู" },
    { prefixKey: '014', text: "แพทย์แผนไทย" },
    { prefixKey: '015', text: "PCU ใน รพ." },
    { prefixKey: '016', text: "เวชกรรมปฏิบัติทั่วไป" },
    { prefixKey: '017', text: "เวชศาสตร์ครอบครัวและ ชุมชน" },
    { prefixKey: '018', text: "อาชีวคลินิก" },
    { prefixKey: '019', text: "วิสัญญีวิทยา(คลินิกระงับปวด)" },
    { prefixKey: '020', text: "ศัลยกรรมประสาท" },
    { prefixKey: '021', text: "อาชีวเวชรกรรม" },
    { prefixKey: '022', text: "เวชกรรมสังคม" },
    { prefixKey: '023', text: "พยาธิวิทยากายวิภาค" },
    { prefixKey: '024', text: "พยาธิวิทยาคลินิค" },
    { prefixKey: '025', text: "แพทย์ทางเลือก" },
    { prefixKey: '99', text: "อื่นๆ" },
];
export function getClinic(clinicCode?: string) {
    if (clinicCode == undefined || !clinicCode) return defaultStrEmpty;

    let clinic = clinicAllItems.find(t => clinicCode.startsWith(t.prefixKey));
    if (clinic != undefined) return clinic.text;
    else return defaultStrEmpty;
}

export function getReferType(referType?: string) {
    if (referType == undefined || !referType) return defaultStrEmpty;

    if (referType == '1') return 'รับเข้า';
    if (referType == '2') return 'ส่งออก';

    return defaultStrEmpty;
}