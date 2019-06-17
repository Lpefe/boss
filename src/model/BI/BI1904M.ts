/*@通用-数据层*/
import {get_agency_list,get_ssid_template,create_ssid_template_agency,delete_ssid_template_agency,update_ssid_template_agency} from "../../services/BI/BI1903S";
import {get_wifi,update_cta_wifi,get_ap_wifi,get_cta_wifi,get_wifi_config_file,get_cta_lan,get_ap_lan,update_ap_wifi} from "../../services/BI/BI1904S";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_company_list} from "../../services/Company/companyS";
import {Model} from "dva";
export default {
    namespace: "bi1904Info",
    state: {
        dataSource:[],
        companyList:[],
        ssidTemplateList:[],
        agencyList:[],
        configSource:[],
        companyInfo:[],
        dataLan:[],
        apLan:[]
    },
    effects: {
        *get_cta_wifi({payload},{call,put}){
            const backData=yield call(get_cta_wifi,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        },  
        *get_ap_wifi({payload},{call,put}){
            const backData=yield call(get_ap_wifi,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        },   
        *get_wifi_config_file({payload},{call,put}){
            let backData=yield call(get_wifi_config_file,payload);
            var desc = backData.result.replace(/\n/gm,"<br/>").replace(/\t/gm,"&emsp;&emsp;&emsp;&emsp;")

            yield put({
                type:"update",
                payload:{
                    configSource: desc
                }
            })
        },   
        *update_cta_wifi({payload},{call,put}){
            const backData=yield call(update_cta_wifi,payload.update);
            if (backData.success) {
                BossMessage(true, "更新成功");
                yield put({
                    type: "get_wifi",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "更新失败" + backData.result);
            }
        },
        *update_ap_wifi({payload},{call,put}){
            const backData=yield call(update_ap_wifi,payload.update);
            if (backData.success) {
                BossMessage(true, "更新成功");
                yield put({
                    type: "get_wifi",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "更新失败" + backData.result);
            }
        },
        *get_agency_list({payload},{call,put}){
            const backData=yield call(get_agency_list,payload);
            yield put({
                type:"update",
                payload:{
                    agencyList: backData.result,
                }
            })
        },       
         *get_ssid_template({payload},{call,put}){
            const backData=yield call(get_ssid_template,payload);
            yield put({
                type:"update",
                payload:{
                    ssidTemplateList: backData.result,
                }
            })
        },
        *get_company_list({payload},{call,put}){
            const backData=yield call(get_company_list,payload);
            yield put({
                type:"update",
                payload:{
                    companyList:backData.result
                }
            })
        },
        *get_cta_lan({payload},{call,put}){
            const backData=yield call(get_cta_lan,payload);
            yield put({
                type:"update",
                payload:{
                    dataLan: backData.result,
                }
            })
        }, 
        *get_ap_lan({payload},{call,put}){
            const backData=yield call(get_ap_lan,payload);
            yield put({
                type:"update",
                payload:{
                    aptaLan: backData.result,
                }
            })
        }, 

       
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model