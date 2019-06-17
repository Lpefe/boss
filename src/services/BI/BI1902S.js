import $ from '../../utils/ajax';

async function get_ssid_template(params) {
    return $.getJSON("/v1/company/get_ssid_template/", params)
}

async function create_ssid_template(params) {
    return $.post("/v1/company/create_ssid_template/", params)
}

async function delete_ssid_template(params) {
    return $.post("/v1/company/delete_ssid_template/", params)
}

async function update_ssid_template(params) {
    return $.post("/v1/company/update_ssid_template/", params)
}
export {get_ssid_template,create_ssid_template,delete_ssid_template,update_ssid_template};