import $ from '../../utils/ajax';

async function get_wifi_template(params) {
    return $.getJSON("/v1/company/get_wifi_template/", params)
}

async function get_device_model(params) {
    return $.getJSON("/v1/company/get_device_model/", params)
}

async function get_lan_template(params) {
    return $.getJSON("/v1/company/get_lan_template/", params)
}

async function create_wifi_template(params) {
    return $.post("/v1/company/create_wifi_template/", params)
}

async function delete_wifi_template(params) {
    return $.post("/v1/company/delete_wifi_template/", params)
}

async function update_wifi_template(params) {
    return $.post("/v1/company/update_wifi_template/", params)
}

async function duplicate_wifi_template(params) {
    return $.post("/v1/company/duplicate_wifi_template/", params)
}
export {get_wifi_template
    ,create_wifi_template,get_device_model,get_lan_template
    ,delete_wifi_template,update_wifi_template,duplicate_wifi_template};