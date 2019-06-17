/*@通用-数据层*/
import {get_wifi_template,get_agency_list,get_device_model,get_wifi_template_agency,create_wifi_template_agency,delete_wifi_template_agency,update_wifi_template_agency} from "../../services/BI/BI1903S";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_company_list} from "../../services/Company/companyS";
import {Model} from "dva";
export default {
    namespace: "bi1903Info",
    state: {
        dataSource:[],
        companyList:[],
        WIFITemplateList:[],
        agencyList:[],
        deviceList:[]
    },
    effects: {
        *get_wifi_template_agency({payload},{call,put}){
            const backData=yield call(get_wifi_template_agency,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        }, 
        *get_device_model({payload},{call,put}){
            const backData=yield call(get_device_model,payload);
            yield put({
                type:"update",
                payload:{
                    deviceList: backData.result,
                }
            })
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
         *get_wifi_template({payload},{call,put}){
            const backData=yield call(get_wifi_template,payload);
            yield put({
                type:"update",
                payload:{
                    WIFITemplateList: backData.result,
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
        *create_wifi_template_agency({payload},{call,put}){
            const backData = yield call(create_wifi_template_agency, payload.update);
            console.log(payload)
            if (backData.success) {
                BossMessage(true, "添加成功");
            } else {
                BossMessage(false, "添加失败" + backData.result);
            }
        },
        *delete_wifi_template_agency({payload},{call,put}){
            const backData=yield call(delete_wifi_template_agency,payload.payload);
            if (backData.success) {
                BossMessage(true, "删除成功");
                yield put({
                    type: "get_wifi_template_agency",
                    payload: {
                        company_id:payload.company_id,
                        name:payload.name
                    }
                })
            }else{
                BossMessage(false, "删除失败" + backData.result);
            }
        },
        *update_wifi_template_agency({payload},{call,put}){
            const backData=yield call(update_wifi_template_agency,payload.id);
            if (backData.success) {
                BossMessage(true, "更新成功");
                yield put({
                    type: "get_wifi_template_agency",
                    payload: {
                        company_id:payload.company_id,
                        name:payload.name
                    }
                })
            }else{
                BossMessage(false, "更新失败" + backData.result);
            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model