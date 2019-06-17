import $ from '../../utils/ajax';

async function get_device_version_stat(params) {
    return $.getJSON("/v1/company/get_device_version_stat/",params)
}


export {get_device_version_stat}