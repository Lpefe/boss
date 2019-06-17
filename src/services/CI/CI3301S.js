import $ from '../../utils/ajax';

async function get_lan_template(params) {
    return $.getJSON("/v1/company/get_lan_template/", params)
}

async function create_lan_template(params) {
    return $.post("/v1/company/create_lan_template/", params)
}

async function delete_lan_template(params) {
    return $.post("/v1/company/delete_lan_template/", params)
}

async function update_lan_template(params) {
    return $.post("/v1/company/update_lan_template/", params)
}
async function get_static_ip(params) {
    return $.getJSON("/v1/company/get_static_ip/", params)
}

async function create_static_ip(params) {
    return $.post("/v1/company/create_static_ip/", params)
}

async function delete_static_ip(params) {
    return $.post("/v1/company/delete_static_ip/", params)
}

async function update_static_ip(params) {
    return $.post("/v1/company/update_static_ip/", params)
}


export {create_lan_template,get_lan_template,update_lan_template,delete_lan_template,get_static_ip,create_static_ip,update_static_ip,delete_static_ip};