import $ from '../../utils/ajax';

async function getDeviceList(params) {
    return $.getJSON("/v1/company/get_device_list/",params)
}

async function getRoomList(params){
    return $.getJSON("/v1/company/get_room_list/",params)
}

async function createDevice(params){
    return $.post("/v1/company/create_device/",params)
}

async function updateDevice(params){
    return $.post("/v1/company/update_device/",params)
}

async function deleteDevice(params){
    return $.post("/v1/company/delete_device/",params)
}

async function delete_device_batch(params){
    return $.getJSON("/v1/company/delete_device_batch/",params)
}
export {getDeviceList,getRoomList,createDevice,updateDevice,deleteDevice,delete_device_batch}