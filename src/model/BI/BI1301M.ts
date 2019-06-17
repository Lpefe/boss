/*@通用-数据层*/
import {get_app_category, get_dpi_apps} from '../../services/Company/companyS';
import {Model} from "dva";

export default {
    namespace: "bi1301Info",
    state: {
        dataSource: [],
        appCategory:[]
    },
    effects: {
        * get_dpi_apps({payload}, {call, put}) {
            const backData = yield call(get_dpi_apps, payload)
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.result
                }
            })

        },
        * get_app_category({payload}, {call, put}) {
            const backData = yield call(get_app_category, payload);
            yield put({
                type:"update",
                payload:{
                    appCategory:backData.result
                }
            })
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model