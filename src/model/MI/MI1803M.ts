/*@通用-数据层*/
import {get_company_list,update_company,batch_update_company} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "mi1803Info",
    state: {
        companyList:[]
    },
    effects: {
        *get_company_list({payload},{call,put}){
            const backData=yield call(get_company_list,payload);
            yield put({
                type:"update",
                payload:{
                    companyList: backData.result
                }
            })
        },
        *update_company({payload},{call,put}){
            console.log(payload)
            let backData
            if(Array.isArray(payload.init.companyId)){
                backData=yield call(batch_update_company,{forbidden_levels:payload.update.forbidden_levels?payload.update.forbidden_levels.join(","):"",ids:payload.init.companyId});
            }else{
                backData=yield call(update_company,{forbidden_levels:payload.update.forbidden_levels?payload.update.forbidden_levels.join(","):"",id:payload.init.companyId});
            }
           
            if(backData.success){
                BossMessage(true,"应用成功")
                const backData=yield call(get_company_list,{company_id:payload.init.selectCompanyId});
                yield put({
                    type:"update",
                    payload:{
                        companyList: backData.result
                    }
                })

            }else{
                BossMessage(false,"应用失败"+backData.result)
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model