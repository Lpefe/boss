/*@通用-数据层*/
import {Model} from 'dva';
import {
    get_agency_group,
    create_agency_group,
    update_agency_group,
    delete_agency_group,
    get_agency_list
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "ci1502Info",
    state: {
        agencyList:[],
        agencyGroupList:[]
    },
    effects: {
        * get_agency_list({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            yield put({
                type:"update",
                payload:{
                    agencyList:backData.result
                }
            })
        }
        ,
        *get_agency_group({payload},{call,put}){
            const backData=yield call(get_agency_group,payload);
            yield put({
                type:"update",
                payload:{
                    agencyGroupList:backData.result
                }
            })
        },
        *create_agency_group({payload},{call,put}){
            const backData=yield call(create_agency_group,payload.update);
            if (backData.success) {
                BossMessage(true, "@新增成功");
                yield put({
                    type:"get_agency_group",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@新增失败:" + backData.result)
            }
        },
        *update_agency_group({payload},{call,put}){
            const backData=yield call(update_agency_group,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_agency_group",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *delete_agency_group({payload},{call,put}){
            const backData=yield call(delete_agency_group,payload.update);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_agency_group",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@删除失败:" + backData.result)
            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model