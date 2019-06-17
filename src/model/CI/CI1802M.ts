/*@通用-数据层*/
import moment from 'moment';
import {get_4g_flow, get_days4g} from "../../services/rate/rateS";
import {Model} from "dva";
function get_day_in_month(month) {
    let selectedMonth = moment(month).month();
    let currentMonth = moment().month();
    if (selectedMonth === currentMonth) {
        let firstDay=moment(month).startOf('month').format("YYYY-MM-DD");
        let endDay=moment().format("YYYY-MM-DD");

    } else {
        let firstDay=moment(month).startOf('month').format("YYYY-MM-DD");
        let endDay=moment(month).endOf('month').format("YYYY-MM-DD");
    }
}


export default {
    namespace: "ci1802Info",
    state: {
        monthSeries: [],
        daySeries: [],
        monthTotal: 0
    },
    effects: {
        * get_4g_flow({payload}, {call, put}) {
            const backData = yield call(get_4g_flow, payload);
            let monthSeries:any[] = [{
                type: "line",
                name: '@月流量',
                data: [],
            }];
            if (backData.msg === 'ok') {
                if (backData.data[0]) {
                    get_day_in_month(payload.month);
                    for (let key in backData.data[0].months) {
                        monthSeries[0].data.push([backData.data[0].months[key].month, (backData.data[0].months[key].flow / 1024 / 1024).toFixed(2)])
                    }
                }
            }
            yield put({
                type: "update",
                payload: {
                    monthSeries: monthSeries
                }
            })
        },
        * get_days4g({payload}, {call, put}) {
            const backData = yield call(get_days4g, payload);
            let daySeries:any[] = [{
                type: "line",
                name: '@日流量',
                data: [],
            }];
            moment(payload.month).daysInMonth();
            let monthTotal = 0;
            if (backData.msg === 'ok') {
                for (let key in backData.data) {
                    let time = moment.unix(backData.data[key].time).format("YYYY-MM-DD");
                    monthTotal += backData.data[key].flow;
                    daySeries[0].data.push([time, (backData.data[key].flow / 1024 / 1024).toFixed(2)])
                }
            }
            yield put({
                type: "update",
                payload: {
                    daySeries: daySeries,
                    monthTotal: (monthTotal / 1024 / 1024).toFixed(2)
                }
            })
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    },
}as Model