/*@通用-数据层*/
import {Model} from 'dva';
import {get_app_account,create_app_account,update_app_account,delete_app_account,get_agency_group} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {updateAppConfig} from "../../services/CI/CI0601S";


export default {
    namespace: "ci0702Info",
    state: {
        accountList:[],
        agencyGroupList:[]
    },
    effects: {
        *get_app_account({payload},{call,put}){
            const backData=yield call(get_app_account,payload);
            yield put({
                type:"update",
                payload:{
                    accountList:backData.result
                }
            })
        },
        *create_app_account({payload},{call,put}){
            const backData=yield call(create_app_account,payload.update);
            if (backData.success) {
                BossMessage(true, "@新增成功");
                yield put({
                    type:"get_app_account",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@新增失败:" + backData.result)
            }
        },
        *update_app_account({payload},{call,put}){
            const backData=yield call(update_app_account,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_app_account",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *delete_app_account({payload},{call,put}){
            const backData=yield call(delete_app_account,payload.update);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_app_account",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@删除失败:" + backData.result)
            }
        },
        *get_agency_group({payload},{call,put}){
            const backData=yield call(get_agency_group,payload);
            yield put({
                type:"update",
                payload:{
                    agencyGroupList:backData.result
                }
            })
        },
        * switchStatus({payload}, {call, put}) {
            const backData = yield call(update_app_account, payload.update);
            if (backData.success) {
                BossMessage(true,payload.is_active ? "@启用成功" : "@禁用成功");
                yield put({
                    type:"get_app_account",
                    payload:payload.init
                });
            } else {
                BossMessage(false,backData.result);
            }
        },


    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model