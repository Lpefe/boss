/*@通用-数据层*/
import {getStatistics, update_app_name} from "../../services/rate/rateS";
import {Model} from "dva";

export default {
    namespace: "ci0302Info",
    state: {
        yNameA: [],
        xDataA: [],
        yNameB: [],
        xDataB: [],
        step_sn_b: [],
        yNameC: [],
        xDataC: [],
        dataSourceA: [],
        dataSourceB: [],
        dataSourceC: [],
        step_sn:"",
    },
    effects: {
        * getStatisticsA({payload}, {call, put}) {
            const backData = yield call(getStatistics, payload);
            if(backData.msg==="ok"){
                let yNameA = backData.data.map((item) => {
                    return item.name
                });
                let xDataA = backData.data.map((item) => {
                    return item.flow
                });
                if (!payload.tableFlag) {
                    yield put({
                        type: "update",
                        payload: {
                            yNameA: yNameA,
                            xDataA: xDataA,
                            dataSourceA: backData.data
                        }
                    })
                } else {
                    yield put({
                        type: "update",
                        payload: {
                            dataSourceA: backData.data
                        }
                    })
                }
            }else{
                yield put({
                    type: "update",
                    payload: {
                        yNameA: "",
                        xDataA: "",
                        dataSourceA: []
                    }
                })
            }

        },
        * getStatisticsB({payload}, {call, put}) {
            const backData = yield call(getStatistics, payload);
            if(backData.msg==="ok") {
                let yNameB = backData.data.map((item) => {
                    return item.agency_name
                });
                let xDataB = backData.data.map((item) => {
                    return item.flow
                });
                let step_sn = backData.data.map((item) => {
                    return item.step_sn
                });
                yield put({
                    type: "update",
                    payload: {
                        yNameB: yNameB,
                        xDataB: xDataB,
                        step_sn_b: step_sn,
                    }
                });
                if(step_sn[0]){
                    const backDataTable = yield call(getStatistics, {
                        item: "apprank",
                        companyid: payload.companyid,
                        start_tm: payload.start_tm,
                        end_tm: payload.end_tm,
                        top: payload.top,
                        step_sn: step_sn[0]
                    });
                    yield put({
                        type: "update",
                        payload: {
                            dataSourceB: backDataTable.data,
                            step_sn: step_sn[0]
                        }
                    })
                }
            }else{
                yield put({
                    type: "update",
                    payload: {
                        yNameB: "",
                        xDataB: [],
                        step_sn_b: "",
                    }
                });
            }
        },
        * getTableB({payload}, {call, put}) {
            const backData = yield call(getStatistics, payload);
            yield put({
                type: "update",
                payload: {
                    dataSourceB: backData.data
                }
            })
        },
        * getStatisticsC({payload}, {call, put}) {
            const backData = yield call(getStatistics, payload);
            if(backData.msg==="ok"){
                let yNameC = backData.data.map((item) => {
                    return item.name
                });
                let xDataC = backData.data.map((item) => {
                    return item.flow
                });
                yield put({
                    type: "update",
                    payload: {
                        yNameC: yNameC,
                        xDataC: xDataC,
                        dataSourceC: backData.data
                    }
                })
            }else{
                yield put({
                    type: "update",
                    payload: {
                        yNameC: "",
                        xDataC: "",
                        dataSourceC: backData.data
                    }
                })
            }

        },
        *update_app_nameA({payload},{call,put}){
            const backData=yield call(update_app_name,payload.edit);
            if(backData.message==="success"){
                const backDataA = yield call(getStatistics, payload.refresh);
                yield put({
                    type: "update",
                    payload: {
                        dataSourceA: backDataA.data
                    }
                })
            }
        },
        *update_app_nameB({payload},{call,put,select}){
            const backData=yield call(update_app_name,payload.edit);
            let step_sn=yield select(state=>state.ci0301Info.step_sn);
            if(backData.message==="success"){
                if(payload.refresh.step_sn===""){
                    payload.refresh.step_sn=step_sn;
                }
                const backDataB = yield call(getStatistics, payload.refresh);
                yield put({
                    type: "update",
                    payload: {
                        dataSourceB: backDataB.data
                    }
                })
            }
        },
        *update_app_nameC({payload},{call,put,select}){
            const backData=yield call(update_app_name,payload.edit);
            if(backData.message==="success"){
                const backDataC = yield call(getStatistics, payload.refresh);
                yield put({
                    type: "update",
                    payload: {
                        dataSourceC: backDataC.data
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