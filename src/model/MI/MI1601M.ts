/*@通用-数据层*/
import {get_device_model, get_stock_list, get_stock_stat, update_stock} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "mi1601Info",
    state: {
        deviceStatDataSource: [],
        deviceList: [],
        modelList:[],
    },
    effects: {
        * get_stock_stat({payload}, {call, put}) {
            const backData = yield call(get_stock_stat, payload);
            if (backData.success) {
                yield put({
                    type: "update",
                    payload: {
                        deviceStatDataSource: backData.result
                    }
                })
            }
        },
        * get_stock_list({payload}, {call, put}) {
            const backData = yield call(get_stock_list, payload);
            yield put({
                type: "update",
                payload: {
                    deviceList: backData.result
                }
            })
        },
        * update_stock({payload}, {call, put}) {
            const backData = yield call(update_stock, payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
                yield put({
                    type:"get_stock_list",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@修改失败"+backData.result);
            }
        },
        *get_device_model({payload},{call,put}){
            const backData = yield call(get_device_model, payload);
            yield put({
                type:"update",
                payload:{
                    modelList:backData.result
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