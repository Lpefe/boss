import $ from '../../utils/ajax';

async function get_stock_stat(params) {
    return $.getJSON("/v1/company/get_stock_stat/", params)
}

async function get_stock_list(params) {
    return $.getJSON("/v1/company/get_stock_list/", params)
}

async function getDeviceList(params) {
    return $.getJSON("/v1/company/get_device_list/", params)
}

async function deleteDevice(params) {
    return $.post("/v1/company/delete_device/", params)
}


async function update_devices(params) {
    let formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key])
    }
    return $.formPost("/v1/company/update_devices/", formData)
}

async function update_device(params) {
    return $.post("/v1/company/update_device/", params)
}

async function deleteStock(params) {
    return $.post("/v1/company/delete_stock/", params)
}

async function create_stock(params) {
    return $.post("/v1/company/create_stock/", params)
}

async function get_room_list(params) {
    return $.getJSON("/v1/company/get_room_list/", params)
}

async function get_company_list(params) {
    return $.getJSON("/v1/company/get_company_list/", params)
}

async function get_agency_list(params) {
    return $.getJSON("/v1/company/get_agency_list/", params)
}

async function out_stock(params) {
    return $.post("/v1/company/out_stock/", params)
}

async function update_stock(params) {
    return $.post("/v1/company/update_stock/", params)
}

async function getRoomList(params) {
    return $.getJSON("/v1/company/get_room_list/", params)
}

async function create_room(params) {
    return $.post("/v1/company/create_room/", params)
}

async function update_room(params) {
    return $.post("/v1/company/update_room/", params)
}


async function get_isp_list(params) {
    return $.getJSON("/v1/company/get_isp_list/", params)
}

async function update_isp(params) {
    return $.post("/v1/company/update_isp/", params)
}

async function create_isp(params) {
    return $.post("/v1/company/create_isp/", params)
}

async function delete_isp(params) {
    return $.post("/v1/company/delete_isp/", params)
}

async function delete_room(params) {
    return $.post("/v1/company/delete_room/", params)
}

async function get_black_list(params) {
    return $.getJSON("/v1/company/get_black_list/", params)
}

async function delete_black_list(params) {
    return $.post("/v1/company/delete_black_list/", params)
}


async function create_black_list(params) {
    return $.post("/v1/company/create_black_list/", params)
}

async function get_link_list(params) {
    return $.getJSON("/v1/company/get_link_list/", params)
}

async function get_link_stat(params) {
    return $.getJSON("/v1/company/get_link_stat/", params)
}

async function get_link(params) {
    return $.getJSON("/v1/company/get_link/", params)
}

async function get_device_list(params) {
    return $.getJSON("/v1/company/get_device_list/", params)

}

async function create_link(params) {
    return $.post("/v1/company/create_link/", params)
}

async function update_link(params) {
    return $.post("/v1/company/update_link/", params)
}

async function delete_link(params) {
    return $.post("/v1/company/delete_link/", params)
}
async function batch_update_company(params) {
    return $.post("/v1/company/batch_update_company/", params)
}


async function create_topo(params) {
    var formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key])
    }
    return $.formPost("/v1/company/create_topo/", formData)
}


async function delete_topo(params) {
    return $.getJSON("/v1/company/delete_topo/", params)
}


async function delete_topo_batch(params) {
    return $.getJSON("/v1/company/delete_topo_batch/", params)
}

async function get_link_path(params) {
    return $.getJSON("/v1/company/get_link_path/", params)
}

async function get_speed_rule(params) {
    return $.getJSON("/v1/company/get_speed_rule/", params)
}


async function create_link_batch(params) {
    return $.post("/v1/company/create_link_batch/", params)
}


async function delete_agency_batch(params) {
    return $.getJSON("/v1/company/delete_agency_batch/", params)
}

async function delete_agency(params) {
    return $.post("/v1/company/delete_agency/", params)
}

async function create_agency(params) {
    return $.post("/v1/company/create_agency/", params)
}

