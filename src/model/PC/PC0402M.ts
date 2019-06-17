/*@通用-数据层*/
import {
    create_device_model,
    delete_device_model,
    get_device_model,
    get_wifi_config_file,
    update_device_model
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "pc0402Info",
    state: {
        deviceModelList: [],
        checkFile: ""
    },
    effects: {
        * get_device_model({payload}, {call, put}) {
            const backData = yield call(get_device_model, payload);
            for (let key in backData.result) {
                backData.result[key].ifLte = backData.result[key].lte_no !== 0;
                backData.result[key].ifWifi = backData.result[key].wifi_no !== 0;
                backData.result[key].wifi_bands = backData.result[key].wifi_bands.split(',')
            }
            yield put({
                type: "update",
                payload: {
                    deviceModelList: backData.result
                }
            })
        },

        * create_device_model({payload}, {call, put}) {
            const backData = yield call(create_device_model, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_device_model",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_device_model({payload}, {call, put}) {
            const backData = yield call(update_device_model, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "get_device_model",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * delete_device_model({payload}, {call, put}) {
            const backData = yield call(delete_device_model, payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_device_model",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        },
        * get_wifi_config_file({payload}, {call, put}) {
            const backData = yield call(get_wifi_config_file, payload);
            yield put({
                type: "update",
                payload: {
                    checkFile: backData.result.replace(/\n/gm, "<br/>").replace(/\t/gm, "&emsp;&emsp;&emsp;&emsp;")
                }
            })

        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model