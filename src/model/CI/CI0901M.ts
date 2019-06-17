/*@通用-数据层*/
import * as T from '../../services/CI/CI0901S';
import {
    create_black_list_company,
    create_white_list,
    delete_white_list,
    get_black_list_company,
    get_white_list,
    update_white_list,
    delete_black_list_company
} from '../../services/CI/CI0901S';
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export interface CI0901ModelState {
    dataSource: T.WhiteListItem[],
    ifAllowed: boolean,
    blackList: any[]
}

const initState: CI0901ModelState = {
    dataSource: [],
    ifAllowed: true,
    blackList: []
};

export default {
    namespace: "ci0901Info",
    state: initState,
    effects: {
        * get_white_list({payload}, {call, put}) {
            let backData;
            yield get_white_list(payload).then((res)=>{
                backData=res;
            });
            if (backData.success) {
                yield put({
                    type: "update",
                    payload: {
                        dataSource: backData.result
                    }
                })
            } else {
                yield put({
                    type: "update",
                    payload: {
                        dataSource: backData.result,
                        ifAllowed: false,
                    }
                })
            }
        },
        * create_white_list({payload}, {call, put}) {
            const backData: T.CreateWhiteListResult = yield call(create_white_list, payload);
            if (backData.success) {
                BossMessage(backData.success, "@添加白名单成功");
                yield put({
                    type: "get_white_list",
                    payload: {
                        company_id: sessionStorage.getItem("companyId")
                    }
                })
            } else {
                BossMessage(backData.success, "@添加白名单失败:" + backData.result)
            }
        },

        * update_white_list({payload}, {call, put}) {
            const backData = yield call(update_white_list, payload);
            if (backData.success) {
                yield put({
                    type: "get_white_list",
                    payload: {
                        company_id: sessionStorage.getItem("companyId")
                    }
                });
                BossMessage(backData.success, "@编辑白名单成功");
            } else {
                BossMessage(backData.success, "@编辑白名单失败:" + backData.result)
            }
        },
        * delete_white_list({payload}, {call, put}) {
            const backData = yield call(delete_white_list, payload);
            if (backData.success) {
                BossMessage(backData.success, "@删除白名单成功");
                yield put({
                    type: "get_white_list",
                    payload: {
                        company_id: sessionStorage.getItem("companyId")
                    }
                })
            } else {
                BossMessage(backData.success, "@删除白名单失败:" + backData.result)
            }
        },
        * get_black_list_company({payload}, {call, put}) {
            const backData: T.GetWhiteListRes = yield call(get_black_list_company, payload);
            yield put({
                type: "update",
                payload: {
                    blackList: backData.result
                }
            })

        },
        * create_black_list_company({payload}, {call, put}) {
            const backData = yield call(create_black_list_company, payload);
            if (backData.success) {
                BossMessage(backData.success, "@添加黑名单成功");
                yield put({
                    type: "get_black_list_company",
                    payload: {
                        company_id: sessionStorage.getItem("companyId")
                    }
                })
            } else {
                BossMessage(backData.success, "@添加黑名单失败:" + backData.result)
            }

        },
        *delete_black_list_company({payload},{call,put}){
            const backData = yield call(delete_black_list_company, payload);
            if (backData.success) {
                BossMessage(backData.success, "@删除黑名单成功");
                yield put({
                    type: "get_black_list_company",
                    payload: {
                        company_id: sessionStorage.getItem("companyId")
                    }
                })
            } else {
                BossMessage(backData.success, "@删除黑名单失败:" + backData.result)
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    },
}as Model