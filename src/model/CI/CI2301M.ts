/*@通用-数据层*/
import {initBackDataProcessDpi} from '../../utils/commonUtilFunc';
import {
    get_app_category,
    get_dpi_apps_custom,
    create_dpi_apps_custom,
    update_dpi_apps_custom,
    get_company_list,
    delete_dpi_apps_custom
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "ci2301Info",
    state: {
        dataSource: [],
        agencyGroupList: [],
        ipGroupData: [],
        portGroupData: [],
        appCategory:[],
        companyList:[],
    },
    effects: {
        *get_dpi_apps_custom({payload},{call,put}){
            let backData = yield call(get_dpi_apps_custom, payload);
            backData=initBackDataProcessDpi(backData);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result
                }
            })
        },
        * get_app_category({payload}, {call, put}) {
            const backData = yield call(get_app_category, payload);
            yield put({
                type:"update",
                payload:{
                    appCategory:backData.result
                }
            })
        },
        *get_company_list({payload},{call,put}){
            const backData = yield call(get_company_list, payload);
            yield put({
                type:"update",
                payload:{
                    companyList:backData.result
                }
            })
        },
        * create_dpi_apps_custom({payload}, {call, put}) {
            const backData = yield call(create_dpi_apps_custom, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_dpi_apps_custom",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_dpi_apps_custom({payload}, {call, put}) {
            const backData = yield call(update_dpi_apps_custom, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_dpi_apps_custom",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *delete_dpi_apps_custom({payload},{call,put}){
            const backData = yield call(delete_dpi_apps_custom, payload.delete);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_dpi_apps_custom",
                    payload:payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    },
}as Model