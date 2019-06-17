import $ from '../../utils/ajax';
async function get_lte_4g(params){
    return $.getJSON("/v1/company/get_lte_4g/", params)
}

async function update_lte_4g(params){
    return $.post("/v1/company/update_lte_4g/", params)
}

async function create_lte_4g(params){
    return $.post("/v1/company/create_lte_4g/", params)
}

async function delete_lte_4g(params){
    return $.post("/v1/company/delete_lte_4g/", params)
}

export {get_lte_4g,update_lte_4g,create_lte_4g,delete_lte_4g}