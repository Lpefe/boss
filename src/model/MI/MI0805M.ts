/*@通用-数据层*/
import {Model} from "dva";
import {
    create_app_version_company,
    get_app_version_company, get_company_list,
    update_app_version_company, get_app_version,delete_app_version_company
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "mi0805Info",
    state: {
        versionCompanyList:[],
        companyList:[],
        versionList:[],
        osList:[]
    },
    effects: {
        *get_app_version_company({payload},{call,put}){
            const backData=yield call(get_app_version_company,payload);
            for(let company of backData.result){
                company.company_ids=company.company_id
            }
            yield put({
                type:"update",
                payload:{
                    versionCompanyList:backData.result
                }
            })

        },
        *update_app_version_company({payload},{call,put}){
            payload.update.company_id=payload.update.company_ids;
            delete payload.update.company_ids;
            const backData=yield call(update_app_version_company,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_app_version_company",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@编辑失败"+backData.result);
            }
        },
        *create_app_version_company({payload},{call,put}){
            const backData=yield call(create_app_version_company,payload.update);
            if (backData.success) {
                BossMessage(true, "@新增成功");
                yield put({
                    type:"get_app_version_company",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@新增失败"+backData.result);
            }
        },
        *delete_app_version_company({payload},{call,put}){
            const backData=yield call(delete_app_version_company,payload.delete);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_app_version_company",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@删除失败"+backData.result);
            }
        },
        *get_company_list({payload},{call,put}){
            const backData=yield call(get_company_list,payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })

        },
        *get_app_version({payload},{call,put}){
            const backData=yield call(get_app_version,payload);
            yield put({
                type:"update",
                payload:{
                    versionList:backData.result
                }
            })
        },
        *get_os_list({payload},{call,put}){
            const backData=yield call(get_app_version,payload);
            yield put({
                type:"update",
                payload:{
                    osList:backData.result
                }
            })
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model