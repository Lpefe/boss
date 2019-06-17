/*@通用-数据层*/
import {get_agency_list, update_ssid_template_agency} from "../../services/BI/BI1903S";
import {
    create_cpe_template_agency,
    delete_cpe_template_agency,
    get_cpe_template,
    get_cpe_template_agency,
    get_device_model
} from "../../services/CI/CI2801S";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_company_list} from '../../services/Company/companyS';
import {Model} from "dva";

export default {
    namespace: "ci2801Info",
    state: {
        dataSource: [],
        deviceList: [],
        cpeList: [],
        ssidTemplateList: [],
        agencyList: [],
        companyList: []
    },
    effects: {
        * get_cpe_template_agency({payload}, {call, put}) {
            if (payload.company_id === 1) {
                delete payload.company_id;
            }
            const backData = yield call(get_cpe_template_agency, payload);
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.result,
                }
            })
        },
        * get_device_model({payload}, {call, put}) {
            const backData = yield call(get_device_model, payload);
            yield put({
                type: "update",
                payload: {
                    deviceList: backData.result
                }
            })
        },
        * get_cpe_template({payload}, {call, put}) {
            const backData = yield call(get_cpe_template, payload);
            yield put({
                type: "update",
                payload: {
                    cpeList: backData.result
                }
            })
        },
        * get_agency_list({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            yield put({
                type: "update",
                payload: {
                    agencyList: backData.result,
                }
            })
        },

        * delete_cpe_template_agency({payload}, {call, put}) {
            const backData = yield call(delete_cpe_template_agency, payload.payload);
            if (payload.company_id === 1) {
                delete payload.init.company_id;
            }
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_cpe_template_agency",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        * create_cpe_template_agency({payload}, {call, put}) {
            const backData = yield call(create_cpe_template_agency, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_ssid_template_agency({payload}, {call, put}) {
            const backData = yield call(update_ssid_template_agency, payload.id);
            if (backData.success) {
                BossMessage(true, "@更新成功");
                yield put({
                    type: "get_cpe_template_agency",
                    payload: {
                        company_id: payload.company_id,
                        name: payload.name
                    }
                })
            } else {
                BossMessage(false, "@更新失败" + backData.result);
            }
        },
        * get_company_list({payload}, {call, put}) {
            if (sessionStorage.getItem('companyId') === "1") {
                delete payload.company_id;
            }
            const backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result,
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