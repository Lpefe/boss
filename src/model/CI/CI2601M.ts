/*@通用-数据层*/
import {get_company_list, update_company} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "ci2601Info",
    state: {
        companyInfo:{},
        ifWechat: false,
        ifDing:false
    },
    effects: {
        *get_company_info({payload},{call,put}){
            const backData=yield call(get_company_list,payload);
            const companyInfo=backData.result[0];
            yield put({
                type:"update",
                payload:{
                    companyInfo: companyInfo,
                    ifWechat:!!(companyInfo.wx_agent_id||companyInfo.wx_id||companyInfo.wx_secret),
                    ifDing:!!companyInfo.dingding_token
                }
            })
        },

        *handleActiveWechat({payload},{put}){
            yield put({
                type:"update",
                payload:{
                    ifWechat:payload.ifWechat
                }
            })
        },
        *handleActiveDing({payload},{put}){
            yield put({
                type:"update",
                payload:{
                    ifDing:payload.ifDing
                }
            })
        },
        *update_company({payload},{call,put}){
            const backData=yield call(update_company,payload);
            if(backData.success){
                yield put({
                    type:"get_company_info",
                    payload:{
                        company_id:sessionStorage.getItem("companyId")
                    }
                });
                BossMessage(true,"@应用成功")
            }else{
                BossMessage(false,"@应用失败"+backData.result)
            }
        }

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model