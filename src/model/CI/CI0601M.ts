/*@通用-数据层*/
import {getAppConfigList, get_app_priority} from "../../services/CI/CI0601S";
import {
    get_ip_groups,
    get_port_groups,
    createAppConfig,
    deleteAppConfig,
    updateAppConfig,
    update_app_priority,
    batch_change_app_activity,
    update_lte_allowed,
    get_lte_allowed
} from "../../services/CI/CI0601S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

const priorityMap={
    "urgent":4,
    "high":3,
    "medium":2,
    "low":1
};
export default {
    namespace: "ci0601Info",
    state: {
        dataSource: [],
        priorityData: {},
        ipGroupData: [],
        portGroupData: [],
        lteAllowedData:"",
        checked:[],
        urgentspeed:false,
        highspeed:false,
        mediumspeed:false,
        lowspeed:false,
    },
    effects: {
        *getAppConfigList({payload},{call,put}){
            const backData = yield call(getAppConfigList, payload);
            if (backData.result.length > 0) {
                for (let key in backData.result) {
                    if (backData.result[key].ip_group.length > 0) {
                        backData.result[key].ipType = "2"
                    } else {
                        backData.result[key].ipType = "1"
                    }
                    if (backData.result[key].srcip_group.length > 0) {
                        backData.result[key].srcIpType = "2"
                    } else {
                        backData.result[key].srcIpType = "1"
                    }
                    if (backData.result[key].port_group.length > 0) {
                        backData.result[key].portType = "2"
                    } else {
                        backData.result[key].portType = "1"
                    }
                    if(backData.result[key].protocol==="IP"||backData.result[key].protocol==="ICMP"){
                        backData.result[key].hasPort="0"
                    }else{
                        backData.result[key].hasPort="1"
                    }
                }
            }
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.result,
                }
            })
        },

        *get_app_priority({payload},{call,put}){
            const backData = yield call(get_app_priority, payload);
            const checked = backData.result.checked.split(',')
            let urgentspeed=false,highspeed=false,mediumspeed=false,lowspeed=false
            for(let i = 0;i<checked.length;i++){
                switch (checked[i]) {
                    case "1":
                         urgentspeed = true
                         break
                    case "2":
                         highspeed = true
                         break
                    case "3":
                         mediumspeed = true
                         break
                    case "4":
                         lowspeed = true
                         break
                    default:
                        checked[i];
                        break
                }
            }
            yield put({
                type: "update",
                payload: {
                    priorityData: backData.result,
                    checked:backData.result.checked.split(','),
                    urgentspeed:urgentspeed,
                    highspeed:highspeed,
                    mediumspeed:mediumspeed,
                    lowspeed:lowspeed,
                }
            })
        },

        *get_ip_groups({payload},{call,put}){
            const backData = yield call(get_ip_groups, payload);
            yield put({
                type: "update",
                payload: {
                    ipGroupData: backData.result,
                }
            })
        },
        *get_port_groups({payload},{call,put}){
            const backData = yield call(get_port_groups, payload);
            yield put({
                type: "update",
                payload: {
                    portGroupData: backData.result,
                }
            })
        },

        * update_app_priority({payload}, {call, put}) {
            const backData = yield call(update_app_priority, payload);
            if (backData.success) {
                BossMessage(true,"@编辑成功");
                yield put({
                    type:"get_app_priority",
                    payload:{company_id: payload.company_id}
                });
            } else {
                BossMessage(false,"@编辑失败:"+backData.result);
            }
        },
        * createAppConfig({payload}, {call, put}) {
            payload.update.type=priorityMap[payload.update.priority];
            const backData = yield call(createAppConfig, payload.update);
            if (backData.success) {
                BossMessage(backData.success,"@添加成功");
                yield put({
                    type:"getAppConfigList",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }

        },
        * editAppConfig({payload}, {call, put}) {
            payload.update.type=priorityMap[payload.update.priority];
            payload.update.srcip_group = payload.update.srcip_group || [];
            payload.update.port_group = payload.update.port_group || [];
            payload.update.ip_group = payload.update.ip_group || [];
            //根据后台要求匹配参数数据结构
            const backData = yield call(updateAppConfig, payload.update);
            if (backData.success) {
                BossMessage(true,"@编辑成功");
                yield put({
                    type:"getAppConfigList",
                    payload:payload.init
                });
            } else {
                BossMessage(false,"@编辑失败:"+backData.result);
            }
        },
        * deleteAppConfig({payload}, {call, put}) {
            const backData = yield call(deleteAppConfig, payload);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                yield put({
                    type:"getAppConfigList",
                    payload:payload.init
                });
            } else {
                BossMessage(false,"@删除失败:"+backData.result);
            }
        },
        * switchStatus({payload}, {call, put}) {
            const backData = yield call(updateAppConfig, payload);
            if (backData.success) {
                BossMessage(true,payload.is_active ? "@启用成功" : "@禁用成功");
                yield put({
                    type:"getAppConfigList",
                    payload:payload.init
                });
            } else {
                BossMessage(false,backData.result);
            }
        },
        *batch_change_app_activity({payload},{call,put}){
            const backData = yield call(batch_change_app_activity, payload);
            if (backData.success) {
                BossMessage(true,payload.is_active ? "@启用成功" : "@禁用成功");
                yield put({
                    type:"getAppConfigList",
                    payload:payload.init
                });
            } else {
                BossMessage(false,backData.result);
            }
        },
        *update_lte_allowed({payload},{call,put}){
            const backData = yield call(update_lte_allowed, payload);
            if(backData.success){
                BossMessage(true,'@编辑成功');
                yield put({
                    type:"get_lte_allowed",
                    payload:{
                        company_id: payload.company_id
                    }
                })
            }else{
                BossMessage(false,backData.result);
            }
        },
        *get_lte_allowed({payload},{call,put}){
            const backData = yield call(get_lte_allowed, payload);
            yield put({
                type: "update",
                payload: {
                    lteAllowedData: backData.result.allowed,
                }
            })
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model