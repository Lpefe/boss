/*@通用-数据层*/
import {
    get_band_load_all,
    getStatistics,
} from "../../services/rate/rateS";
import {
    get_bandwidth_stat_all,
    get_device_model_stat,
    get_device_stat, get_link_list,
    get_link_stat,get_company_list,get_device_list,get_speed_rule,update_speed_rule
} from "../../services/Company/companyS";
import {get_shrink,update_shrink} from "../../services/CI/CI1201S";
import {update_company,get_os_version,update_os_version} from "../../services/BI/BI0001S";
import {create_company_contract, get_contract_list, update_contract} from "../../services/Company/companyS";
import {get_bandwidth_stat, get_agency_stat, } from "../../services/CI/CI0801S";
import {get_company_contact,create_company_contact,update_company_contact,delete_company_contact,delete_contract} from "../../services/CI/CI1001S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";


interface CompanyListHeaderInfo{
    name:string,
    id:number
}

interface StatUnit{
    name:string,
    value:number
}

interface StepsBetaFlowUnit{
    key:string,
    value:number
}

interface PieData {
    data:Array<StatUnit>,
    legend:Array<string>
}

export default {
    namespace: "bi0001Info",
    state: {
        companyListHeader:[],
        companyList: [],
        band_stat:[],
        device_model_stat:[],
        steps_beta_flow:[],
        dataSource: [],
        contractList: [],
        bandwidthStat: {},
        bandwidthTotal: 0,
        deviceStat: [],
        agencyStat: [],
        nodeData: [],
        linkDataInit: [],
        linkDataOnline: [],
        linkDataOffline: [],
        linkSum:0,
        deviceSum:0,
        agencySum:0,
        companyInfo: [],
        contactList:[],
        link_stat: [],
        device_stat:[],
        deviceData: [],
        total:0,
        // 子组件setupModal
        speedRule: [{}],
        ifShrink:0,  
        logo:""  ,
        versionList:[]
    },
    effects: {
        * get_os_version({payload}, {call, put}) {
            const backData = yield call(get_os_version, payload);
            yield put({
                type: "update",
                payload: {
                    versionList: backData.result,
                }
            })
        },
        * update_os_version({payload}, {call, put}) {
            const backData = yield call(update_os_version, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * getDeviceList({payload}, {call, put}) {
            const backData = yield call(get_device_list, payload);
            yield put({
                type: "update",
                payload: {
                    deviceData: backData.result,
                    total:backData.total
                }
            })
        },

        * getCompanyList({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            let companyListHeader:Array<CompanyListHeaderInfo> = [];
            for(let key in backData.result){
                companyListHeader.push({name:backData.result[key].company,id:backData.result[key].id})
            }
            yield put({
                type: "update",
                payload: {          
                    companyListHeader:companyListHeader||""
                }
            })
        },
        //获取头像信息
        *getLogo({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            let logo = [];
            logo=backData.result[0].logo;
            yield put({
                type: "update",
                payload: {          
                    logo:logo
                }
            })
        },
        * get_device_stat({payload}, {call, put}) {
            const backData = yield call(get_device_stat, payload);
            let device_stat:Array<StatUnit> = [];
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
               // device_stat.push({name: key, value: backData[key]})
            }
            if(device_stat.length===0){
                device_stat.push({name: "暂无数据",value:1})
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
            let link_stat:Array<StatUnit> = [];
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
                //link_stat.push({name: key, value: backData[key]})
            }
            if(link_stat.length===0){
                link_stat.push({name: "暂无数据",value:1})
            }

            yield put({
                type: "update",
                payload: {
                    link_stat: link_stat
                }
            })
        },
        * create_company_contract({payload}, {call, put}) {
            const backData = yield call(create_company_contract, payload);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
            const contractData = yield call(get_contract_list, {company_id: payload.company_id});
            yield put({
                type: "update",
                payload: {
                    contractList: contractData.result,
                }
            })
        },
        *create_company_contact({payload},{call,put}){
            const backData = yield call(create_company_contact,payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
            const backData1 = yield call(get_company_contact, payload.init);
            yield put({
                type: "update",
                payload: {
                    contactList: backData1.result,
                }
            })
        },
        * delete_contract({payload}, {call, put}) {
            const backData = yield call(delete_contract, {id: payload.id});
            if (backData.success) {
                BossMessage(true,"@删除成功");
                const backData1 = yield call(get_contract_list, {company_id: payload.company_id});
                yield put({
                    type: "update",
                    payload: {
                        contractList: backData1.result
                    }
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        },
        *update_company_contact({payload},{call,put}){
            const backData = yield call(update_company_contact,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
            const backData1 = yield call(get_company_contact, payload.init);
            yield put({
                type: "update",
                payload: {
                    contactList: backData1.result,
                }
            })
        },
        *delete_company_contact({payload},{call,put}){
            const backData = yield call(delete_company_contact,payload.delete);
            if (backData.success) {
                BossMessage(true,"@删除成功");
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
            const backData1 = yield call(get_company_contact, payload.init);
            yield put({
                type: "update",
                payload: {
                    contactList: backData1.result,
                }
            })
        },


        * update_contract({payload}, {call, put}) {
            const backData = yield call(update_contract, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
            const contractData = yield call(get_contract_list, {company_id: payload.company_id});
            yield put({
                type: "update",
                payload: {
                    contractList: contractData.result,
                }
            })
        },


        * get_company_list({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyInfo: backData.result[0]||{}
                }
            })
        },
        *get_company_contact({payload},{call,put}){
            const backData = yield call(get_company_contact,payload);
            if(backData.result){
                yield put({
                    type:"update",
                    payload:{
                        contactList:backData.result
                    }
                })
            }
        },
        * get_contract_list({payload}, {call, put}) {
            const backData = yield call(get_contract_list, payload);
            yield put({
                type: "update",
                payload: {
                    contractList: backData.result
                }
            })
           
        },
        //链路峰值负载率

        * get_band_load_all({payload}, {call, put}) {
            const backData = yield call(get_band_load_all, payload);
            let load_stat:Array<any> = [];
            load_stat.push({'0': backData.stat['0']});
            load_stat.push({'0-20': backData.stat['0-20']})
            load_stat.push({'20-40': backData.stat['20-40']})
            load_stat.push({'40-60': backData.stat['40-60']})
            load_stat.push({'60-80': backData.stat['60-80']})
            load_stat.push({'80-100': backData.stat['80-100']})
            yield put({
                type: "update",
                payload: {
                    companyList: load_stat
                }
            })
        },
        //链路带宽
        *get_bandwidth_stat_all({payload},{call,put}){
            const backData = yield call(get_bandwidth_stat_all, payload);
            let band_stat:Array<any> = [];
            band_stat.push({'0-10': backData['<10']});
            band_stat.push({'10-50': backData['10-50']});
            band_stat.push({'50-100': backData['50-100']});
            band_stat.push({'>=100': backData['>=100']});
            yield put({
                type: "update",
                payload: {
                    band_stat:band_stat
                }
            })
        },
        //设备型号
        * get_device_model_stat({payload}, {call, put}) {
            const backData = yield call(get_device_model_stat, payload);
            let deviceModelStat:Array<StatUnit>=[];
            for(let key in backData){
                let temp:StatUnit={name:"",value:0};
                temp.name=key;
                temp.value = backData[key]
                deviceModelStat.push(temp)
            }
            yield put({
                type: "update",
                payload: {
                    device_model_stat: deviceModelStat
                }
            })
        },

        //获取设备流量排行
        * getStatistics({payload}, {call, put}) {
            let backData;
            backData = yield call(getStatistics, payload);
            let steps_beta_flow:Array<StepsBetaFlowUnit> = [];
            if (backData.msg === "ok") {
                for (let key in backData.data) {
                    let temp:StepsBetaFlowUnit = {key:"",value:0};
                    temp.key = backData.data[key].agency_name;
                    //temp.value = (backData.data[key].flow / 1024 / 1024).toFixed(2);
                    temp.value = backData.data[key].flow;
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
        * get_stat({payload}, {call, put}) {
            const backData1 = yield call(get_bandwidth_stat, payload);
            const backData4 = yield call(get_agency_stat, payload);
            let pieData4:PieData = {data: [], legend: []};
            let agencySum=0;
            for (let key in backData4) {
                switch (key) {
                    case "STEP":
                        pieData4.data.push({value: backData4[key], name: "边缘节点", });
                        pieData4.legend.push("@边缘节点");
                        agencySum+=backData4[key];
                        break;
                    case "CSTEP":
                        pieData4.data.push({value: backData4[key], name: "中心节点", });
                        pieData4.legend.push("@中心节点");
                        agencySum+=backData4[key];
                        break;
                    default:
                        break;
                }
            }
            yield put({
                type: "update",
                payload: {
                    bandwidthStat: backData1,
                    bandwidthTotal: (backData1["国内组网"] || 0) + (backData1["全球组网"] || 0) + (backData1["全球SaaS加速"] || 0)+(backData1["国内SaaS加速"] || 0),
                    agencyStat: pieData4,
                    agencySum:agencySum
                }
            })
        },
        * get_link_list({payload}, {call, put}) {
            const backData = yield call(get_link_list, payload);
    
            yield put({
                type: 'update',
                payload: {
                    dataSource: backData.result,
                }
            })
        },
        //更换头像

        // 子组建setupModal
        * update_speed_rule({payload}, {call, put}) {
            const backData = yield call(update_speed_rule, payload.list)
            if (backData.message === "success") {
                BossMessage(true, "@保存成功");
            } else {
                BossMessage(false, "@保存失败:" + backData.result)
            }
            yield call(update_shrink, payload.shrink)
            //更换头像
            yield call(update_company, payload.logo)
            //更换版本
           // yield call(update_os_version, payload.version)
            yield call(update_company, payload.version)
        },

        * get_speed_rule({payload}, {call, put}) {
            const backData = yield call(get_speed_rule, payload);
            const shrinkData=yield call(get_shrink,payload);
            let speedRule = {oversea:false,overseaRule:"",domestic:false,ifShrink:false};
            speedRule.ifShrink=shrinkData.result.enable_activity===true;
            for (let key in backData.result) {
                if (backData.result[key].type === "oversea") {
                    speedRule.oversea = true;
                    speedRule.overseaRule = backData.result[key].rule
                } else if (backData.result[key].type === "domestic") {
                    speedRule.domestic = true;
                }
            }
            yield put({
                type: "update",
                payload: {
                    speedRule: backData.result.length===0?[{}]:backData.result,
                    // 是否默认选中只能压缩
                    ifShrink:shrinkData.result.is_active
                }
            })
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model