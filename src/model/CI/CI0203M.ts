/*@通用-数据层*/
import moment from 'moment';
import {get_multi_band, get_rtt_data} from "../../services/rate/rateS";
import {Model} from "dva";

interface MultiBandSeries{
    name:string,
    data: any[],
    type:string,
    nettype: string,
    showSymbol: boolean,
    smoothMonotone: string,
    smooth: boolean,
    animation:boolean
}
export default {
    namespace: "ci0203Info",
    state: {
        multiBandData: [],
        rttData: []
    },
    effects: {
        * get_multi_band({payload}, {call, put}) {
            const backData = yield call(get_multi_band, payload);
            let speedSeries:Array<any> = [];
            if (backData.msg === "ok" ) {
                if (backData.data.length > 0) {
                    let dataSource = backData.data;
                    let name = "";
                    for (let key in dataSource) {
                        switch (dataSource[key].nettp) {
                            case 1000:
                                name = "@总速率";
                                break;
                            case 0:
                                name = "MPLS";
                                break;
                            case 1:
                                name = "INTERNET";
                                break;
                            case 2:
                                name = "4G";
                                break;
                            case 3:
                                name = "INTERNET_PRIVIATE";
                                break;
                            case 4:
                                name = "4G_PRIVIATE";
                                break;
                            default:
                                name = "";
                                break;
                        }
                        let tempSeriesTx:MultiBandSeries = {
                            name: name + "@上行",
                            data: [],
                            type: "line",
                            nettype: dataSource[key].nettp,
                            showSymbol: false,
                            smoothMonotone: "x",
                            smooth: true,
                            animation: false
                        };
                        let tempSeriesRx:MultiBandSeries = {
                            name: name + "@下行",
                            data: [],
                            type: "line",
                            nettype: dataSource[key].nettp,
                            showSymbol: false,
                            smoothMonotone: "x",
                            smooth: true,
                            animation: false
                        };
                        for (let subKey in dataSource[key].bands) {
                            let band = dataSource[key].bands[subKey];
                            let time = moment.unix(band.time).format("YYYY-MM-DD HH:mm:ss");
                            tempSeriesTx.data.push([time, (band.ratetx / 1024).toFixed(4)]);
                            tempSeriesRx.data.push([time, (band.raterx / 1024).toFixed(4)]);
                        }
                        speedSeries.push(tempSeriesTx);
                        speedSeries.push(tempSeriesRx);
                    }
                    yield put({
                        type: "update",
                        payload: {
                            multiBandData: speedSeries
                        }
                    })
                }
            }

        },
        * get_rtt_data({payload}, {call, put}) {
            const backData = yield call(get_rtt_data, payload);
            let dataSource:Array<any> = [{type: 'line', name: "RTT", data: [],smooth:true,showSymbol: false,
                smoothMonotone:"x"}];
            for (let key in backData.data) {
                dataSource[0].data.push([moment.unix(backData.data[key].time).format("YYYY-MM-DD HH:mm:ss"), (backData.data[key].rtt)])
            }
            yield put({
                type: "update",
                payload: {
                    rttData: dataSource
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