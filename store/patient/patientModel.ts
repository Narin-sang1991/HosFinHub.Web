
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
    
    /**
    * #Description => Date of born;
    **/
    dob: Date,

    sex: number,
    marriage: number,
    occupa: string,
    nation: string,
    namepat: string,

    /**
    * #Description => Type od card;
    * #Remind =>
    * Personal-Card: 1,
    * Passport: 2,
    * Migrant-Doc: 3,
    * Other-Doc: 4,
    * Migrant-Card: 5,
    **/
    idtype: number,
}