async function get_iptable_list(params) {
    return $.getJSON("/v1/company/get_iptable_list/", params)
}

async function create_iptable(params) {
    var formData = new FormData();
    for (let key in params) {
        console.log(params[key])
        formData.append(key, params[key]||"")
    }
    return $.formPost("/v1/company/create_iptable/", formData)
}

async function delete_iptable(params) {
    return $.post("/v1/company/delete_iptable/", params)
}

async function get_device_stat(params) {
    return $.getJSON("/v1/company/get_device_stat/", params)
}

async function get_wan_info(params) {
    return $.getJSON("/v1/company/get_wan_info/", params)
}

async function delete_device(params) {
    return $.post("/v1/company/delete_device/", params)
}

async function get_topo_list(params) {
    return $.getJSON("/v1/company/get_topo_list/", params)
}

async function get_manual_link_path_example(params) {
    return $.getJSON("/v1/company/get_manual_link_path_example/", params)
}

async function create_manual_link_path(params) {
    return $.post("/v1/company/create_manual_link_path/", params)
}

async function get_deduplication(params) {
    return $.getJSON("/v1/company/get_deduplication/", params)
}

async function update_deduplication(params) {
    return $.post("/v1/company/update_deduplication/", params)
}


async function get_company_related_person(params) {
    return $.getJSON("/v1/company/get_company_related_person/", params)

}

async function get_company_stat(params) {
    return $.getJSON("/v1/company/get_company_stat/", params)
}


async function updateRelatedPerson(params) {
    var formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key])
    }
    return $.formPost("/v1/company/update_related_person/", formData)
}

async function update_company(params) {
    return $.post("/v1/company/update_company/", params)
}

async function get_related_person_list(params) {
    return $.getJSON("/v1/company/get_related_person_list/", params)
}


async function create_company(params) {
    return $.post("/v1/company/create_company/", params)
}

async function create_company_related_person(params) {

    return $.post("/v1/company/create_company_related_person/", params)
}


async function create_company_contract(params) {
    var formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key])
    }
    return $.formPost("/v1/company/create_company_contract/", formData)
}

async function update_contract(params) {
    var formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key])
    }
    return $.formPost("/v1/company/update_contract/", formData)
}


async function delete_attachment(params) {
    return $.getJSON("/v1/company/delete_attachment/", params)
}


async function get_contract_list(params) {
    return $.getJSON("/v1/company/get_contract_list/", params)
}

async function update_speed_rule(params) {
    return $.post("/v1/company/update_speed_rule/", params)
}

async function delete_company(params) {
    return $.post("/v1/company/delete_company/", params)
}


async function get_department(params) {
    return $.getJSON("/v1/company/get_department/", params)
}


async function create_related_person(params){
    return $.post("/v1/company/create_related_person/", params)
}


async function delete_related_person(params) {
    return $.post("/v1/company/delete_related_person/", params)
}

async function add_department(params) {
    return $.post("/v1/company/add_department/", params)
}

async function delete_department(params) {
    return $.post("/v1/company/delete_department/", params)
}

async function change_activity(params) {
    return $.post("/v1/company/change_activity/", params, undefined, "",true)
}

async function update_department(params) {
    return $.post("/v1/company/update_department/", params)
}

async function reset_password(params) {
    return $.post("/v1/company/reset_password/", params)
}

async function get_dep_tree(params) {
    return $.getJSON("/v1/company/get_dep_tree/", params)
}

async function update_password(params) {
    return $.post("/v1/company/update_device_root_sn/", params)
}

async function get_isp_dict(params) {
    return $.getJSON("/v1/company/get_isp_dict/", params)
}


async function update_isp_dict(params) {
    return $.post("/v1/company/update_isp_dict/", params)
}

async function add_isp_dict(params) {
    return $.post("/v1/company/add_isp_dict/", params)
}

async function delete_isp_dict(params) {
    return $.post("/v1/company/delete_isp_dict/", params)
}

