import $ from '../../utils/ajax';

async function getTaskList(params) {
    return $.getJSON("/v1/task/get_task_list/",params)
}

async function getLogTaskList(params) {
    return $.getJSON("/v1/task/get_log_task_list/",params)
}
async function getUpdateTaskList(params) {
    return $.getJSON("/v1/task/get_update_task_list/",params)
}

async function get_cmd_task(params) {
    return $.getJSON("/v1/task/get_cmd_task/",params)
}

export {get_cmd_task,getUpdateTaskList,getTaskList,getLogTaskList};