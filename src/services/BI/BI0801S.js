import $ from '../../utils/ajax';

async function get_fullmesh_link(params) {
    return $.getJSON("/v1/company/get_fullmesh_link/", params)
}
async function create_fullmesh_link(params) {
    return $.post("/v1/company/create_fullmesh_link/", params)
}
async function update_fullmesh_link(params) {
    return $.post("/v1/company/update_fullmesh_link/", params)
}
async function delete_fullmesh_link(params) {
    return $.post("/v1/company/delete_fullmesh_link/", params)
}

export {get_fullmesh_link,create_fullmesh_link,update_fullmesh_link,delete_fullmesh_link};