async function update_stock_batch(params) {
    return $.post("/v1/company/update_stock_batch/", params)
}


async function get_sn(params) {
    return $.getJSON("/v1/company/get_sn/", params)
}

async function get_app_category(params) {
    return $.getJSON("/v1/company/get_app_category/", params)
}

async function get_dpi_apps_custom(params) {
    return $.getJSON("/v1/company/get_dpi_apps_custom/", params)
}

async function create_dpi_apps_custom(params) {
    return $.post("/v1/company/create_dpi_apps_custom/", params)
}

async function update_dpi_apps_custom(params) {
    return $.post("/v1/company/update_dpi_apps_custom/", params)
}

async function delete_dpi_apps_custom(params) {
    return $.post("/v1/company/delete_dpi_apps_custom/", params)
}

async function get_dpi_apps(params) {
    return $.getJSON("/v1/company/get_dpi_apps/", params)
}

async function get_tunnel_port(params, loadingText) {
    return $.getJSON("/v1/company/get_tunnel_port/", params, loadingText)
}

async function get_request_log(params) {
    return $.getJSON("/v1/company/get_request_log/", params)
}

async function get_bandwidth_stat_all(params) {
    return $.getJSON("/v1/company/get_bandwidth_stat_all/", params)
}

async function get_device_type_stat(params) {
    return $.getJSON("/v1/company/get_device_type_stat/", params)
}

async function get_device_model_stat(params) {
    return $.getJSON("/v1/company/get_device_model_stat/", params)
}
async function get_redis_alarm(params) {
    return $.getJSON("/v1/company/get_redis_alarm/", params)
}
async function batch_update_redis_alarm(params) {
    return $.post("/v1/company/batch_update_redis_alarm/", params)
}

async function move_device(params) {
    return $.post("/v1/company/move_device/", params)
}
async function get_redis_alarm_stat(params) {
    return $.getJSON("/v1/company/get_redis_alarm_stat/", params)
}
async function get_redis_alarm_log(params) {
    return $.getJSON("/v1/company/get_redis_alarm_log/", params)
}

async function deal_alarm(params) {
    return $.post("/v1/company/deal_alarm/", params)
}
async function exchange_device(params) {
    return $.post("/v1/company/exchange_device/", params,false,"设备更换中",true)
}


async function get_address(params) {
    return $.getJSON("/v1/company/get_address/",params)
}

async function get_area(params) {
    return $.getJSON("/v1/company/get_area/",params)
}

async function create_area(params) {
    return $.post("/v1/company/create_area/", params)
}

async function update_area(params) {
    return $.post("/v1/company/update_area/", params)
}
async function delete_area(params) {
    return $.post("/v1/company/delete_area/", params)
}

async function create_address(params) {
    return $.post("/v1/company/create_address/", params)
}

async function update_address(params) {
    return $.post("/v1/company/update_address/", params)
}
async function delete_address(params) {
    return $.post("/v1/company/delete_address/", params)
}

async function get_device_model(params) {
    return $.getJSON("/v1/company/get_device_model/",params)
}
async function create_device_model(params) {
    let formData = new FormData();
    for (let key in params) {

        if(key==='file'&&params[key]){
            formData.append(key, params[key][0]||"")
        }else{
            formData.append(key, params[key]===undefined?"":params[key]);
        }
    }
    return $.formPost("/v1/company/create_device_model/", formData)
}

async function update_device_model(params) {
    let formData = new FormData();
    for (let key in params) {
        if(key==='file'&&params[key]){
            formData.append(key, params[key][0])
        }else{
            formData.append(key, params[key]===undefined?"":params[key]);
        }
    }
    return $.formPost("/v1/company/update_device_model/", formData)
}
async function delete_device_model(params) {
    return $.post("/v1/company/delete_device_model/", params)
}

async function get_update_task_list(params) {
    return $.getJSON("/v1/task/get_update_task_list/",params)
}

async function update_link_batch(params) {
    return $.post("/v1/company/update_link_batch/", params)
}

