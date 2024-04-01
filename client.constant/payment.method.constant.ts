
const defaultStrEmpty: string = "-";
 

export function getChargeDetails(chargeCode: string) {
    if (chargeCode.startsWith('1')) return "ค่าห้อง/ค่าอาหาร";
    if (chargeCode.startsWith('2')) return "อวัยวะเทียม/อุปกรณ์ในการบำบัดรักษา";
    if (chargeCode.startsWith('3')) return "ยาและสารอาหารทางเส้นเลือดที่ใช้ในโรงพยาบาล";
    if (chargeCode.startsWith('4')) return "ยาที่นำไปใช้ต่อที่บ้าน";
    if (chargeCode.startsWith('5')) return "เวชภัณฑ์ที่ไม่ใช่ยา";
    if (chargeCode.startsWith('6')) return "บริการโลหิตและส่วนประกอบของโลหิต";
    if (chargeCode.startsWith('7')) return "ตรวจวินิจฉัยทางเทคนิคการแพทย์และพยาธิวิทยา";
    if (chargeCode.startsWith('8')) return "ตรวจวินิจฉัยและรักษาทางรังสีวิทยา";
    if (chargeCode.startsWith('9')) return "ตรวจวินิจฉัยด้วยวิธีพิเศษอื่นๆ";
    if (chargeCode.startsWith('A')) return "อุปกรณ์ของใช้และเครื่องมือทางการแพทย์";
    if (chargeCode.startsWith('B')) return "ทำหัตถการ และบริการวิสัญญี";
    if (chargeCode.startsWith('C')) return "ค่าบริการทางการพยาบาล";
    if (chargeCode.startsWith('D')) return "บริการทางทัตนกรรม";
    if (chargeCode.startsWith('E')) return "บริการทางกายภาพบำบัด และเวชกรรมฟื้นฟู";
    if (chargeCode.startsWith('F')) return "บริการสงเข็ม/การบำบัดของผู้ประกอบโรคศิลปะอื่นๆ";
    if (chargeCode.startsWith('G')) return "ค่าห้องผ่าตัดและห้องคลอด";
    if (chargeCode.startsWith('H')) return "ค่าธรรมเนียมบุคลกรทางการแพทย์";
    if (chargeCode.startsWith('I')) return "บริการอื่นๆ และส่งเสริมป้องกันโรค";
    if (chargeCode.startsWith('J')) return "บริการอื่นๆ ที่ยังไม่ได้จัดหมวด";
    if (chargeCode.startsWith('K')) return "พรบ.";
    return defaultStrEmpty;
}