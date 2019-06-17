/*@通用-数据层*/
import {get_cta_wan,create_cta_wan,update_cta_wan,delete_cta_wan,check_lan_only,get_isp_dict,get_available_ports_for_wan,
    get_cta_lan,create_cta_lan,update_cta_lan,delete_cta_lan,get_cta_wifi,
    get_cta_static_ip,create_cta_static_ip,update_cta_static_ip,delete_cta_static_ip,
    create_cta_wifi,update_cta_wifi,delete_cta_wifi,get_cpe_template_agency,get_physical_ports_info,update_cpe_template_agency,
    get_cta_static_route,create_cta_static_route,update_cta_static_route,delete_cta_static_route,
    get_cta_static_parse,create_cta_static_parse,update_cta_static_parse,delete_cta_static_parse,get_ipset_by_cta_lan,update_agency,
    get_start_end_ip} from "../../services/CI/CI2802S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "ci2802Info",
    state: {
        //
        cpeTemplate:[],
        physical:[],
        //WAN
        dataWan:[],
        ispList:[],
        portsList:[],
        checkLan:'',
        checkLans:'',
        //LAN
        dataLan:[],
        ctaStatic:[],
        wifiList:[],
        ipPool:[],
        //WIFI

        //Route
        routeList:[],
        dataWanLan:[],
        //DNS
        dnsList:[],
        //私网IP
        ipset:[],

    },
    effects: {
        //
        *get_physical_ports_info({payload},{call,put}){
            const backData=yield call(get_physical_ports_info,payload);
            yield put({
                type:"update",
                payload:{
                    physical: backData.result,
                }
            })
        }, 
        *get_cpe_template_agency({payload},{call,put}){
            const backData=yield call(get_cpe_template_agency,payload);
            yield put({
                type:"update",
                payload:{
                    cpeTemplate: backData.result,
                }
            })
        }, 
        *update_cpe_template_agency({payload},{call,put}){
            const backData=yield call(update_cpe_template_agency,payload);
            if (backData.success) {
                BossMessage(true, "@更新成功");

            }else{
                BossMessage(false, "@更新失败" + backData.result);
            }
        },
        //WAN
        *get_cta_wan({payload},{call,put}){
            const backData=yield call(get_cta_wan,payload);
            yield put({
                type:"update",
                payload:{
                    dataWan: backData.result,
                }
            })
        }, 
        *get_isp_dict({payload},{call,put}){
            const backData=yield call(get_isp_dict,payload);
            yield put({
                type:"update",
                payload:{
                    ispList:backData.result
                }
            })
        },
        *get_available_ports_for_wan({payload},{call,put}){
            const backData=yield call(get_available_ports_for_wan,payload);
            yield put({
                type:"update",
                payload:{
                    portsList:backData.result
                }
            })
        },  

        *delete_cta_wan({payload},{call,put}){
            const backData=yield call(delete_cta_wan,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_cta_wan",
                    payload: {
                        cta_id:payload.cta_id
                    }
                })
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *create_cta_wan({payload},{call,put}){
            const backData = yield call(create_cta_wan, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_cta_wan",
                    payload: {
                        cta_id:payload.update.cta_id
                    }
                })
                yield put({
                    type:"get_physical_ports_info",
                    payload:{
                        cta_id:payload.update.cta_id
                    }
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        }, 
        *check_lan_only({payload},{call,put}){
            const backData = yield call(check_lan_only, payload);
            if (backData.result) {
                let checkLan ="";
                switch (window.appLocale.locale) {
                        case "en-US":
                            checkLan = "This physical port has been used by "+backData.lan+". Forced use of this port will result in the "+backData.lan+" segment being unavailable."
                            break;
                        case "zh-TW":
                            checkLan = "該物理埠已經被"+backData.lan+"使用，強制使用該埠將會導致"+backData.lan+"網段無法使用."
                            break;
                        default:
                            checkLan = "该物理端口已经被"+backData.lan+"使用，强制使用该端口将会导致"+backData.lan+"网段无法使用."
                            break;
                }
                yield put({
                    type:"update",
                    payload:{
                        checkLan:checkLan,//（"+payload.physical_port+"）
                        checkLans:"error"
                    }
                });
                BossMessage(false, checkLan); //（"+payload.physical_port+"）

            }else{
                yield put({
                    type:"update",
                    payload:{
                        checkLan:"",
                        checkLans:"",
                    }
                })
            } 
        }, 
        *reset_lan_only({payload},{call,put}){
            yield put({
                type:"update",
                payload:{
                    checkLan:"",
                    checkLans:"",
                }
            })
        },   
        *update_cta_wan({payload},{call,put}){
            const backData=yield call(update_cta_wan,payload.update);
            if (backData.success) {
                BossMessage(true, "@更新成功");
                yield put({
                    type: "get_cta_wan",
                    payload: {
                        cta_id:payload.update.cta_id
                    }
                });
                yield put({
                    type:"get_physical_ports_info",
                    payload:{
                        cta_id:payload.update.cta_id
                    }
                })
            }else{
                BossMessage(false, "@更新失败" + backData.result);
            }
        },
        //LAN
        *get_cta_lan({payload},{call,put}){
            const backData=yield call(get_cta_lan,payload);
            yield put({
                type:"update",
                payload:{
                    dataLan: backData.result,
                }
            })
        }, 
        *get_cta_wifi({payload},{call,put}){
            const backData=yield call(get_cta_wifi,payload);
            yield put({
                type:"update",
                payload:{
                    wifiList: backData.result,
                }
            })
        }, 
        *delete_cta_lan({payload},{call,put}){
            const backData=yield call(delete_cta_lan,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_cta_lan",
                    payload: {
                        cta_id:payload.cta_id
                    }
                })
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *create_cta_lan({payload},{call,put}){
            const backData = yield call(create_cta_lan, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_cta_lan",
                    payload: {
                        cta_id:payload.update.cta_id
                    }
                })
                yield put({
                    type:"get_physical_ports_info",
                    payload:{
                        cta_id:payload.update.cta_id
                    }
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },        
        *update_cta_lan({payload},{call,put}){
            const backData=yield call(update_cta_lan,payload.update);
            if (backData.success) {
                BossMessage(true, "@更新成功");
                yield put({
                    type: "get_cta_lan",
                    payload: {
                        cta_id:payload.update.cta_id
                    }
                })
                yield put({
                    type:"get_physical_ports_info",
                    payload:{
                        cta_id:payload.update.cta_id
                    }
                })

            }else{
                BossMessage(false, "@更新失败" + backData.result);
            }
        },
        *get_cta_static_ip({payload},{call,put}){
            const backData=yield call(get_cta_static_ip,payload);
            yield put({
                type:"update",
                payload:{
                    ctaStatic: backData.result,
                }
            })
        }, 
        *create_cta_static_ip({payload},{call,put}){
            const backData = yield call(create_cta_static_ip, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_cta_static_ip",
                    payload:{
                        net_id:payload.update.cta_id,
                        cta_lan_id:payload.update.cta_lan_id
                    }
                });
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *update_cta_static_ip({payload},{call,put}){
            const backData=yield call(update_cta_static_ip,payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
                yield put({
                    type:"get_cta_static_ip",
                    payload:{
                        net_id:payload.update.cta_id,
                        cta_lan_id:payload.update.cta_lan_id
                    }
                });
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
        *delete_cta_static_ip({payload},{call,put}){
            const backData=yield call(delete_cta_static_ip,payload.data);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_cta_static_ip",
                    payload:{
                        net_id:payload.init.net_id,
                        cta_lan_id:payload.init.cta_lan_id
                    }
                });
            }else{
                BossMessage(false, "@删除失败" + backData.result);
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
        //WIFI
        *delete_cta_wifi({payload},{call,put}){
            const backData=yield call(delete_cta_wifi,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_cta_wifi",
                    payload: {
                        cta_id:payload.cta_id
                    }
                })
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *create_cta_wifi({payload},{call,put}){
            const backData = yield call(create_cta_wifi, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },        
        *update_cta_wifi({payload},{call,put}){
            const backData=yield call(update_cta_wifi,payload.update);
            if (backData.success) {
                BossMessage(true, "@更新成功");

            }else{
                BossMessage(false, "@更新失败" + backData.result);
            }
        },
        //router
        *delete_cta_static_route({payload},{call,put}){
            const backData=yield call(delete_cta_static_route,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_cta_static_route",
                    payload: {
                        cta_id:payload.cta_id
                    }
                })
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *create_cta_static_route({payload},{call,put}){
            const backData = yield call(create_cta_static_route, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_cta_static_route",
                    payload: {
                        cta_id:payload.update.cta_id
                    }
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },        
        *update_cta_static_route({payload},{call,put}){
            const backData=yield call(update_cta_static_route,payload.update);
            if (backData.success) {
                BossMessage(true, "@更新成功");
                yield put({
                    type: "get_cta_static_route",
                    payload: {
                        cta_id:payload.update.cta_id
                    }
                })
            }else{
                BossMessage(false, "@更新失败" + backData.result);
            }
        },
        *get_cta_static_route({payload},{call,put}){
            const backData=yield call(get_cta_static_route,payload);
            yield put({
                type:"update",
                payload:{
                    routeList: backData.result,
                }
            })
        }, 
        *get_wan_and_lan({payload},{call,put}){
            const backData1=yield call(get_cta_lan,payload);
            const backData2=yield call(get_cta_wan,payload);
            const backData = backData1.result.concat(backData2.result)
            yield put({
                type:"update",
                payload:{
                    dataWanLan: backData
                }
            })
        }, 
        //DNS
        *delete_cta_static_parse({payload},{call,put}){
            const backData=yield call(delete_cta_static_parse,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_cta_static_parse",
                    payload: {
                        cta_id:payload.cta_id
                    }
                })
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *create_cta_static_parse({payload},{call,put}){
            const backData = yield call(create_cta_static_parse, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },        
        *update_cta_static_parse({payload},{call,put}){
            const backData=yield call(update_cta_static_parse,payload.update);
            if (backData.success) {
                BossMessage(true, "@更新成功");

            }else{
                BossMessage(false, "@更新失败" + backData.result);
            }
        },
        *get_cta_static_parse({payload},{call,put}){
            const backData=yield call(get_cta_static_parse,payload);
            yield put({
                type:"update",
                payload:{
                    dnsList: backData.result,
                }
            })
        }, 
        //IP
        *get_ipset_by_cta_lan({payload},{call,put}){
            const backData=yield call(get_ipset_by_cta_lan,payload);
            yield put({
                type:"update",
                payload:{
                    ipset: backData.result,
                }
            })
        }, 
        *update_agency({payload},{call,put}){
            const backData=yield call(update_agency,payload);
            if (backData.success) {
                BossMessage(true, "@保存成功");

            }else{
                BossMessage(false, "@保存失败" + backData.result);
            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model