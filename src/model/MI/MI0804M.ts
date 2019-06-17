/*@通用-数据层*/
import {Model} from "dva";
import {update_app_version,get_app_version} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "mi0804Info",
    state: {
        versionList:[]
    },
    effects: {
        *get_app_version({payload},{call,put}){
            const backData=yield call(get_app_version,payload);
            yield put({
                type:"update",
                payload:{
                    versionList:backData.result
                }
            })
        },
        *update_app_version({payload},{call,put}){
            const backData=yield call(update_app_version,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_app_version",
                    payload:{}
                });
            } else {
                BossMessage(false, "@编辑失败"+backData.result);
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model