import $ from '../../utils/ajax';


async function create_stock_batch(params){
    return $.post("/v1/company/create_stock_batch/",params)
}
async function out_stock_batch(params){
    return $.post("/v1/company/out_stock_batch/",params)
}
async function get_company_list(params) {
    return $.getJSON("/v1/company/get_company_list/",params)
}
async function get_agency_list(params) {
    return $.getJSON("/v1/company/get_agency_list/",params)
}
async function get_stock_list(params) {
    return $.getJSON("/v1/company/get_stock_list/",params)
}
async function get_sn(params) {
    return $.getJSON("/v1/company/get_sn/",params)
}
async function get_stock_operation(params) {
    return $.getJSON("/v1/company/get_stock_operation/",params)
}
async function get_stock_operation_record(params) {
    return $.getJSON("/v1/company/get_stock_operation_record/",params)
}
async function update_stock_operation(params){
    return $.post("/v1/company/update_stock_operation/",params)
}
async function undo_stock_operation(params){
    return $.post("/v1/company/undo_stock_operation/",params)
}

export {create_stock_batch,get_company_list,out_stock_batch,get_agency_list,get_stock_list,get_sn,get_stock_operation,get_stock_operation_record
    ,undo_stock_operation,update_stock_operation
}