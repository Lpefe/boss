/*@通用-数据层*/
import {create_black_list, delete_black_list, get_black_list} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace:"mi0401Info",
    state:{
        dataSource:[],
    },
    effects:{
        *get_black_list({payload},{call,put}){
            const backData=yield call(get_black_list,payload);
            yield put({
                type:"update",
                payload:{
                    total:backData.total,
                    dataSource:backData.result
                }
            })
        },
        *delete_black_list({payload},{call,put}){
            const backData=yield call(delete_black_list,payload);
            if (backData.success) {
                BossMessage(true, "@删除黑名单成功");
                yield put({
                    type:"get_black_list",
                    payload:{}
                });
            } else {
                BossMessage(false, "@删除黑名单失败"+backData.result);
            }
        },
        *create_black_list({payload},{call,put}){
            const backData=yield call(create_black_list,payload);
            if (backData.success) {
                BossMessage(true,"@新增黑名单成功");
                yield put({
                    type:"get_black_list",
                    payload:{}
                });
            } else {
                BossMessage(false,"@新增黑名单失败"+backData.result);
            }
        }
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model