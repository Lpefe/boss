/*@通用-数据层*/
import {create_client_auth, get_client_auth, update_client_auth,delete_client_auth} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import moment from "moment";
import {Model} from "dva";

export default {
    namespace: "pc0501Info",
    state: {
        clientAuthList:[]
    },
    effects: {
        *get_client_auth({payload},{call,put}){
            const backData=yield call(get_client_auth,payload);
            yield put({
                type:"update",
                payload:{
                    clientAuthList:backData.result
                }
            })
        },
        *create_client_auth({payload},{call,put}){
            payload.update.start_time=moment(payload.update.start_time).format("YYYY-MM-DD");
            payload.update.end_time=moment(payload.update.end_time).format("YYYY-MM-DD")
            const backData=yield call(create_client_auth,payload.update);
            if(!backData.success){
                BossMessage(false,"@创建失败"+backData.result)
            }else {
                BossMessage(true,"@创建成功");
                yield put({
                    type:"get_client_auth",
                    payload:payload.init
                })
            }
        },
        *update_client_auth({payload},{call,put}){
            payload.update.start_time=moment(payload.update.start_time).format("YYYY-MM-DD");
            payload.update.end_time=moment(payload.update.end_time).format("YYYY-MM-DD");
            const backData=yield call(update_client_auth,payload.update);
            if(!backData.success){
                BossMessage(false,"@编辑失败"+backData.result)
            }else {
                BossMessage(true,"@编辑成功");
                yield put({
                    type:"get_client_auth",
                    payload:payload.init
                })
            }
        },
        *delete_client_auth({payload},{call,put}){
            const backData = yield call(delete_client_auth, payload);
            if (backData.success) {
                BossMessage(true,payload.is_active ? "@删除成功" : "@删除成功");
                yield put({
                    type:"get_client_auth",
                    payload:payload.init
                });
            } else {
                BossMessage(false,backData.result);
            }
        },
        * switchStatus({payload}, {call, put}) {
            const backData = yield call(update_client_auth, payload);
            if (backData.success) {
                BossMessage(true,payload.is_active ? "@启用成功" : "@禁用成功");
                yield put({
                    type:"get_client_auth",
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