import $ from '../../utils/ajax';

async function getDocker(params) {
    return $.getJSON("/v1/company/get_docker/",params)
}

async function getSn(params) {
    return $.getJSON("/v1/company/get_sn/",params)
}

async function get_bgp(params) {
    return $.getJSON("/v1/company/get_bgp/",params)
}

async function update_bgp(params){
    return $.post("/v1/company/update_bgp/",params)
}
async function get_bgp_ipset(params) {
    return $.getJSON("/v1/company/get_bgp_ipset/",params)
}
async function update_bgp_ipset(params){
    return $.post("/v1/company/update_bgp_ipset/",params)
}
async function creatDocker(params){
    return $.post("/v1/company/create_docker/",params)
}

async function updateDocker(params){
    return $.post("/v1/company/update_docker/",params)
}

async function deleteDocker(params){
    return $.post("/v1/company/delete_docker/",params)
}

async function get_cloud_application(params) {
    return $.getJSON("/v1/company/get_cloud_application/",params)
}
export {getDocker,creatDocker,updateDocker,deleteDocker,getSn,get_bgp,update_bgp,get_bgp_ipset,update_bgp_ipset,get_cloud_application}