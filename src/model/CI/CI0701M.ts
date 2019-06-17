/*@通用-数据层*/
import {delete_related_person, update_related_person,get_related_person_list,create_related_person,reset_password,change_activity} from "../../services/CI/CI0701S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "ci0701Info",
    state: {
        relatedPersonList: []
    },
    effects: {
        * init({payload}, {call, put}) {
            const backData = yield call(get_related_person_list, payload);
            yield put({
                type: "update",
                payload: {
                    relatedPersonList: backData.result
                }
            })
        },
        * update_related_person({payload}, {call, put}) {
            const backData = yield call(update_related_person, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                const backData = yield call(get_related_person_list, {company_id:sessionStorage.getItem("companyId")});
                yield put({
                    type: "update",
                    payload: {
                        relatedPersonList: backData.result
                    }
                })
            }else{
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * create_related_person({payload}, {call, put}) {
            const backData = yield call(create_related_person, payload);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                const backData = yield call(get_related_person_list, {company_id:sessionStorage.getItem("companyId")});
                yield put({
                    type: "update",
                    payload: {
                        relatedPersonList: backData.result
                    }
                })
            }else{
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *reset_password({payload},{call}){
            const backData = yield call(reset_password, payload);
            if (backData.success) {
                BossMessage(true, "@密码重置成功");
            }else{
                BossMessage(false, "@密码重置失败"+backData.result);
            }
        },
        *delete_related_person({payload},{call,put}){
            const backData = yield call(delete_related_person, payload);
            if (backData.success) {
                BossMessage(true, "@删除账号成功");
                const backData = yield call(get_related_person_list, {company_id:sessionStorage.getItem("companyId")});
                yield put({
                    type: "update",
                    payload: {
                        relatedPersonList: backData.result
                    }
                })
            }else{
                BossMessage(false, "@删除账号失败"+backData.result);
            }
        },
        *change_activity({payload},{call,put}){
            const backData=yield call(change_activity,payload.update);
            if(backData.success){
                const backData = yield call(get_related_person_list, payload.init);
                yield put({
                    type: "update",
                    payload: {
                        relatedPersonList: backData.result
                    }
                })
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model