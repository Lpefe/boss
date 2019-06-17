/*@通用-数据层*/
import {batch_update_redis_alarm, deal_alarm, get_redis_alarm} from "../../services/Company/companyS";
import {get_history_event_case,get_event_case,get_sub_event_case,deal_event_case,update_company,deal_sub_event_case} from "../../services/MI/MI1801S";
import {_crypto} from "../../utils/commonUtilFunc";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
import {get_company_list} from "../../services/Company/companyS";
export default {
    namespace: "mi1801Info",
    state: {
        tempPayload: {},
        alarmList: [],
        pastAlarmList:[],
        noteList:[],
        companyList:[],
        total:0,
        noteTotal:0,
        case_events_payload:{}
    },
    effects: {
        * process({payload}, {call, put}) {
            yield put({
                type: "update",
                payload: {
                    tempPayload: payload.update
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
        * confirm({payload}, {call, put, select}) {
            const temp = yield select(state => state.mi1801Info.tempPayload);
            let payloadUsed = {
                alarm_id: temp.alarm_id,
                password: _crypto(payload.update.password),
                sn: temp.sn,
                remark: temp.remark,
                cmd: temp.debug
            };
            const backData = yield call(deal_alarm, payloadUsed);
            if (backData.success) {
                BossMessage(true, "@操作成功");
                yield put({
                    type: "get_redis_alarm",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@操作失败" + backData.result)
            }

        },
        // * get_redis_alarm({payload}, {call, put}) {
        //     const backData = yield call(get_redis_alarm, payload);
        //     yield put({
        //         type: "update",
        //         payload: {
        //             alarmList: backData.result,
        //             total: backData.total
        //         }
        //     })
        // }
        * ignore({payload}, {call, put}) {
            // let data = {
            //     "ids":["s_100_e29400850ad933644dfca951d298de13"],
            //     "reason":"",
            //     "remark":"",
            //     "restrain":{
            //       "time_list":[
            //         {
            //           "begin_time": 1544601574,
            //             "end_time": 1544601584
            //         }],
            //       "is_cycle":1,
            //       "type":"all",
            //       "remark":""
            //     }
            //   }
            
            let data = {
                "ids":payload.update.ids,
                "reason":payload.update.reason?payload.update.reason:"",
                "remark":payload.update.reason?payload.update.remark:"",
                "restrain":payload.update.reason?{}:{
                    "time_list":[
                        {
                        "begin_time": payload.update.start_time,
                        "end_time": payload.update.end_time
                        }],
                    "is_cycle":payload.update.is_cycle?1:0,
                    "type":payload.update.restrain_type,
                    "remark":payload.update.remark
                }
         
            }
            const backData = yield call(deal_event_case, data);
            if (backData.retcode===0) {
                BossMessage(true, "@操作成功");
                yield put({
                    type: "get_redis_alarm",
                    payload: payload.init
                })
                yield put({
                    type: "get_event_case_events_all",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@操作失败" + backData.msg)
            }
        },
        * get_redis_alarm({payload}, {call, put}) {
            const backData = yield call(get_event_case, payload);
            yield put({
                type: "update",
                payload: {
                    alarmList: backData.data,
                    total: backData.total
                }
            })
        },
        * get_event_case_events_all({payload}, {call, put}) {
            const backData = yield call(get_history_event_case, payload);
            yield put({
                type: "update",
                payload: {
                    pastAlarmList: backData.data,
                    pastTotal: backData.total
                }
            })
        },
        * get_event_case_events({payload}, {call, put}) {
            const backData = yield call(get_sub_event_case, payload);
            yield put({
                type: "update",
                payload: {
                    noteList: backData.data,
                    noteTotal: backData.total,
                    case_events_payload:payload,
                }
            })
        },
        * deal_sub_event_case({payload}, {call, put,select}) {
            const case_events_payload = yield select(state => state.mi1801Info.case_events_payload);
            let payloadUsed = {
                "event_caseId":payload.update.event_caseId,
                "reason":payload.update.reason,
                "remark":payload.update.remark||"",
                "ids":payload.update.ids2
            };
            const backData = yield call(deal_sub_event_case, payloadUsed);
            if (backData.retcode===0) {
                BossMessage(true, "@操作成功");
                yield put({
                    type: "get_event_case_events",
                    payload: case_events_payload
                })
            } else {
                BossMessage(false, "@操作失败" + backData.msg)
            }

        },

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model