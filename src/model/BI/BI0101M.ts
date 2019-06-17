/*@通用-数据层*/
import {get_shrink, update_shrink} from "../../services/CI/CI1201S";
import {get_related_person_list} from "../../services/CI/CI0701S";
import {
    create_company, delete_company,
    get_company_list,
    get_company_stat, get_speed_rule,
    update_company,
    update_speed_rule
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";


export default {
    namespace: "bi0101Info",
    state: {
        companyList: [],
        stats: [],
        speedRule: [{}],
        ifShrink:0, 
        techSupport:[],
        personList:[],
        businessList:[],

    },
    effects: {
        * getCompanyList({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })
        },
        * get_company_stat({payload}, {call, put}) {
            const backData = yield call(get_company_stat, payload);
            yield put({
                type: "update",
                payload: {
                    stats: backData.result
                }
            })
        },
        * create_company({payload}, {call, put}) {
            const backData = yield call(create_company, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                let result = yield call(get_company_list, {});
                let backData = yield call(get_company_stat, {});
                yield put({
                    type: "update",
                    payload: {
                        stats: backData.result,
                        companyList: result.result
                    }
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_company({payload}, {call, put}) {
            const backData = yield call(update_company, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                let result = yield call(get_company_list, {});
                let backData = yield call(get_company_stat, {});
                yield put({
                    type: "update",
                    payload: {
                        stats: backData.result,
                        companyList: result.result
                    }
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * update_speed_rule({payload}, {call}) {
            yield call(update_speed_rule, payload.list)
            yield call(update_shrink, payload.shrink)
        },
        * get_speed_rule({payload}, {call, put}) {
            const backData = yield call(get_speed_rule, payload);
            const shrinkData=yield call(get_shrink,payload);
            let speedRule = {oversea:false,overseaRule:"",domestic:false,ifShrink:shrinkData.result.enable_activity===true};
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
                    ifShrink:shrinkData.result.enable_activity
                }
            })
        },
        *delete_company({payload},{call,put}){
            const backData=yield call(delete_company,payload);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                let result = yield call(get_company_list, {});
                yield put({
                    type: "update",
                    payload: {
                        companyList: result.result
                    }
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        },
        *testBossModal({payload},{call,put}){
            yield call(get_company_list, payload.update);
        },
        *get_related_person_list_technology({payload},{call,put}){
            const backData=yield call(get_related_person_list,payload);
            yield put({
                type:"update",
                payload:{
                    personList: backData.result,
                }
            })
        },
        *get_related_person_list_business({payload},{call,put}){
            const backData=yield call(get_related_person_list,payload);
            yield put({
                type:"update",
                payload:{
                    businessList: backData.result
                }
            })
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model