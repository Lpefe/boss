export interface GetTodayRateResult {
    origin: number;
    grade: string;
    rtt_limit: number;
    dedup: number;
    bandwidth: number;
    create_time: string;
    id: number;
    charge_type: string;
    dedup_raw: number;
    topo_id?: any;
    deduplication: string;
    company_id: number;
    edge_backup_to: number;
    type: string;
    start_date: string;
    status: string;
    recent_bill_date?: any;
    assign_type: string;
    agency_id: number;
    path_proto: number;
    backup_to: number;
    device_id: number;
    name: string;
    rate: number;
    drate: number;
}

export interface GetTodayRateRes {
    total: number;
    result: GetTodayRateResult[];
    success: boolean;
}

export interface GetTodayRateParams {
	company_id: number;
}

export interface GetHistoryRateRes {
    origin: number;
    dedup_raw: number;
    link_id: number;
    dedup: number;
    drate: number;
    date: string;
    rate: number;
    tid: number;
    now: number;
}

export interface HistoryRate{
    success:boolean,
    result:GetTodayRateRes[],

}





