/*@通用-数据层*/
import {create_log_task} from "../../services/MI/MI0701S";
import {get_alarm_list} from "../../services/Alarm/alarmS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace:"mi0901Info",
    state:{
        dataSource:[]
    },
    effects:{
        *init({payload},{call,put}){
            const backData=yield call(get_alarm_list,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result
                }
            })
        },
        *create_log_task({payload},{call,put}){
            const backData=yield call(create_log_task,payload);
            if(backData.success){
                BossMessage(true, "taskuid:"+backData.task_uuid+"@请稍后去任务中心查看任务结果");
            }
        }
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model