
export interface PatientModel {
    id: string,
    hn: string,
    title: string,
    fname: string,
    lname: string,
    person_id: string,      // id of person
}

export interface PatientDetailModel extends PatientModel {
    hcode: string,
    changwat: string,
    amphur: string,
    dob: string,
    sex: number,
    marriage: string,
    occupa: string,
    nation: string,
    namepat: string,
    idtype: number,
}