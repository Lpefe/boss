import $ from '../../utils/ajax';


async function get_event_case(params) {
    return $.getJSON("/v1/company/get_event_case/",params)
}
async function get_history_event_case(params) {
    return $.getJSON("/v1/company/get_history_event_case/",params)
}
async function get_sub_event_case(params) {
    return $.getJSON("/v1/company/get_sub_event_case/",params)
}
async function deal_event_case(params){
    return $.post("/v1/company/deal_event_case/",params)
}
async function update_company(params){
    return $.post("/v1/company/update_company/",params)
}
async function deal_event_case_events(params){
    return $.post("/v1/company/deal_event_case_events/",params)
}
async function deal_sub_event_case(params){
    return $.post("/v1/company/deal_sub_event_case/",params)
}
export {get_history_event_case,get_event_case,get_sub_event_case,deal_event_case,update_company,deal_event_case_events,deal_sub_event_case
}