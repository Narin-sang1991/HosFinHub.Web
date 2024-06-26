
export interface OpdReferModel extends ReferModel {
    hn: string
    dateopd: string
    clinic: string
    seq: string
    referdate: string
}

export interface IpdReferModel extends ReferModel {
    an: string;
}

export interface ReferModel {
    id: string;
    refer: string;
    refertype: string;
}