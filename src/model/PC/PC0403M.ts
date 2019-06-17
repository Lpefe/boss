/*@通用-数据层*/
import {create_address, delete_address, get_address, update_address,} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";


export default {
    namespace: "pc0403Info",
    state: {
        addressList: [],
        countryList: [],
        provinceList: [],
    },
    effects: {
        * get_address({payload}, {call, put}) {
            const backData = yield call(get_address, payload);
            yield put({
                type: "update",
                payload: {
                    addressList: backData.result
                }
            })
        },
        * get_address_options({payload}, {call, put}) {
            const backData = yield call(get_address, payload);
            yield put({
                type: "update",
                payload: Object.assign({}, payload.level === 1 ? {countryList: backData.result} : {provinceList: backData.result})
            })
        },
        * create_address({payload}, {call, put}) {
            const backData = yield call(create_address, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_address",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_address({payload}, {call, put}) {
            const backData = yield call(update_address, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_address",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * delete_address({payload}, {call, put}) {
            const backData = yield call(delete_address, payload.update);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                yield put({
                    type:"get_address",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model