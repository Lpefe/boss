import $ from '../../utils/ajax';

async function getAclConfigList(params) {
    return $.getJSON("/v1/company/get_acl_config_list/",params)
}

async function createAclConfig(params){
    return $.post("/v1/company/create_acl_config/",params)
}

async function updateAclConfig(params){
    return $.post("/v1/company/update_acl_config/",params)
}
async function deleteAclConfig(params){
    return $.post("/v1/company/delete_acl_config/",params)
}

async function batch_change_acl_activity(params) {
    return $.post("/v1/company/batch_change_acl_activity/",params)
}

export {batch_change_acl_activity,getAclConfigList,createAclConfig,updateAclConfig,deleteAclConfig};