/*@通用-数据层*/
import {get_agency_list, get_company_list} from "../../services/Company/companyS";
import {get_company_contact} from "../../services/CI/CI1001S";
import {Model} from "dva";

export default {
    namespace:"mi1001Info",
    state:{
        agencyList:[],
        relatedPersonList:[],
        companyList:[],
        total:0
    },
    effects:{
        *get_agency_list({payload},{call,put}){
            const backData=yield call(get_agency_list,payload);
            yield put({
                type:'update',
                payload:{
                    agencyList:backData.result,
                    total:backData.total
                }
            })
        },
        *get_company_contact({payload},{call,put}){
            const backData=yield call(get_company_contact,payload);
            yield put({
                type:'update',
                payload:{
                    relatedPersonList:backData.result
                }
            })
        },
        *get_company_list({payload},{call,put}){
            const backData=yield call(get_company_list,payload);
            yield put({
                type:'update',
                payload:{
                    companyList:backData.result
                }
            })
        }
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model