/*@通用-数据层*/
import {create_lan_template,get_lan_template,update_lan_template,delete_lan_template,get_static_ip,create_static_ip,update_static_ip,delete_static_ip} from "../../services/CI/CI3301S";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_start_end_ip} from "../../services/CI/CI2802S";
import {get_company_list} from "../../services/CI/CI1001S";
import {Model} from "dva";
export default {
    namespace: "ci3301Info",
    state: {
        dataSource:[],
        deviceList:[],
        templateList:[],
        dataSourceScan:[],
        companyList:[],
        ipPool:[]
    },
    effects: {
        *get_lan_template({payload},{call,put}){
            const backData=yield call(get_lan_template,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        },
        *get_static_ip({payload},{call,put}){
            const backData=yield call(get_static_ip,payload);
            yield put({
                type:"update",
                payload:{
                    dataSourceScan: backData.result,
                }
            })
        },
        * get_company_list({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })
        },
        // *duplicate_wifi_template({payload},{call,put}){
        //     const backData=yield call(duplicate_wifi_template,payload.data);
        //     if (backData.success) {
        //         BossMessage(true, "复制成功");
        //         yield put({
        //             type:"get_wifi_template",
        //             payload:{
        //                 company_id:parseInt(sessionStorage.getItem("companyId")),
        //                 name:payload.init.selectName
        //             }
        //         });
        //     } else {
        //         BossMessage(false, "复制失败" + backData.result);
        //     }
        // },
        // *get_device_model({payload},{call,put}){
        //     const backData=yield call(get_device_model,payload);
        //     yield put({
        //         type:"update",
        //         payload:{
        //             deviceList:backData.result
        //         }
        //     })
        // },create_static_ip

        *create_static_ip({payload},{call,put}){
            const backData = yield call(create_static_ip, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_static_ip",
                    payload:{
                        net_id:payload.update.net_id
                    }
                });
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *update_static_ip({payload},{call,put}){
            const backData=yield call(update_static_ip,payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");

                yield put({
                    type:"get_static_ip",
                    payload:{
                        net_id:payload.update.net_id
                    }
                });

            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
        *create_lan_template({payload},{call,put}){
            const backData = yield call(create_lan_template, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *delete_lan_template({payload},{call,put}){
            const backData=yield call(delete_lan_template,payload.init);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_lan_template",
                    payload:{
                        company_id:payload.init.companyId,
                        name:payload.init.selectName
                    }
                });
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *delete_static_ip({payload},{call,put}){
            const backData=yield call(delete_static_ip,payload.data);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_static_ip",
                    payload:{
                        net_id:payload.init.net_id
                    }
                });
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *update_lan_template({payload},{call,put}){
            const backData=yield call(update_lan_template,payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
        *get_start_end_ip({payload},{call,put}){
            const backData=yield call(get_start_end_ip,payload);
            yield put({
                type:"update",
                payload:{
                    ipPool: backData.result,
                }
            })
        }, 
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model