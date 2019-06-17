/*@通用-数据层*/
import {
    get_dpi_days,
    get_dpi_dstrank,
    get_step_apps,
    get_step_apps_search,
    get_step_class,
    get_steps_beta,
    get_steps_search,
    get_users_dpi,
    get_users_dpi_search,
    get_dpi_dstflow
} from "../../services/rate/rateS";
import moment from 'moment';
import {Model} from "dva";

export default {
    namespace: "ci0303Info",
    state: {
        steps_beta_flow: [],
        step_class_flow: [],
        legendNm: [],
        step_apps_flow: [],
        userFlowRankTableDataSource: [],
        appDayFlowData: [],
        dpiDstRankTableDataSource: []
    },
    effects: {

        * get_steps_beta({payload}, {call, put}) {
            let backData;
            if (payload.name) {
                backData = yield call(get_steps_search, payload);
            } else {
                delete payload.name;
                backData = yield call(get_steps_beta, payload);
            }
            let steps_beta_flow:any[] = [];
            if (backData.msg === "ok") {
                for (let key in backData.data) {
                    let temp:any[] = [];
                    temp.push((backData.data[key].flow / 1024 / 1024).toFixed(2), backData.data[key].device_name/* + "-" + backData.data[key].sn*/, backData.data[key].sn, backData.data[key].device_name);
                    steps_beta_flow.push(temp);
                }
            }
            yield put({
                type: "update",
                payload: {
                    steps_beta_flow: steps_beta_flow
                }
            })
        },

        * get_step_class({payload}, {call, put}) {
            const backData = yield call(get_step_class, payload);
            let step_class_flow:any[] = [];
            let legendNm:any[] = [];
            if (backData.msg === 'ok') {
                for (let key in backData.data) {
                    let temp;
                    temp = {
                        name: backData.data[key].app_category_name,
                        value: (backData.data[key].flow / 1024 / 1024).toFixed(2),
                        idb: backData.data[key].idb
                    };
                    step_class_flow.push(temp);
                    legendNm.push(backData.data[key].app_category_name)
                }
                yield put({
                    type: "update",
                    payload: {
                        step_class_flow: step_class_flow,
                        legendNm: legendNm
                    }
                })
            } else {
                yield put({
                    type: "update",
                    payload: {
                        step_class_flow: step_class_flow,
                        legendNm: legendNm
                    }
                })
            }
        },
        * get_step_apps({payload}, {call, put}) {
            let backData;
            if (payload.name) {
                backData = yield call(get_step_apps_search, payload);
            } else {
                delete payload.name;
                backData = yield call(get_step_apps, payload);
            }
            let step_app_flow:any[] = [];
            if (backData.msg === "ok") {
                for (let key in backData.data) {
                    let temp:any[] = [];
                    temp.push((backData.data[key].flow / 1024 / 1024).toFixed(2), backData.data[key].app_name + "(" + backData.data[key].ids + ")", backData.data[key].ids, backData.data[key].app_name);
                    step_app_flow.push(temp);
                }
                yield put({
                    type: "update",
                    payload: {
                        step_apps_flow: step_app_flow
                    }
                });
            }
        },

        * get_users_dpi({payload}, {call, put}) {
            try{
                let backData;
                if (payload.sip) {
                    backData = yield call(get_users_dpi_search, payload)
                } else {
                    backData = yield call(get_users_dpi, payload);
                }
                if (backData.msg === "ok") {
                    yield put({
                        type: "update",
                        payload: {
                            userFlowRankTableDataSource: backData.data.length?backData.data:[backData.data]
                        }
                    })
                }
            }catch(err){
                console.error(err);
            }

        },
        * get_dpi_days({payload}, {call, put}) {
            const backData = yield call(get_dpi_days, payload);
            if (backData.msg === "ok") {
                let dayFlow:any[] = [];
                for (let key in backData.data) {
                    dayFlow.push([moment(backData.data[key].time * 1000).format("YYYY-MM-DD"), (backData.data[key].flow / 1024 / 1024).toFixed(2)])
                }
                yield put({
                    type: "update",
                    payload: {
                        appDayFlowData: dayFlow
                    }
                })

            }
        },
        * get_dpi_dstrank({payload}, {call, put}) {
            let backData;
            if (payload.dip) {
                backData = yield call(get_dpi_dstflow, payload)
            } else {
                backData =yield call(get_dpi_dstrank, payload);
            }
            if (backData.msg === "ok") {
                yield put({
                    type: "update",
                    payload: {
                        dpiDstRankTableDataSource: backData.data
                    }
                })
            }
        }

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model