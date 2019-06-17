/*@通用-数据层*/
import {getDeviceList,create_log_task} from "../../services/MI/MI0701S";
import {get_company_list} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace:"mi0701Info",
    state:{
        dataSource:[],
        companyList:[],
    },
    effects:{
        *init({payload},{call,put}){
            const backData=yield call(getDeviceList,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result
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
        *create_log_task({payload},{call}){
            const backData=yield call(create_log_task,payload);
            if(backData.success){
                BossMessage(true, "@下发成功:taskuid:"+backData.task_uuid+"@请稍后去任务中心查看任务结果");
            }
        }
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model