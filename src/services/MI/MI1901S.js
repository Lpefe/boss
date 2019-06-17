import $ from '../../utils/ajax';

async function getDockerGroup(params) {
    return $.getJSON("/v1/company/get_docker_group/",params)
}
async function getOsList(params) {
    return $.getJSON("/v1/task/get_os_list/",params)
}

async function getRoomList(params) {
    return $.getJSON("/v1/company/get_room_list/",params)
}

async function creatDockerGroup(params){
    return $.post("/v1/company/create_docker_group/",params)
}

async function updateDockerGroup(params){
    return $.post("/v1/company/update_docker_group/",params)
}

async function deleteDockerGroup(params){
    return $.post("/v1/company/delete_docker_group/",params)
}
async function getIspOfDocker(params) {
    return $.getJSON("/v1/company/get_isp_of_docker/",params)
}

async function createIspOfDocker(params){
    return $.post("/v1/company/create_isp_of_docker/",params)
}

async function deleteIspOfDocker(params){
    return $.post("/v1/company/delete_isp_of_docker/",params)
}

async function updateIspOfDocker(params){
    return $.post("/v1/company/update_isp_of_docker/",params)
}
export {getDockerGroup,getOsList,getRoomList,creatDockerGroup,updateDockerGroup,deleteDockerGroup,getIspOfDocker,createIspOfDocker,deleteIspOfDocker,updateIspOfDocker}