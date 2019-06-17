import $ from '../../utils/ajax';

async function get_bills(params) {
    return $.getJSON("/v1/company/get_bills/", params)
}
async function get_bill_link_stat(params) {
    return $.post("/v1/company/get_bill_link_stat/", params)
}
async function create_bill(params) {
    return $.post("/v1/company/create_bill/", params)
}

async function update_bill(params) {
    return $.post("/v1/company/update_bill/", params)
}
async function get_bill_links(params) {
    return $.getJSON("/v1/company/get_bill_links/", params)
}

async function delete_bill(params) {
    return $.post("/v1/company/delete_bill/", params)
}
export {delete_bill,update_bill,get_bill_links,create_bill,get_bill_link_stat,get_bills};