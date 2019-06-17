import $ from '../../utils/ajax';
async function get_port_groups(params){
    return $.getJSON("/v1/company/get_port_groups/", params)
}
async function update_port_group(params){
    return $.post("/v1/company/update_port_group/", params)
}
async function delete_port_group(params){
    return $.post("/v1/company/delete_port_group/", params)
}
async function create_port_group(params){
    return $.post("/v1/company/create_port_group/", params)
}



export {get_port_groups,delete_port_group,update_port_group,create_port_group}