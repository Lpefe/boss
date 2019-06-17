import $ from '../../utils/ajax';

async function create_agency_group(params) {
    return $.post("/v1/company/create_agency_group/", params)
}

async function get_agency_group(params){
    return $.getJSON("/v1/company/get_agency_group/", params)
}

async function update_agency_group(params){
    return $.post("/v1/company/update_agency_group/", params)
}

async function get_agency_list(params){
    return $.getJSON("/v1/company/get_agency_list/", params)
}


async function delete_agency_group(params){
    return $.post("/v1/company/delete_agency_group/", params)
}


async function update_agency_of_group(params){
    return $.post("/v1/company/update_agency_of_group/", params)
}


async function get_device_list(params){
    return $.getJSON("/v1/company/get_device_list/", params)
}
export {create_agency_group,get_agency_group,update_agency_group,get_agency_list,delete_agency_group,update_agency_of_group,get_device_list};