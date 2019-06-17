import $ from '../../utils/ajax';

async function get_bandwidth_stat(params){
    return $.getJSON("/v1/company/get_bandwidth_stat/", params)
}

async function get_agency_stat(params){
    return $.getJSON("/v1/company/get_agency_stat/", params)
}

async function get_city_stat(params){
    return $.getJSON("/v1/company/get_city_stat/", params)
}

export {get_bandwidth_stat,get_agency_stat,get_city_stat}