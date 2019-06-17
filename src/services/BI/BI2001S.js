import $ from '../../utils/ajax';

async function get_cloud_application(params) {
    return $.getJSON("/v1/company/get_cloud_application/", params)
}
async function create_cloud_application(params) {
    return $.post("/v1/company/create_cloud_application/", params)
}
async function update_cloud_application(params) {
    return $.post("/v1/company/update_cloud_application/", params)
}
async function delete_cloud_application(params) {
    return $.post("/v1/company/delete_cloud_application/", params)
}

export {get_cloud_application,create_cloud_application,update_cloud_application,delete_cloud_application,};