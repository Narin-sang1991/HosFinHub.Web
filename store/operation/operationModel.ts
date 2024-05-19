

export interface OpdOperationModel extends OperationModel {
    seq: string;
    hn: string;
    clinic: string;
    dateopd: Date;
    servprice: string;
    person_id: string;
}

export interface IpdOperationModel extends OperationModel {
    an: string;
    optype : number;
    datein: Date;
    timein: string;
    dateout: Date;
    timeout: string;
}

export interface OperationModel {
    id: string;
    oper: string;
    dropid: string;
}