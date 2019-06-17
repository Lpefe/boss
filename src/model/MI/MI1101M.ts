/*@通用-数据层*/
import {add_isp_dict, delete_isp_dict, get_isp_dict, update_isp_dict} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "mi1101Info",
    state: {
        ispData: []
    },
    effects: {
        * get_isp_dict({payload}, {call, put}) {
            const backData = yield call(get_isp_dict, payload);
            yield put({
                type: "update",
                payload: {
                    ispData: backData.result
                }
            })
        },
        * add_isp_dict({payload}, {call, put}) {
            const backData = yield call(add_isp_dict, payload);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_isp_dict",
                    payload: {}
                })
            } else {
                BossMessage(false, "@添加失败");
            }
        },
        * update_isp_dict({payload}, {call, put}) {
            const backData = yield call(update_isp_dict, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "get_isp_dict",
                    payload: {}
                })
            } else {
                BossMessage(false, "@编辑失败");
            }
        },
        * delete_isp_dict({payload}, {call, put}) {
            const backData = yield call(delete_isp_dict, payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_isp_dict",
                    payload: {}
                })
            } else {
                BossMessage(false, "@删除失败");
            }
        }

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model