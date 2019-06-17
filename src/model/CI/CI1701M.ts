/*@通用-数据层*/
import {get_port_groups,delete_port_group,update_port_group,create_port_group} from "../../services/CI/CI1701S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "ci1701Info",
    state: {
        portGroupList:[]
    },
    effects:{
        *get_port_groups({payload},{call,put}){
            const backData=yield call(get_port_groups,payload);
            yield put({
                type:"update",
                payload:{
                    portGroupList:backData.result
                }
            })
        },
        *create_port_group({payload},{call,put}){
            const backData=yield call(create_port_group,payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_port_groups",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *update_port_group({payload},{call,put}){
            const backData=yield call(update_port_group,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_port_groups",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *delete_port_group({payload},{call,put}){
            const backData=yield call(delete_port_group,payload.delete);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                yield put({
                    type:"get_port_groups",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@删除失败:" + backData.result);
            }
        },
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model