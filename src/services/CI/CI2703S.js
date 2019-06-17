import $ from '../../utils/ajax';

async function get_ssid_template(params) {
    return $.getJSON("/v1/company/get_ssid_template/", params)
}
async function get_agency_list(params) {
    return $.getJSON("/v1/company/get_agency_list/", params)
}
async function get_ssid_template_agency(params) {
    return $.getJSON("/v1/company/get_ssid_template_agency/", params)
}

async function create_ssid_template_agency(params) {
    return $.post("/v1/company/create_ssid_template_agency/", params)
}

async function delete_ssid_template_agency(params) {
    return $.post("/v1/company/delete_ssid_template_agency/", params)
}

async function update_ssid_template_agency(params) {
    return $.post("/v1/company/update_ssid_template_agency/", params)
}
export {get_agency_list,get_ssid_template,get_ssid_template_agency,create_ssid_template_agency,delete_ssid_template_agency,update_ssid_template_agency};