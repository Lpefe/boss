/*@通用-数据层*/
import {get_topo_list} from "../../services/CI/CI1001S";
import {
    create_link,
    create_topo, delete_link,
    delete_topo,
    delete_topo_batch, get_company_list,
    get_device_list,
    get_link_list,
    get_link_stat, get_speed_rule, update_link
} from "../../services/Company/companyS";
import {get_link_alarm_list} from "../../services/Alarm/alarmS";
import _ from 'lodash';
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "ci0201Info",
    state: {
        dataSource: [],
        linkStat: {},
        total: 0,
        topoList: [],
        deviceList: [],
        speedRule: [],
        linkTotal:0,
        companyList:[],
    },
    effects: {

        *get_company_list({payload},{call,put}){
            const backData = yield call(get_company_list, payload);
            yield put({
                type: 'update',
                payload: {
                    companyList:backData.result
                }
            })
        },
        * get_link_list({payload}, {call, put}) {
            const backData = yield call(get_link_list, payload);
            yield put({
                type: 'update',
                payload: {
                    dataSource: backData.result,
                    linkTotal:backData.total
                }
            })
        },

        * get_link_stat({payload}, {call, put}) {
            const backData = yield call(get_link_stat, payload);
            let total = _.get(backData,'INIT',0)+_.get(backData,'ONLINE',0)+_.get(backData,'OFFLINE',0);
            yield put({
                type: 'update',
                payload: {
                    linkStat: backData,
                    total: total
                }
            })
        },
        * get_speed_rule({payload}, {call, put}) {
            const backData = yield call(get_speed_rule, payload);
            yield put({
                type: 'update',
                payload: {
                    speedRule: backData.options
                }
            })
        },
        * get_device_list({payload}, {call, put}) {
            const backData = yield call(get_device_list, payload);
            yield put({
                type: 'update',
                payload: {
                    deviceList: backData.result
                }
            })

        },
        * get_topo_list({payload}, {call, put}) {
            const backData = yield call(get_topo_list, payload);
            yield put({
                type: 'update',
                payload: {
                    topoList: backData.result
                }
            })
        },
        * create_topo({payload}, {call, put}) {
            const backData = yield call(create_topo, payload);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                const backData1 = yield call(get_link_list, {
                    company_id: sessionStorage.getItem("companyId"),
                });
                yield put({
                    type: 'update',
                    payload: {
                        dataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * delete_topo({payload}, {call, put}) {
            const backData = yield call(delete_topo, payload);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                const backData1 = yield call(get_link_list, {
                    company_id: sessionStorage.getItem("companyId"),
                });
                yield put({
                    type: 'update',
                    payload: {
                        dataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result)
            }
        },
        * delete_topo_batch({payload}, {call, put}) {
            const backData = yield call(delete_topo_batch, payload);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                const backData1 = yield call(get_link_list, {
                    company_id: sessionStorage.getItem("companyId"),
                });
                yield put({
                    type: 'update',
                    payload: {
                        dataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        },
        * create_link({payload}, {call, put}) {
            const backData = yield call(create_link, payload);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                const backData1 = yield call(get_link_list, {
                    topo_id: payload.topo_id
                });
                yield put({
                    type: 'update',
                    payload: {
                        dataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }

        },
        * update_link({payload}, {call, put}) {
            const backData = yield call(update_link, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                const backData1 = yield call(get_link_list, {
                    topo_id: payload.topo_id
                });
                yield put({
                    type: 'update',
                    payload: {
                        dataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * delete_link({payload}, {call, put}) {
            const backData = yield call(delete_link, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                const backData1 = yield call(get_link_list, {
                    topo_id: payload.topo_id
                });
                yield put({
                    type: 'update',
                    payload: {
                        dataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * get_link_alarm_list({payload}, {call, put}) {
            const backData = yield call(get_link_alarm_list, payload);
            yield put({
                type: 'update',
                payload: {
                    alarmList: backData.result,
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