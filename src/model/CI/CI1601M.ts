/*@通用-数据层*/
import {get_ip_groups,delete_ip_group,update_ip_group,create_ip_group} from "../../services/CI/CI1601S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "ci1601Info",
    state: {
        ipGroupList:[]
    },
    effects:{
        *get_ip_groups({payload},{call,put}){
            const backData=yield call(get_ip_groups,payload);
            yield put({
                type:"update",
                payload:{
                    ipGroupList:backData.result
                }
            })
        },
        *create_ip_group({payload},{call,put}){
            const backData=yield call(create_ip_group,payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "get_ip_groups",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *update_ip_group({payload},{call,put}){
            const backData=yield call(update_ip_group,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "get_ip_groups",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *delete_ip_group({payload},{call,put}){
            const backData=yield call(delete_ip_group,payload.delete);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                yield put({
                    type: "get_ip_groups",
                    payload: payload.init
                })
            }else{
                BossMessage(false,"@删除失败:"+backData.result);
            }
        },
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model