import $ from '../../utils/ajax';



async function get_link_alarm_list(params){
    return $.getJSON("/v1/alarm/get_link_alarm_list/",params)
}

async function get_alarm_list(params){
    return $.getJSON("/v1/alarm/get_alarm_list/",params)
}

export {get_link_alarm_list,get_alarm_list}