async function get_cmd_list(params) {
    return $.getJSON("/v1/company/get_cmd_list/",params)
}

async function send_command(params) {
    return $.post("/v1/company/send_command/", params)
}
async function update_empty_link(params) {
    return $.post("/v1/company/update_empty_link/", params)
}

async function delete_empty_link(params) {
    return $.post("/v1/company/delete_empty_link/", params)
}

async function get_device_version_list(params) {
    return $.getJSON("/v1/company/get_device_version_list/", params)
}
async function get_manual_link_path_placeholder(params) {
    return $.getJSON("/v1/company/get_manual_link_path_placeholder/", params)
}

async function get_logo(params) {
    return $.getJSON("/v1/company/get_logo/", params)
}

async function out_stock_batch(params) {
    return $.post("/v1/company/out_stock_batch/", params)
}
async function set_backup_link(params) {
    return $.post("/v1/company/set_backup_link/", params)
}

async function get_wifi_config_file(params) {
    return $.getJSON("/v1/company/get_wifi_config_file/", params)
}
async function get_wifi(params) {
    return $.getJSON("/v1/company/get_wifi/", params)
}

async function create_client_auth(params) {
    return $.post("/v1/company/create_client_auth/", params)
}
async function update_client_auth(params) {
    return $.post("/v1/company/update_client_auth/", params)
}

async function delete_client_auth(params) {
    return $.post("/v1/company/delete_client_auth/", params)
}
async function get_client_auth(params) {
    return $.getJSON("/v1/company/get_client_auth/", params)
}
async function get_lan_template(params) {
    return $.getJSON("/v1/company/get_lan_template/", params)
}

async function create_cpe_template(params) {
    return $.post("/v1/company/create_cpe_template/", params)
}

async function update_cpe_template(params) {
    return $.post("/v1/company/update_cpe_template/", params)
}
async function delete_cpe_template(params) {
    return $.post("/v1/company/delete_cpe_template/", params)
}

async function get_cpe_template(params) {
    return $.getJSON("/v1/company/get_cpe_template/", params)
}
async function duplicate_cpe_template(params) {
    return $.post("/v1/company/duplicate_cpe_template/", params)
}

async function get_cpe_template_agency(params) {
    return $.getJSON("/v1/company/get_cpe_template_agency/", params)
}

async function update_cpe_template_agency(params) {
    return $.post("/v1/company/update_cpe_template_agency/", params)
}

async function push_config(params) {
    return $.post("/v1/company/push_config/", params)
}

async function update_app_version(params) {
    return $.post("/v1/company/update_app_version/", params)
}
async function get_app_version(params) {
    return $.getJSON("/v1/company/get_app_version/", params)
}

async function get_app_version_company(params) {
    return $.getJSON("/v1/company/get_app_version_company/", params)
}

async function create_app_version_company(params) {
    return $.post("/v1/company/create_app_version_company/", params)
}
async function update_app_version_company(params) {
    return $.post("/v1/company/update_app_version_company/", params)
}

async function delete_app_version_company(params) {
    return $.post("/v1/company/delete_app_version_company/", params)
}

async function create_app_ipset(params) {
    return $.post("/v1/company/create_app_ipset/", params)
}

async function update_app_ipset(params) {
    return $.post("/v1/company/update_app_ipset/", params)
}

async function delete_app_ipset(params) {
    return $.post("/v1/company/delete_app_ipset/", params)
}

async function get_app_ipset(params) {
    return $.getJSON("/v1/company/get_app_ipset/", params)
}
async function get_app_account(params) {
    return $.getJSON("/v1/company/get_app_account/", params)
}

async function create_app_account(params) {
    return $.post("/v1/company/create_app_account/", params)
}

async function update_app_account(params) {
    return $.post("/v1/company/update_app_account/", params)
}

async function delete_app_account(params) {
    return $.post("/v1/company/delete_app_account/", params)
}

