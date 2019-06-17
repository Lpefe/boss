/*@通用-数据层*/
import {
    get_bandwidth_stat_all,
    get_device_model_stat,
    get_device_stat,
    get_device_type_stat,
    get_link_stat,
    get_redis_alarm_stat,
    get_stock_stat
} from "../../services/Company/companyS";
import {get_band_load_all} from "../../services/rate/rateS";
import {Model} from "dva";

export default {
    namespace: "mi0001Info",
    state: {
        device_stat: [],
        link_stat: [],
        load_stat: [],
        band_stat: [],
        device_model_stat: [],
        device_type_stat: [],
        stock_stat: [],
        agencyList: [],
        alarmStat: {
            link: {},
            device: {}
        }
    },
    effects: {
        * get_redis_alarm_stat({payload}, {call, put}) {
            const backData = yield call(get_redis_alarm_stat, payload);
            yield put({
                type: "update",
                payload: {
                    alarmStat: backData
                }
            })
        },
        * get_device_stat({payload}, {call, put}) {
            const backData = yield call(get_device_stat, payload);
            let device_stat:any[] = [];
            for (let key in backData) {
                switch(key){
                    case "INIT":
                        device_stat.push({name: "未激活", value: backData[key]});
                        break;
                    case "ONLINE":
                        device_stat.push({name: "在线", value: backData[key]});
                        break;
                    case "OFFLINE":
                        device_stat.push({name: "离线", value: backData[key]});
                        break;
                    default:
                        break;
                }
            }
            if (!device_stat.length) {
                device_stat.push({name: "暂无数据", value: "1"})
            }
            yield put({
                type: "update",
                payload: {
                    device_stat: device_stat
                }
            })
        },
        * get_link_stat({payload}, {call, put}) {
            const backData = yield call(get_link_stat, payload);
            let link_stat:any[] = [];
            for (let key in backData) {
                switch(key){
                    case "INIT":
                        link_stat.push({name: "未激活", value: backData[key]});
                        break;
                    case "ONLINE":
                        link_stat.push({name: "在线", value: backData[key]});
                        break;
                    case "OFFLINE":
                        link_stat.push({name: "离线", value: backData[key]});
                        break;
                    default:
                        break;
                }
            }
            if (!link_stat.length) {
                link_stat.push({name: "暂无数据", value: "1"})
            }
            yield put({
                type: "update",
                payload: {
                    link_stat: link_stat
                }
            })
        },
        * get_band_load_all({payload}, {call, put}) {
            try{
                const backData = yield call(get_band_load_all, payload);
                let load_stat:any[] = [];
                load_stat.push({'0': backData.stat['0']});
                load_stat.push({'0-20': backData.stat['0-20']})
                load_stat.push({'20-40': backData.stat['20-40']})
                load_stat.push({'40-60': backData.stat['40-60']})
                load_stat.push({'60-80': backData.stat['60-80']})
                load_stat.push({'80-100': backData.stat['80-100']})
                yield put({
                    type: "update",
                    payload: {
                        load_stat: load_stat
                    }
                })
            }catch(err){
                console.error(err);
            }

        },
        * get_bandwidth_stat_all({payload}, {call, put}) {
            const backData = yield call(get_bandwidth_stat_all, payload);
            let band_stat:any[] = [];
            band_stat.push({'<10': backData['<10']});
            band_stat.push({'10-50': backData['10-50']});
            band_stat.push({'50-100': backData['50-100']});
            band_stat.push({'>=100': backData['>=100']});
            yield put({
                type: "update",
                payload: {
                    band_stat: band_stat
                }
            })
        },
        * get_device_model_stat({payload}, {call, put}) {
            const backData = yield call(get_device_model_stat, payload);
            let deviceModelStat:any[] = [];
            for (let key in backData) {
                deviceModelStat.push({name: key, value: backData[key]})
            }
            yield put({
                type: "update",
                payload: {
                    device_model_stat: deviceModelStat
                }
            })
        },
        * get_device_type_stat({payload}, {call, put}) {
            const backData = yield call(get_device_type_stat, payload);
            let deviceTypeStat:any[] = [];
            for (let key in backData) {
                let temp:any = {};
                let tempKey = key;
                switch (key) {
                    case "CSTEP":
                        tempKey = "HCPE";
                        break;
                    case "STEP":
                        tempKey = "BCPE";
                        break;
                    default:
                        break;
                }
                temp[tempKey] = backData[key];
                deviceTypeStat.push(temp)
            }
            yield put({
                type: "update",
                payload: {
                    device_type_stat: deviceTypeStat
                }
            })
        },
        * get_stock_stat({payload}, {call, put}) {
            const backData = yield call(get_stock_stat, payload);
            yield put({
                type: "update",
                payload: {
                    stock_stat: backData.result
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