/*@通用-数据层*/
import moment from 'moment';
import {
    create_manual_link_path, get_deduplication,
    get_manual_link_path_example, get_topo_list,
    get_company_list, update_deduplication,
    update_link, get_link_list, update_link_batch
   ,get_manual_link_path_placeholder
} from "../../services/Company/companyS";
import {get_system} from "../../services/rate/rateS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "mi0501Info",
    state: {
        dataSource: [],
        companyList: [],
        manualLinkPathExample: [],
        rules: [],//去重规则
        volume: 0,//去重内存
        toolTipContent: "@去重功能将占用中心和边缘的CPE内存各50M",
        memory: [],
        linkList:[],
        manual_link_path_placeholder:""
    },
    effects: {
        * init({payload}, {call, put}) {
            const backData = yield call(get_topo_list, payload);
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.result
                }
            })
        },
        *get_link_list({payload},{call,put}){
            const backData = yield call(get_link_list, payload);
            yield put({
                type: "update",
                payload: {
                    linkList: backData.result,
                    total:backData.total
                }
            })
        },
        * get_system({payload}, {call, put}) {
            const backData = yield call(get_system, payload);
            let memData:any[] = [];
            if (backData.msg === "ok") {
                for (let key in backData.data) {
                    let time = moment.unix(backData.data[key].time).format("YYYY-MM-DD HH:mm:ss");
                    memData.push([time, backData.data[key].mem]);
                }
            }
            yield put({
                type:"update",
                payload:{
                    memory:memData
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
        * get_manual_link_path_example({payload}, {call, put}) {
            const backData = yield call(get_manual_link_path_example, payload);
            yield put({
                type: "update",
                payload: {
                    manualLinkPathExample: backData.success ? backData.result : ""
                }
            })
        },
        *get_manual_link_path_placeholder({payload},{call,put}){
            const backData = yield call(get_manual_link_path_placeholder, payload);
            yield put({
                type: "update",
                payload: {
                    manual_link_path_placeholder: backData.success ? backData.result : ""
                }
            })
        },
        * handleSubmit({payload}, {call, put}) {
            if (!(payload.assign_type === "auto")) {
                const backData1 = yield call(create_manual_link_path, payload.text);
                if (backData1.success) {
                    BossMessage(true, "@编辑成功");
                    const backData = yield call(update_link, {assign_type: payload.assign_type, id: payload.id,record:payload.record});
                    if (backData.success) {
                        payload.vm.props.history.push("/main/mi0501")
                    }
                } else {
                    BossMessage(false, "@编辑失败:" + backData1.result)
                }
            } else {
                const backData2 = yield call(update_link, {assign_type: payload.assign_type, id: payload.id,record:payload.record});
                if (backData2.success) {
                    BossMessage(true, "@编辑成功");
                    payload.vm.props.history.push("/main/mi0501")
                } else {
                    BossMessage(false, "@编辑失败:" + backData2.result)
                }
            }
        },
        * get_deduplication({payload}, {call, put}) {
            const backData = yield call(get_deduplication, payload);
            let toolTipContent:string = "";
            if (backData.success) {
                switch (backData.result.rules.length) {
                    case 0:
                        toolTipContent = "@去重功能将占用中心和边缘的CPE内存各50M";
                        break;
                    case 1:
                        toolTipContent = "@去重功能将占用中心和边缘的CPE内存各100M";
                        break;
                    case 2:
                        toolTipContent = "@去重功能将占用中心和边缘的CPE内存各200M";
                        break;
                    default:
                        toolTipContent = "@去重功能将占用中心和边缘的CPE内存各50M";
                        break;
                }
                yield put({
                    type: "update",
                    payload: {
                        rules: backData.result.rules,
                        volume: backData.result.volume,
                        toolTipContent: toolTipContent
                    }
                })
            }
        },
        * handelCheckboxChange({payload}, {call, put}) {
            let toolTipContent:string = "";
            switch (payload.values.length) {
                case 0:
                    toolTipContent = "@去重功能将占用中心和边缘的CPE内存各"+parseInt((payload.memory/2).toString(),10)+"M";
                    break;
                case 1:
                    toolTipContent = "@去重功能将占用中心和边缘的CPE内存各"+payload.memory+"M";
                    break;
                case 2:
                    toolTipContent = "@去重功能将占用中心和边缘的CPE内存各"+2*payload.memory+"M";
                    break;
                default:
                    toolTipContent = "@去重功能将占用中心和边缘的CPE内存各0M";
                    break;
            }
            yield put({
                type: "update",
                payload: {
                    rules: payload.values,
                    toolTipContent: toolTipContent,
                }
            })
        },
        * update_deduplication({payload}, {call, put}) {
            const backData = yield call(update_deduplication, payload.update);
            if(backData.success){
                BossMessage(true, "@编辑成功");
                payload.vm.props.history.push("/main/mi0501")
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *update_link({payload},{call,put}){
            const backData=yield call(update_link,payload.update);
            if(backData.success){
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_link_list",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *update_link_batch({payload},{call,put}){
            const backData=yield call(update_link_batch,payload.update);
            if(backData.success){
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_link_list",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }

        },
        *get_company_list({payload},{call,put}){
            const backData=yield call(get_company_list,payload);
            yield put({
                type:"update",
                payload:{
                    companyList:backData.result
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