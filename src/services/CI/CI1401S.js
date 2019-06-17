import $ from '../../utils/ajax';
async function get_device_list(params){
    return $.getJSON("/v1/company/get_device_list/", params)
}

async function get_isp_of_cstep(params){
    return $.getJSON("/v1/company/get_isp_of_cstep/", params)
}

async function create_isp_of_cstep(params){
    return $.post("/v1/company/create_isp_of_cstep/", params)
}
async function update_isp_of_cstep(params){
    return $.post("/v1/company/update_isp_of_cstep/", params)
}
async function delete_isp_of_cstep(params){
    return $.post("/v1/company/delete_isp_of_cstep/", params)
}

async function get_isp_dict(params){
    return $.getJSON("/v1/company/get_isp_dict/", params)
}

export {get_isp_dict,get_device_list,get_isp_of_cstep,create_isp_of_cstep,update_isp_of_cstep,delete_isp_of_cstep }