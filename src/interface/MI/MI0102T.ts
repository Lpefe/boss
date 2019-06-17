export interface Band {
    raterx: number;
    ratetx: number;
    time: number;
}

export interface MultibandData {
    nettp: number;
    bands: Band[];
}

export interface MultibandRes {
    retcode: number;
    msg: string;
    data: MultibandData[];
}