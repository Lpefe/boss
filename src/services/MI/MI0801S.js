import $ from '../../utils/ajax';

async function getDeviceList(params) {
    return $.getJSON("/v1/company/get_device_list/",params)
}

async function getOsList(params){
    return $.getJSON("/v1/task/get_os_list/",params)
}

async function get_os_version(params){
    return $.getJSON("/v1/company/get_os_version/",params)
}

async function create_update_task(params){
    return $.post("/v1/task/create_update_task/",params)
}

export {getDeviceList,getOsList,create_update_task,get_os_version}