async function get_agency_group(params) {
    return $.getJSON("/v1/company/get_agency_group/", params)
}

async function create_agency_group(params) {
    return $.post("/v1/company/create_agency_group/", params)
}
async function update_agency_group(params) {
    return $.post("/v1/company/update_agency_group/", params)
}
async function delete_agency_group(params) {
    return $.post("/v1/company/delete_agency_group/", params)
}
async function get_app_device(params) {
    return $.getJSON("/v1/company/get_app_device/", params)
}

export {
    get_app_device,
    create_agency_group,
    update_agency_group,
    delete_agency_group,
    get_agency_group,
    delete_app_account,
    update_app_account,
    create_app_account,
    get_app_account,
    get_app_ipset,
    create_app_ipset,
    update_app_ipset,
    delete_app_ipset,
    delete_app_version_company,
    update_app_version_company,
    create_app_version_company,
    get_app_version_company,
    get_app_version,
    update_app_version,
    push_config,
    update_cpe_template_agency,
    get_cpe_template_agency,
    get_cpe_template,
    create_cpe_template,
    update_cpe_template,
    delete_cpe_template,
    get_lan_template,
    delete_client_auth,
    update_client_auth,
    get_client_auth,
    create_client_auth,
    get_wifi,
    get_wifi_config_file,
    set_backup_link,
    out_stock_batch,
    get_logo,
    get_device_version_list,
    send_command,
    delete_empty_link,
    update_empty_link,
    get_cmd_list,
    update_link_batch,
    get_update_task_list,
    delete_device_model,
    update_device_model,
    create_device_model,
    get_device_model,
    delete_area,
    update_area,
    create_area,
    delete_address,
    update_address,
    create_address,
    get_area,
    get_address,
    get_manual_link_path_placeholder,
    exchange_device,
    get_redis_alarm_log,
    deal_alarm,
    get_redis_alarm_stat,
    move_device,
    batch_update_redis_alarm,
    get_redis_alarm,
    get_bandwidth_stat_all,
    get_device_type_stat,
    get_device_model_stat,
    get_request_log,
    get_tunnel_port,
    get_dpi_apps,
    delete_dpi_apps_custom,
    get_dpi_apps_custom,
    create_dpi_apps_custom,
    update_dpi_apps_custom,
    get_app_category,
    get_sn,
    update_stock_batch,
    get_isp_dict,
    update_isp_dict,
    add_isp_dict,
    delete_isp_dict,
    get_dep_tree,
    duplicate_cpe_template,
    update_department,
    update_password,
    reset_password,
    change_activity,
    delete_department,
    add_department,
    delete_related_person,
    create_related_person,
    delete_attachment,
    updateRelatedPerson,
    get_company_related_person,
    get_company_stat,
    delete_company,
    update_speed_rule,
    get_contract_list,
    update_contract,
    create_company_contract,
    create_company_related_person,
    create_company,
    get_related_person_list,
    update_company,
    update_deduplication,
    get_deduplication,
    create_manual_link_path,
    get_manual_link_path_example,
    get_topo_list,
    delete_device,
    get_wan_info,
    get_device_stat,
    delete_iptable,
    create_iptable,
    get_iptable_list,
    create_agency,
    delete_agency,
    delete_agency_batch,
    get_link_path,
    get_speed_rule,
    create_link_batch,
    get_link_list,
    delete_topo_batch,
    delete_topo,
    create_topo,
    delete_link,
    update_link,
    create_link,
    get_device_list,
    get_link,
    get_link_stat,
    get_black_list,
    delete_black_list,
    create_black_list,
    create_isp,
    create_room,
    update_isp,
    update_room,
    delete_isp,
    delete_room,
    get_isp_list,
    getRoomList,
    deleteStock,
    create_stock,
    get_room_list,
    get_agency_list,
    get_company_list,
    out_stock,
    update_stock,
    update_devices,
    update_device,
    getDeviceList,
    get_stock_stat,
    get_stock_list,
    deleteDevice,
    batch_update_company
}