/*@通用-数据层*/
import {create_area, delete_area, get_address, get_area, update_area} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "pc0404Info",
    state: {
        areaList: [],
        countryList: [],
        provinceList: []
    },
    effects: {
        * get_area({payload}, {call, put}) {
            const backData = yield call(get_area, payload);
            yield put({
                type: "update",
                payload: {
                    areaList: backData.result
                }
            })
        },
        * get_address({payload}, {call, put}) {
            const backData = yield call(get_address, payload);
            yield put({
                type: "update",
                payload: Object.assign({}, payload.level === 1 ? {countryList: backData.result} : {provinceList: backData.result})
            })
        },
        * create_area({payload}, {call, put}) {
            const backData = yield call(create_area, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_area",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_area({payload}, {call, put}) {
            const backData = yield call(update_area, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_area",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * delete_area({payload}, {call, put}) {
            const backData = yield call(delete_area, payload.update);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_area",
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