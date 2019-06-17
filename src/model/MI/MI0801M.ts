/*@通用-数据层*/
import {getDeviceList, getOsList,create_update_task,get_os_version} from "../../services/MI/MI0801S";
import {get_company_list, get_device_model, get_update_task_list,get_device_version_list} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace:"mi0801Info",
    state:{
        dataSource:[],
        companyList:[],
        osList:[],
        versionList:[],
        modelList:[],
        deviceVersionList:[]
    },
    effects:{
        *get_device_version_list({payload},{call,put}){
            const backData=yield call(get_device_version_list,payload);
            yield put({
                type:"update",
                payload:{
                    deviceVersionList:backData.result
                }
            })
        },
        *get_device_list({payload},{call,put}){
            const backData=yield call(getDeviceList,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result,
                    total:backData.total,
                }
            })
        },

        *getCompanyList({payload},{call,put}){
            const backData=yield call(get_company_list,payload)
            yield put({
                type:"update",
                payload:{
                    companyList:backData.result
                }
            })
        },
        *getOsList({payload},{call,put}){
            const backData=yield call(get_os_version,payload)
            yield put({
                type:"update",
                payload:{
                    osList:backData.result
                }
            })
        },
        *create_update_task({payload},{call,put}){
            const backData=yield call(create_update_task,payload);
            if(backData.success){
                BossMessage(backData.success,"@下发成功:taskuid:"+backData.task_uuid+"@请稍后去任务中心查看任务结果")
            }else{
                BossMessage(backData.success,"@下发失败:"+backData.result)
            }
        },
        *get_update_task_list({payload},{call,put}){
            const backData=yield call(get_update_task_list,payload);
            yield put({
                type:"update",
                payload:{
                    versionList:backData.result
                }
            })
        },
        *get_device_model({payload},{call,put}){
            const backData=yield call(get_device_model,payload);
            yield put({
                type:"update",
                payload:{
                    modelList:backData.result
                }
            })
        }
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model