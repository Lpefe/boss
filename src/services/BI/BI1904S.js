import $ from '../../utils/ajax';

async function get_wifi(params) {
    return $.getJSON("/v1/company/get_wifi/", params)
}
async function get_wifi_config_file(params) {
    return $.getJSON("/v1/company/get_wifi_config_file/", params)
}
async function update_wifi(params) {
    return $.post("/v1/company/update_wifi/", params)
}

async function get_cta_wifi(params) {
    return $.getJSON("/v1/company/get_cta_wifi/", params)
}
async function get_ap_wifi(params) {
    return $.getJSON("/v1/company/get_ap_wifi/", params)
}

async function update_cta_wifi(params) {
    return $.post("/v1/company/update_cta_wifi/", params)
}
async function get_cta_lan(params) {
    return $.getJSON("/v1/company/get_cta_lan/", params)
}
async function get_ap_lan(params) {
    return $.getJSON("/v1/company/get_ap_lan/", params)
}
async function update_ap_wifi(params) {
    return $.post("/v1/company/update_ap_wifi/", params)
}
export {get_wifi,update_wifi,
    get_ap_wifi,get_cta_wifi,get_wifi_config_file,update_cta_wifi,get_cta_lan,get_ap_lan,update_ap_wifi};