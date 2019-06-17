
import $ from '../../utils/ajax';

async function get_app_dns(params) {
    return $.getJSON("/v1/company/get_app_dns/", params)
}
async function update_app_dns(params) {
    return $.post("/v1/company/update_app_dns/", params)
}


export {get_app_dns,update_app_dns,};