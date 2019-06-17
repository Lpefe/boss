/*@通用-数据层*/
import {get_agency_list,get_ssid_template,create_ssid_template_agency,delete_ssid_template_agency,update_ssid_template_agency} from "../../services/BI/BI1903S";
import {get_wifi,update_wifi,get_wifi_config_file} from "../../services/BI/BI1904S";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_company_list} from "../../services/Company/companyS";
import {Model} from "dva";
export default {
    namespace: "ci2704Info",
    state: {
        dataSource:[],
        companyList:[],
        ssidTemplateList:[],
        agencyList:[],
        configSource:[],
        companyInfo:[]
    },
    effects: {
        *get_wifi({payload},{call,put}){
            const backData=yield call(get_wifi,payload);
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
        *update_wifi({payload},{call,put}){
            const backData=yield call(update_wifi,payload.update);
            if (backData.success) {
                BossMessage(true, "@更新成功");
                yield put({
                    type: "get_wifi",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "@更新失败" + backData.result);
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
        *create_ssid_template_agency({payload},{call,put}){
            const backData = yield call(create_ssid_template_agency, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_ssid_template",
                    payload:{}
                });
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *delete_ssid_template_agency({payload},{call,put}){
            const backData=yield call(delete_ssid_template_agency,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_ssid_template_agency",
                    payload: {}
                })
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *update_ssid_template_agency({payload},{call,put}){
            const backData=yield call(update_ssid_template_agency,payload);
            if (backData.success) {
                BossMessage(true, "@更新成功");
                yield put({
                    type: "get_ssid_template_agency",
                    payload: {}
                })
            }else{
                BossMessage(false, "@更新失败" + backData.result);
            }
        },
       
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model