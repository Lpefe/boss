/*@通用-数据层*/
import {Model} from 'dva';
import {
    create_app_ipset,
    create_app_version_company, delete_app_ipset,
    delete_app_version_company,
    get_app_ipset, update_app_ipset,
    update_app_version_company
} from "../../services/Company/companyS";
import {get_app_dns,update_app_dns} from "../../services/CI/CI3701S";
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "ci3701Info",
    state: {
        ipsetList:[],
        dns:{}
    },
    effects: {
        *get_app_ipset({payload},{call,put}){
            const backData=yield call(get_app_ipset,payload);
            if(backData){
                yield put({
                    type:"update",
                    payload:{
                        ipsetList:backData.result
                    }
                })
            }

        },
        *get_app_dns({payload},{call,put}){
            const backData=yield call(get_app_dns,payload);
            if(backData){
                yield put({
                    type:"update",
                    payload:{
                        dns:backData.result
                    }
                })
            }
        },
        *update_app_dns({payload},{call,put}){
            const backData=yield call(update_app_dns,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_app_dns",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@编辑失败"+backData.result);
            }
        },
        *update_app_ipset({payload},{call,put}){
            const backData=yield call(update_app_ipset,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_app_ipset",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@编辑失败"+backData.result);
            }
        },
        *create_app_ipset({payload},{call,put}){
            const backData=yield call(create_app_ipset,payload.update);
            if (backData.success) {
                BossMessage(true, "@新增成功");
                yield put({
                    type:"get_app_ipset",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@新增失败"+backData.result);
            }
        },
        *delete_app_ipset({payload},{call,put}){
            const backData=yield call(delete_app_ipset,payload.delete);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_app_ipset",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@删除失败"+backData.result);
            }
        },

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model