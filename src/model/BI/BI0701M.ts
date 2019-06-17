/*@通用-数据层*/
import {get_bills,delete_bill} from '../../services/BI/BI0701S'
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "bi0701Info",
    state: {
        billList:[]
    },
    effects: {
        * get_bills({payload}, {call, put}) {
            const backData = yield call(get_bills, payload);
            yield put({
                type:"update",
                payload:{
                    billList:backData.result
                }
            })
        },
        *delete_bill({payload},{call,put}){
            const backData = yield call(delete_bill, payload);
            if (backData.success) {
                BossMessage(true,"删除成功");
                let result = yield call(get_bills, {});
                yield put({
                    type: "update",
                    payload: {
                        billList: result.result
                    }
                })
            } else {
                BossMessage(false,"删除失败:"+backData.result);
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model