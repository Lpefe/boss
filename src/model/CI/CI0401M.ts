/*@通用-数据层*/
import {getHistoryRate, getTodayRate} from "../../services/CI/CI0401S";
import { GetTodayRateRes,HistoryRate} from "../../interface/CI0401I";
import {Model} from "dva";

export default {
    namespace: "ci0401Info",
    state: {
        dataSource: [],
        modalDataSource: []
    },
    effects: {
        * init({payload}, {call, put}) {
            const backData:GetTodayRateRes=yield call(getTodayRate,payload);
            if(backData.success){
                yield put({
                    type: "update",
                    payload: {
                        dataSource: backData.result
                    }
                })
            }
        },
        * getHistoryRate({payload}, {call, put}) {
            const backData:HistoryRate = yield call(getHistoryRate, payload);
            if(backData.success){
                yield put({
                    type: "update",
                    payload: {
                        modalDataSource: backData.result
                    }
                })
            }

        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model