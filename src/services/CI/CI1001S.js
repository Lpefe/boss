import $ from '../../utils/ajax';

async function get_company_list(params) {
    return $.getJSON("/v1/company/get_company_list/", params)
}



async function update_agency(params) {
    return $.post("/v1/company/update_agency/", params)
}
async function create_iptable(params) {
    return $.post("/v1/company/create_iptable/", params)
}
async function update_iptable(params) {
    return $.post("/v1/company/update_iptable/", params)
}
async function delete_iptable(params) {
    return $.post("/v1/company/delete_iptable/", params)
}

async function get_iptable_list(params) {
    return $.getJSON("/v1/company/get_iptable_list/", params)
}

async function get_topo_list(params) {
    return $.getJSON("/v1/company/get_topo_list/", params)
}
async function update_topo(params) {
    return $.post("/v1/company/update_topo/", params)
}
async function delete_contract(params) {
    return $.getJSON("/v1/company/delete_contract/", params)
}

async function get_company_contact(params) {
    return $.getJSON("/v1/company/get_company_contact/", params)
}

async function create_company_contact(params) {
    return $.post("/v1/company/create_company_contact/", params)
}

async function update_company_contact(params) {
    return $.post("/v1/company/update_company_contact/", params)
}

async function delete_company_contact(params) {
    return $.post("/v1/company/delete_company_contact/", params)
}

export {delete_company_contact,create_company_contact,update_company_contact,get_company_contact,delete_contract,update_topo,get_topo_list,update_iptable,delete_iptable,get_iptable_list,create_iptable,get_company_list,update_agency}