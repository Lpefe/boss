import $ from '../../utils/ajax';

async function get_cta_wan(params) {
    return $.getJSON("/v1/company/get_cta_wan/", params)
}
async function create_cta_wan(params) {
    return $.post("/v1/company/create_cta_wan/", params)
}
async function update_cta_wan(params) {
    return $.post("/v1/company/update_cta_wan/", params)
}
async function delete_cta_wan(params) {
    return $.post("/v1/company/delete_cta_wan/", params)
}
async function get_available_ports_for_wan(params) {
    return $.getJSON("/v1/company/get_available_ports_for_wan/", params)
}
async function get_isp_dict(params) {
    return $.getJSON("/v1/company/get_isp_dict/", params)
}
async function check_lan_only(params) {
    return $.post("/v1/company/check_lan_only/", params)
}
async function get_cta_lan(params) {
    return $.getJSON("/v1/company/get_cta_lan/", params)
}
async function get_cta_wifi(params) {
    return $.getJSON("/v1/company/get_cta_wifi/", params)
}
async function create_cta_lan(params) {
    return $.post("/v1/company/create_cta_lan/", params)
}
async function update_cta_lan(params) {
    return $.post("/v1/company/update_cta_lan/", params)
}
async function delete_cta_lan(params) {
    return $.post("/v1/company/delete_cta_lan/", params)
}
async function get_cta_static_ip(params) {
    return $.getJSON("/v1/company/get_cta_static_ip/", params)
}
async function create_cta_static_ip(params) {
    return $.post("/v1/company/create_cta_static_ip/", params)
}
async function update_cta_static_ip(params) {
    return $.post("/v1/company/update_cta_static_ip/", params)
}
async function delete_cta_static_ip(params) {
    return $.post("/v1/company/delete_cta_static_ip/", params)
}
async function get_ap_static_ip(params) {
    return $.getJSON("/v1/company/get_ap_static_ip/", params)
}
async function create_ap_static_ip(params) {
    return $.post("/v1/company/create_ap_static_ip/", params)
}
async function update_ap_static_ip(params) {
    return $.post("/v1/company/update_ap_static_ip/", params)
}
async function delete_ap_static_ip(params) {
    return $.post("/v1/company/delete_ap_static_ip/", params)
}
async function create_cta_wifi(params) {
    return $.post("/v1/company/create_cta_wifi/", params)
}
async function update_cta_wifi(params) {
    return $.post("/v1/company/update_cta_wifi/", params)
}
async function delete_cta_wifi(params) {
    return $.post("/v1/company/delete_cta_wifi/", params)
}
async function get_cpe_template_agency(params) {
    return $.getJSON("/v1/company/get_cpe_template_agency/", params)
}
async function get_physical_ports_info(params) {
    return $.getJSON("/v1/company/get_physical_ports_info/", params)
}
async function update_cpe_template_agency(params) {
    return $.post("/v1/company/update_cpe_template_agency/", params)
}
async function create_cta_static_route(params) {
    return $.post("/v1/company/create_cta_static_route/", params)
}
async function update_cta_static_route(params) {
    return $.post("/v1/company/update_cta_static_route/", params)
}
async function delete_cta_static_route(params) {
    return $.post("/v1/company/delete_cta_static_route/", params)
}
async function get_cta_static_route(params) {
    return $.getJSON("/v1/company/get_cta_static_route/", params)
}
async function create_cta_static_parse(params) {
    return $.post("/v1/company/create_cta_static_parse/", params)
}
async function update_cta_static_parse(params) {
    return $.post("/v1/company/update_cta_static_parse/", params)
}
async function delete_cta_static_parse(params) {
    return $.post("/v1/company/delete_cta_static_parse/", params)
}
async function get_cta_static_parse(params) {
    return $.getJSON("/v1/company/get_cta_static_parse/", params)
}
async function get_ap_wifi(params) {
    return $.getJSON("/v1/company/get_ap_wifi/", params)
}
async function get_ap_lan(params) {
    return $.getJSON("/v1/company/get_ap_lan/", params)
}
async function get_ipset_by_cta_lan(params) {
    return $.getJSON("/v1/company/get_ipset_by_cta_lan/", params)
}
async function update_agency(params) {
    return $.post("/v1/company/update_agency/", params)
}
async function create_ap_lan(params) {
    return $.post("/v1/company/create_ap_lan/", params)
}
async function update_ap_lan(params) {
    return $.post("/v1/company/update_ap_lan/", params)
}
async function delete_ap_lan(params) {
    return $.post("/v1/company/delete_ap_lan/", params)
}
async function create_ap_wifi(params) {
    return $.post("/v1/company/create_ap_wifi/", params)
}
async function update_ap_wifi(params) {
    return $.post("/v1/company/update_ap_wifi/", params)
}
async function delete_ap_wifi(params) {
    return $.post("/v1/company/delete_ap_wifi/", params)
}

async function get_latest_lan_name(params) {
    return $.getJSON("/v1/company/get_latest_lan_name/", params)
}
async function get_start_end_ip(params) {
    return $.getJSON("/v1/company/get_start_end_ip/", params)
}
export {get_cta_wan,create_cta_wan,update_cta_wan,delete_cta_wan,check_lan_only,get_isp_dict,get_available_ports_for_wan,
    get_cta_lan,create_cta_lan,update_cta_lan,delete_cta_lan,get_cta_wifi,
    get_cta_static_ip,create_cta_static_ip,update_cta_static_ip,delete_cta_static_ip,
    create_cta_wifi,update_cta_wifi,delete_cta_wifi,
    get_cpe_template_agency,get_physical_ports_info,update_cpe_template_agency,
    get_cta_static_route,create_cta_static_route,update_cta_static_route,delete_cta_static_route,
    get_cta_static_parse,create_cta_static_parse,update_cta_static_parse,delete_cta_static_parse,get_ap_wifi,get_ap_lan,
    get_ipset_by_cta_lan,update_agency,
    create_ap_lan,update_ap_lan,delete_ap_lan,create_ap_wifi,update_ap_wifi,delete_ap_wifi,get_latest_lan_name,
    get_ap_static_ip,create_ap_static_ip,update_ap_static_ip,delete_ap_static_ip,get_start_end_ip
};
