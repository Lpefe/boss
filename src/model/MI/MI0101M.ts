/*@通用-数据层*/
import {
    deleteDevice,
    get_company_list,
    get_device_stat,
    getDeviceList,
    send_command,
    update_device,
    update_devices,
    get_device_model
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "mi0101Info",
    state: {
        dataSource: [],
        companyList: [],
        deviceStat: {},
        deviceModelList:[]
    },
    effects: {
        *get_device_model({payload},{call,put}){
            const backData = yield call(get_device_model, payload);
            yield put({
                type: "update",
                payload: {
                    deviceModelList: backData.result
                }
            })
        },

        * getCompanyList({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload)
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })
        },
        * getDeviceList({payload}, {call, put}) {
            const backData = yield call(getDeviceList, payload)
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.result
                }
            })
        },
        * get_device_stat({payload}, {call, put}) {
            const backData = yield call(get_device_stat, payload);
            yield put({
                type: "update",
                payload: {
                    deviceStat: backData
                }
            })
        },
        * deleteDevice({payload}, {call, put}) {
            const backData = yield call(deleteDevice, payload.delete);
            if (!backData.success) {
                BossMessage(false, "@删除失败")
            } else {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "getDeviceList",
                    payload: payload.init
                })
            }
        },
        * update_devices({payload}, {call, put}) {
            const backData = yield call(update_devices, payload.switch);
            if (backData.success) {
                BossMessage(true, "@切换技术状态成功");
                yield put({
                    type: "getDeviceList",
                    payload: payload.init
                });
            } else {
                BossMessage(false, "@切换技术状态失败")
            }
        },
        * update_device_ip({payload}, {call, put}) {
            const backData = yield call(update_device, payload.switch);
            if (!backData.success) {
                BossMessage(false, "@修改IP地址失败:" + backData.result)
            } else {
                BossMessage(true, "@修改IP地址成功");
                yield put({
                    type: "getDeviceList",
                    payload: payload.init
                })
            }
        },
        * send_command({payload}, {call}) {
            const backData = yield call(send_command, payload);
            if (backData.success) {
                BossMessage(true, "@执行命令成功")
            } else {
                BossMessage(false, "@执行命令失败")
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model