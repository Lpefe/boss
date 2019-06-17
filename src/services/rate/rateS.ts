import $ from '../../utils/ajax';
async function get_dedup_rank(params) {
    return $.getJSON("/v1/rate/get_dedup_rank/", params)
}

async function get_deduplicate(params){
    return $.getJSON("/v1/rate/get_deduplicate/", params)
}

async function get_compress_rank(params) {
    return $.getJSON("/v1/rate/get_compress_rank/", params)
}

async function get_compress(params) {
    return $.getJSON("/v1/rate/get_compress/", params)
}

async function get_system(params){
    return $.getJSON("/v1/rate/get_system/",params)
}

async function get_wans(params){
    return $.getJSON("/v1/rate/get_wans/",params,false)
}

async function get_session_ct(params){
    return $.getJSON("/v1/rate/get_session_ct/",params,false)
}
async function get_tunnel_agent(params){
    return $.getJSON("/v1/rate/get_tunnel_agent/",params,false)
}
async function get_multi_band(params){
    return $.getJSON("/v1/rate/get_multi_band/",params,false)
}
async function get_4g_flow(params) {
    return $.post("/v1/rate/get_4g_flow/",params);
}

async function get_days4g(params){
    return $.getJSON("/v1/rate/get_days4g/",params)
}

async function get_interface(params){
    return $.getJSON("/v1/rate/get_interface/",params)
}

async function get_band_load_all(params){
    return $.getJSON("/v1/rate/get_band_load_all/",params)
}

async function get_band_load(params){
    return $.getJSON("/v1/rate/get_band_load/",params)
}

async function get_rtt_data(params) {
    return $.getJSON("/v1/step/statistics/", params)
}
async function statistics(params){
    return $.getJSON("/v1/step/statistics/",params,false)
}

async function getStatistics(params) {
    return $.getJSON("/v1/step/statistics/", params)
}

async function update_app_name(params) {
    var formData=new FormData();
    for(let key in params){
        formData.append(key,params[key])
    }
    return $.formPost("/v1/rate/update_app_name/", formData)
}

async function get_srcip_list(params) {
    return $.getJSON("/v1/rate/get_srcip_list/", params)
}

async function get_steps_beta(params) {
    return $.getJSON("/v1/rate/get_steps_beta/", params)
}
async function get_step_class(params) {
    return $.getJSON("/v1/rate/get_step_class/", params)
}
async function get_step_apps(params) {
    return $.getJSON("/v1/rate/get_step_apps/", params)
}
async function get_users_dpi(params) {
    return $.getJSON("/v1/rate/get_users_dpi/", params)
}

async function get_users_dpi_search(params) {
    return $.getJSON("/v1/rate/get_user_dpi/", params)
}
async function get_dpi_days(params) {
    return $.getJSON("/v1/rate/get_dpi_days/", params)
}

async function get_step_apps_search(params) {
    return $.getJSON("/v1/rate/get_step_apps_search/", params)
}

async function get_steps_search(params) {
    return $.getJSON("/v1/rate/get_step_search/", params)
}
async function get_main_flow(params) {
    return $.getJSON("/v1/rate/get_main_flow/", params)
}

async function get_dpi_dstrank(params) {
    return $.getJSON("/v1/rate/get_dpi_dstrank/", params)
}

async function get_dpi_dstflow(params) {
    return $.getJSON("/v1/rate/get_dpi_dstflow/", params)
}
async function get_path_rtt(params) {
    return $.getJSON("/v1/rate/get_path_rtt/", params)
}
async function get_path_miss(params) {
    return $.getJSON("/v1/rate/get_path_miss/", params)
}

async function get_line_top(params) {
    return $.getJSON("/v1/rate/get_line_top/", params)
}

async function get_line_detail(params) {
    return $.getJSON("/v1/rate/get_line_detail/", params)
}
async function get_line_tunnel(params) {
    return $.getJSON("/v1/rate/get_line_tunnel/", params)
}

async function get_path_seg(params) {
    return $.getJSON("/v1/rate/get_path_seg/", params)
}
export {get_path_seg,get_line_tunnel,get_line_detail,get_line_top,get_dpi_dstflow,get_dpi_dstrank,get_main_flow,get_steps_search,get_users_dpi_search,get_step_apps_search,get_dpi_days,get_users_dpi,get_step_class,get_step_apps,get_steps_beta,getStatistics,get_srcip_list,update_app_name,statistics,get_rtt_data,get_4g_flow,get_multi_band,get_band_load,get_band_load_all,get_days4g,get_interface,get_system,get_wans,get_session_ct,get_tunnel_agent,get_dedup_rank,get_deduplicate,get_compress,get_compress_rank,get_path_rtt,get_path_miss}