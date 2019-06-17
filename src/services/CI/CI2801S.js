import $ from '../../utils/ajax';

async function get_cpe_template_agency(params) {
    return $.getJSON("/v1/company/get_cpe_template_agency/", params)
}
async function create_cpe_template_agency(params) {
    return $.post("/v1/company/create_cpe_template_agency/", params)
}
async function get_cpe_template(params) {
    return $.getJSON("/v1/company/get_cpe_template/", params)
}
async function get_device_model(params) {
    return $.getJSON("/v1/company/get_device_model/", params)
}
async function delete_cpe_template_agency(params) {
    return $.post("/v1/company/delete_cpe_template_agency/", params)
}
export {get_cpe_template_agency,create_cpe_template_agency,get_cpe_template,get_device_model,delete_cpe_template_agency};