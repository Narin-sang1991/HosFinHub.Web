interface ServicePayment {
    chargeItemType: string[]
    paymentFileCode: string
    paymentName?: string
}

export const allServicePayment: ServicePayment[] = [
    {
        paymentName: "ค่าห้อง/ค่าอาหาร",
        paymentFileCode: "1",
        chargeItemType: ["10"]
    }, {
        paymentName: "Instrument",
        paymentFileCode: "2",
        chargeItemType: ["2"]
    }, {
        paymentName: "เวชภัณฑ์ที่ไม่ใช่ยา",
        paymentFileCode: "5",
        chargeItemType: ["11"]
    }, {
        paymentName: "บริการโลหิตและส่วนประกอบของโลหิต",
        paymentFileCode: "6",
        chargeItemType: ["14"]
    }, {
        paymentName: "ตรวจวินิฉัยทางเทคนิคการแพทย์และพยาธิวิทยา",
        paymentFileCode: "7",
        chargeItemType: ["15"]
    }, {
        paymentName: "ตรวจวินิจฉัยและรักษาทางรังสีวิทยา",
        paymentFileCode: "8",
        chargeItemType: ["16"]
    }, {
        paymentName: "ตรวจวินิจฉัยด้วยวิธีพิเศษอื่นๆ",
        paymentFileCode: "9",
        chargeItemType: ["9"]
    }, {
        paymentName: "อุปการณ์และเครื่องมือทางการแพทย์",
        paymentFileCode: "A",
        chargeItemType: ["18"]
    }, {
        paymentName: "ทำหัตถการและวิสัญญี",
        paymentFileCode: "B",
        chargeItemType: ["19"]
    }, {
        paymentName: "ค่าบริการทางการพยาบาล",
        paymentFileCode: "C",
        chargeItemType: ["17"]
    }, {
        paymentName: "ค่าบริการทันตกรรม",
        paymentFileCode: "D",
        chargeItemType: ["12"]
    }, {
        paymentName: "บริการทางการกายภาพบำบัด/เวชกรรมฟื้นฟู",
        paymentFileCode: "E",
        chargeItemType: ["20"]
    },
    {
        paymentName: "ค่าฝังเข็ม",
        paymentFileCode: "F",
        chargeItemType: ["13"]
    },
    {
        paymentName: "",
        paymentFileCode: "G",
        chargeItemType: [""]
    }, {
        paymentName: "",
        paymentFileCode: "H",
        chargeItemType: [""]
    },
    {
        paymentName: "",
        paymentFileCode: "I",
        chargeItemType: ["null"]
    }, {
        paymentName: "บริการอื่นๆที่ไม่ได้จัดหมวดหมู่",
        paymentFileCode: "J",
        chargeItemType: ["1", "3", "4", "5", "6", "7", "8"]
    }, {
        paymentName: "",
        paymentFileCode: "K",
        chargeItemType: ["null"]
    },
]

