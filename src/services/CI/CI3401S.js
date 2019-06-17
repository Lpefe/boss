
import $ from '../../utils/ajax';

async function get_lan_strategy(params) {
    return $.getJSON("/v1/company/get_lan_strategy/", params)
}

async function create_lan_strategy(params) {
    return $.post("/v1/company/create_lan_strategy/", params)
}

async function delete_lan_strategy(params) {
    return $.post("/v1/company/delete_lan_strategy/", params)
}

async function update_lan_strategy(params) {
    return $.post("/v1/company/update_lan_strategy/", params)
}


export {get_lan_strategy,create_lan_strategy,update_lan_strategy,delete_lan_strategy};