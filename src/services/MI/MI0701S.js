import $ from '../../utils/ajax';

async function getDeviceList(params) {
    return $.getJSON("/v1/company/get_device_list/",params)
}

async function create_log_task(params){
    return $.post("/v1/task/create_log_task/",params)
}

export {getDeviceList,create_log_task}