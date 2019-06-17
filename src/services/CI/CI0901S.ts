import $ from '../../utils/ajax';

export interface WhiteListItem {
    url: string;
    is_active: boolean;
    id: number;
    company_id: number;
}

export interface GetWhiteListRes {
    result: WhiteListItem[] | string;
    success: boolean;
}

export function get_white_list(params: any): Promise<GetWhiteListRes> {
    return $.getJSON("/v1/company/get_white_list/", params)
}


export interface CreateWhiteListResult {
    result?: ""
    success: boolean
}

export async function create_white_list(params: any): Promise<CreateWhiteListResult> {
    return $.post("/v1/company/create_white_list/", params)
}


export async function update_white_list(params) {
    return $.post("/v1/company/update_white_list/", params)
}


export async function delete_white_list(params) {
    return $.post("/v1/company/delete_white_list/", params)
}

export function get_black_list_company(params: any): Promise<any> {
    return $.getJSON("/v1/company/get_black_list_company/", params)
}

export function create_black_list_company(params):Promise<any>{
    return $.post("/v1/company/create_black_list_company/", params)
}

export function delete_black_list_company(params):Promise<any>{
    return $.post("/v1/company/delete_black_list_company/", params)
}




