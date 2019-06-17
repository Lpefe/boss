/*@通用-数据层*/
import {get_lan_strategy,create_lan_strategy,update_lan_strategy,delete_lan_strategy} from "../../services/CI/CI3401S";
import {get_agency_list,get_company_list} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "ci3401Info",
    state: {
        dataSource:[],
        agencyList:[],
        companyList:[]
    },
    effects: {
        *get_lan_strategy({payload},{call,put}){
            if (payload.company_id === 1) {
                delete payload.company_id;
            }
            const backData=yield call(get_lan_strategy,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        },
        * get_company_list({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })
        },
        *create_lan_strategy({payload},{call,put}){
            const backData = yield call(create_lan_strategy, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_lan_strategy",
                    payload: {
                        company_id:payload.init.selectCompanyId,
                        name:payload.init.selectName
                    }
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *update_lan_strategy({payload},{call,put}){
            const backData=yield call(update_lan_strategy,payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
                yield put({
                    type: "get_lan_strategy",
                    payload: {
                        company_id:payload.init.selectCompanyId,
                        name:payload.init.selectName
                    }
                })
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },

        *delete_lan_strategy({payload},{call,put}){
            const backData=yield call(delete_lan_strategy,payload.init);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_lan_strategy",
                    payload:{
                        company_id:payload.init.selectCompanyId,
                        name:payload.init.selectName
                    }
                });
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        * get_agency_list({payload}, {call, put}) {
            if (payload.company_id === 1) {
                delete payload.company_id;
            }
            const backData = yield call(get_agency_list, payload);
            yield put({
                type: "update",
                payload: {
                    agencyList: backData.result
                }
            })
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model