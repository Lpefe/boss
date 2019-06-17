/*@通用-数据层*/
import {get_company_list} from "../../services/CI/CI1001S";
import {
    create_link,
    create_link_batch,
    delete_empty_link,
    delete_link,
    get_agency_list,
    get_device_list,
    get_link_list,
    get_link_stat,
    get_speed_rule,
    update_empty_link,
    update_link,
    set_backup_link,
    update_link_batch
} from "../../services/Company/companyS";
import _ from "lodash";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "bi1101Info",
    state: {
        companyList: [],
        agencyListCenter: [],
        agencyListEdge: [],
        agencyListCenterBatch: [],
        agencyListEdgeBatch: [],
        deviceList: [],
        typeList: [],
        linkList: [],
        linkStat: [],
        total: 0,
        HALinkList: []
    },
    effects: {
        * get_link_list({payload}, {call, put}) {
            const backData = yield call(get_link_list, payload);
            yield put({
                type: "update",
                payload: {
                    linkList: backData.result,
                    total:backData.total
                }
            })
        },
        * get_link_stat({payload}, {call, put}) {
            const backData = yield call(get_link_stat, payload);
            let total = _.get(backData, 'INIT', 0) + _.get(backData, 'ONLINE', 0) + _.get(backData, 'OFFLINE', 0);
            yield put({
                type: 'update',
                payload: {
                    linkStat: backData,
                    total: total
                }
            })
        },
        * get_agency_list({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            if (backData.result) {
                if (payload.type === "CSTEP") {
                    yield put({
                        type: "update",
                        payload: {
                            agencyListCenter: backData.result
                        }
                    })
                } else {
                    yield put({
                        type: "update",
                        payload: {
                            agencyListEdge: backData.result
                        }
                    })
                }
            }
        },
        * get_agency_list_batch({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            if (backData.result) {
                if (payload.type === "CSTEP") {
                    yield put({
                        type: "update",
                        payload: {
                            agencyListCenterBatch: backData.result
                        }
                    })
                } else {
                    yield put({
                        type: "update",
                        payload: {
                            agencyListEdgeBatch: backData.result
                        }
                    })
                }
            }
        },
        * get_company_list({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            if (backData.result) {
                yield put({
                    type: "update",
                    payload: {
                        companyList: backData.result
                    }
                })
            }
        },
        * get_device_list({payload}, {call, put}) {
            const backData = yield call(get_device_list, payload);
            yield put({
                type: "update",
                payload: {
                    deviceList: backData.result
                }
            })
        },
        * reset_device_list({payload}, {put}) {
            yield put({
                type: "update",
                payload: {
                    deviceList: []
                }
            })
        },
        * get_speed_rule({payload}, {call, put}) {
            const backData = yield call(get_speed_rule, payload);
            yield put({
                type: "update",
                payload: {
                    typeList: backData.options
                }
            })
        },
        * create_link({payload}, {call, put}) {
            const backData = yield call(create_link, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_link_list",
                    payload: payload.init
                })
                yield put({
                    type: "get_link_stat",
                    payload: {}
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_link({payload}, {call, put}) {
            let backData;
            if (payload.update.has_device_id) {
                backData = yield call(update_link, payload.update);
            } else {
                backData = yield call(update_empty_link, payload.update);
            }
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "get_link_list",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * create_link_batch({payload}, {call, put}) {
            const backData = yield call(create_link_batch, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_link_list",
                    payload: payload.init
                })
                yield put({
                    type: "get_link_stat",
                    payload: {}
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * delete_link({payload}, {call, put}) {
            let backData;
            if (payload.delete.records[0].device_id) {
                backData = yield call(delete_link, payload.delete);
            } else {
                backData = yield call(delete_empty_link, payload.delete);
            }

            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_link_list",
                    payload: payload.init
                })
                yield put({
                    type: "get_link_stat",
                    payload: {}
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        },
        * delete_link_batch({payload}, {call, put}) {
            let backDataLink = yield call(delete_link, payload.delete);
            let backDataEmptyLink = yield call(delete_empty_link, payload.deleteEmpty);
            if (backDataLink.success && backDataEmptyLink.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_link_list",
                    payload: payload.init
                })
                yield put({
                    type: "get_link_stat",
                    payload: {}
                })
            } else {
                BossMessage(false, "@删除失败");
            }
        },
        * get_link_list_HA_center({payload}, {call, put}) {
            const backData = yield call(get_link_list, payload);
            yield put({
                type: "update",
                payload: {
                    HALinkList: backData.result
                }
            })
        },
        * get_link_list_HA_edge({payload}, {call, put}) {
            const backData = yield call(get_link_list, payload);
            yield put({
                type: "update",
                payload: {
                    HALinkList: backData.result
                }
            })
        },
        *set_backup_link({payload},{call,put}){
            const backData = yield call(set_backup_link, payload.update);
            if(backData.success){
                BossMessage(true, "修改成功");
                yield put({
                    type: "get_link_list",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "@编辑失败"+backData.result);
            }
        },
        *update_link_batch({payload},{call,put}){
            delete payload.update.ifEditBandwidth;
            delete payload.update.ifEditGrade;
            const backData = yield call(update_link_batch, payload.update);
            if(backData.success){
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "get_link_list",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "@编辑失败"+backData.result);
            }
        }

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model