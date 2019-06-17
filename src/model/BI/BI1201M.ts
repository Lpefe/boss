/*@通用-数据层*/
import {get_related_person_list, reset_password, update_related_person} from "../../services/CI/CI0701S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "bi1201Info",
    state: {
        relatedPersonList:[],
    },
    effects: {
        *get_related_person_list({payload},{call,put}){
            const backData=yield call(get_related_person_list,payload);
            yield put({
                type:"update",
                payload:{
                   relatedPersonList: backData.result
                }
            })
        },
        *update_related_person({payload},{call,put}){
            const backData=yield call(update_related_person,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_related_person_list",
                    payload:payload.init
                })
            } else{
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *reset_password({payload},{call,put}){
            const backData=yield call(reset_password,payload);
            if (backData.success) {
                BossMessage(true, "@重置密码成功");
            } else{
                BossMessage(false, "@重置密码失败"+backData.result);
            }
        }

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model