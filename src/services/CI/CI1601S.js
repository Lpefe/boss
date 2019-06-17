import $ from '../../utils/ajax';
async function get_ip_groups(params){
    return $.getJSON("/v1/company/get_ip_groups/", params)
}
async function update_ip_group(params){
    return $.post("/v1/company/update_ip_group/", params)
}
async function delete_ip_group(params){
    return $.post("/v1/company/delete_ip_group/", params)
}
async function create_ip_group(params){
    return $.post("/v1/company/create_ip_group/", params)
}



export {get_ip_groups,delete_ip_group,update_ip_group,create_ip_group}