import $ from '../../utils/ajax';

async function getCompanyList(params) {
    return $.getJSON("/v1/company/get_company_list/", params)
}

async function update_company(params) {
    return $.post("/v1/company/update_company/", params)
}

async function get_related_person_list(params,noLoading){
    return $.getJSON("/v1/company/get_related_person_list/", params,"",noLoading)
}

async function update_related_person(params){
    return $.post("/v1/company/update_related_person/",params)
}

async function create_related_person(params){
    return $.post("/v1/company/create_related_person/",params)
}


async function reset_password(params){
    return $.post("/v1/company/reset_password/",params)
}

async function delete_related_person(params){
    return $.post("/v1/company/delete_related_person/",params)
}
async function change_activity(params){
    return $.post("/v1/company/change_activity/",params)
}
export {change_activity,getCompanyList, update_company,get_related_person_list,update_related_person,create_related_person,reset_password,delete_related_person};