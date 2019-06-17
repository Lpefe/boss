/*@通用-数据层*/
import {get_redis_alarm_log} from "../../services/Company/companyS";
import {Model} from "dva";

export default {
    namespace: "mi1802Info",
    state: {
        alarmLogList:[]
    },
    effects: {
        *get_redis_alarm_log({payload},{call,put}){
            const backData=yield call(get_redis_alarm_log,payload);
            yield put({
                type:"update",
                payload:{
                    alarmLogList: backData.result
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