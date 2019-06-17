import $ from '../../utils/ajax';

async function update_company(params) {
    return $.post("/v1/company/update_company/", params)
}
async function get_os_version(params) {
    return $.getJSON("/v1/company/get_os_version/", params)
}
async function update_os_version(params) {
    return $.post("/v1/company/update_os_version/", params)
}
export {update_company,get_os_version,update_os_version};