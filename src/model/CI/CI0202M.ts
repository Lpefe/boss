/*@通用-数据层*/
import {get_link, get_link_path} from "../../services/Company/companyS";
import {Model} from "dva";


export default {
    namespace: "ci0202Info",
    state: {
        dataSource: [],
        link_info: {},
        link_path: [],
        agency_list: [],
    },
    effects: {
        * get_link({payload}, {call, put}) {
            const backData = yield call(get_link, payload);
            switch (backData.link_info.grade) {
                case "CLOUD_SPLINE":
                    backData.link_info.grade = "@云专线";
                    break;
                case "CLOUD_VPN":
                    backData.link_info.grade = "@云VPN";
                    break;
                case "SUPER_CLOUD_SPLINE":
                    backData.link_info.grade = "@超级云专线";
                    break;
                default:
                    break;
            }
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.device_list,
                    link_info: backData.link_info,
                    agency_list: backData.agency_list
                }
            })
        },
        * get_link_path({payload}, {call, put}) {
            const backData = yield call(get_link_path, payload);
            yield put({
                type: "update",
                payload: {
                    link_path: backData.result
                }
            })
        },
        * reset({payload}, {call, put}) {
            yield put({
                type: "update",
                payload: {
                    chartData: []
                }
            })
        },

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model