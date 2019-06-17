import $ from '../../utils/ajax';

async function getAppConfigList(params) {
    return $.getJSON("/v1/company/get_app_config_list/",params)
}

async function get_ip_groups(params) {
    return $.getJSON("/v1/company/get_ip_groups/",params)
}
async function get_port_groups(params) {
    return $.getJSON("/v1/company/get_port_groups/",params)
}

async function createAppConfig(params){
    return $.post("/v1/company/create_app_config/",params)
}

async function updateAppConfig(params){
    return $.post("/v1/company/update_app_config/",params)
}
async function deleteAppConfig(params){
    return $.post("/v1/company/delete_app_config/",params)
}

async function get_app_priority(params) {
    return $.getJSON("/v1/company/get_app_priority/",params)
}

async function update_app_priority(params) {
    return $.post("/v1/company/update_app_priority/",params)
}
async function batch_change_app_activity(params) {
    return $.post("/v1/company/batch_change_app_activity/",params)
}
async function update_lte_allowed(params) {
    return $.post("/v1/company/update_lte_allowed/",params)
}

async function get_lte_allowed(params) {
    return $.getJSON("/v1/company/get_lte_allowed/",params)
}

export {get_lte_allowed,update_lte_allowed,batch_change_app_activity,get_ip_groups,get_port_groups,getAppConfigList,createAppConfig,updateAppConfig,deleteAppConfig,get_app_priority,update_app_priority};