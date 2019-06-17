/*@通用-数据层*/
import moment from 'moment';
import {get_srcip_list, getStatistics, update_app_name} from "../../services/rate/rateS";
import {Model} from "dva";

export default {
    namespace: "ci0301Info",
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
        step_sn: "",
        lineSeriesA: [{
            type: "line", data: []
        }],
        tableDataA: [],
        lineSeriesC: [{
            type: "line", data: []
        }],
        tableDataC: [],
        srcIpList: [],
        lineSeriesB: [{
            type: "line", data: []
        }],
    },
    effects: {
        * getStatisticsA({payload}, {call, put}) {
            const backData = yield call(getStatistics, payload);
            if (backData.msg === "ok") {
                let lineSeries = backData.data.map((item, index) => {
                    let data:any[] = [];
                    for (let key in item.bands) {
                        data.push([moment.unix(item.bands[key].time).format("YYYY-MM-DD HH:mm:ss"), (item.bands[key].band / 1024).toFixed(4)])
                    }
                    return {
                        name: "(" + (index + 1) + "). " + item.app.name,
                        type: "line",
                        id: index,
                        data: data,
                        smooth: true,
                        smoothMonotone: "x",
                        showSymbol: false,
                    }
                });
                let tableData = backData.data.map((item) => {
                    return item.app
                });

                yield put({
                    type: "update",
                    payload: {
                        lineSeriesA: lineSeries,
                        tableDataA: tableData
                    }
                })
            } else {
                yield put({
                    type: "update",
                    payload: {
                        lineSeriesA: [{
                            type: "line", data: []
                        }],
                        tableDataA: []
                    }
                })
            }


        },
        * getStatisticsB({payload}, {call, put}) {
            const backData = yield call(getStatistics, payload);
            if (backData.msg === "ok") {
                let lineSeries:any[] = [];
                backData.data.map((item, index) => {
                    let dataUp:any[] = [];
                    let dataDown:any[] = [];
                    for (let key in item.bandwidth) {
                        dataUp.push([moment.unix(item.bandwidth[key].time).format("YYYY-MM-DD HH:mm:ss"), (item.bandwidth[key].ratetx / 1024).toFixed(4)]);
                        dataDown.push([moment.unix(item.bandwidth[key].time).format("YYYY-MM-DD HH:mm:ss"), (item.bandwidth[key].raterx / 1024).toFixed(4)])
                    }
                    let lineSeriesPerAgency = [{
                        name: "(" + (index + 1) + "). " + item.agency_name + "-上行",
                        type: "line",
                        id: index + "up",
                        data: dataUp,
                        smoothMonotone: "x",
                        smooth: true,
                        showSymbol: false,
                    }, {
                        name: "(" + (index + 1) + "). " + item.agency_name + "-下行",
                        type: "line",
                        id: index + "down",
                        data: dataDown,
                        smoothMonotone: "x",
                        smooth: true,
                        showSymbol: false,
                    },];
                    lineSeries=lineSeries.concat(lineSeriesPerAgency);
                    return 0;
                });

                yield put({
                    type: "update",
                    payload: {
                        lineSeriesB: lineSeries,
                    }
                });
            } else {
                yield put({
                    type: "update",
                    payload: {
                        lineSeriesB: [{
                            type: "line", data: []
                        }],
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
            if (backData.msg === "ok") {
                let lineSeries = backData.data.map((item, index) => {
                    let data:any[] = [];
                    for (let key in item.bands) {
                        data.push([moment.unix(item.bands[key].time).format("YYYY-MM-DD HH:mm:ss"), (item.bands[key].band / 1024).toFixed(4)])
                    }
                    return {
                        name: "(" + (index + 1) + "). " + item.app.name,
                        type: "line",
                        id: index,
                        data: data,
                        smooth: true,
                        smoothMonotone: "x",
                        showSymbol: false,
                    }
                });
                let tableData = backData.data.map((item) => {
                    return item.app
                });

                yield put({
                    type: "update",
                    payload: {
                        lineSeriesC: lineSeries,
                        tableDataC: tableData
                    }
                })
            } else {
                yield put({
                    type: "update",
                    payload: {
                        lineSeriesC: [{
                            type: "line", data: []
                        }],
                        tableDataC: []
                    }
                })
            }

        },
        * update_app_nameA({payload}, {call, put}) {
            const backData = yield call(update_app_name, payload.edit);
            if (backData.message === "success") {
                const backDataA = yield call(getStatistics, payload.refresh);
                let tableData = backDataA.data.map((item) => {
                    return item.app
                });

                yield put({
                    type: "update",
                    payload: {
                        tableDataA: tableData
                    }
                })
            }
        },
        * update_app_nameB({payload}, {call, put, select}) {
            const backData = yield call(update_app_name, payload.edit);
            let step_sn = yield select(state => state.ci0301Info.step_sn);
            if (backData.message === "success") {
                if (payload.refresh.step_sn === "") {
                    payload.refresh.step_sn = step_sn;
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
        * update_app_nameC({payload}, {call, put, select}) {
            const backData = yield call(update_app_name, payload.edit);
            if (backData.message === "success") {
                const backDataC = yield call(getStatistics, payload.refresh);
                let tableData = backDataC.data.map((item) => {
                    return item.app
                });
                yield put({
                    type: "update",
                    payload: {
                        tableDataC: tableData
                    }
                })
            }
        },
        * get_srcip_list({payload}, {call, put}) {
            const backData = yield call(get_srcip_list, payload);
            if (backData.msg === 'ok') {
                let srcIpList = backData.data.map((item) => {
                    return {
                        src_ip: item,
                        dst_ip: payload.dst_ip,
                        dst_port: payload.dst_port,
                        name: payload.name
                    }
                });
                yield put({
                    type: "update",
                    payload: {
                        srcIpList: srcIpList
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