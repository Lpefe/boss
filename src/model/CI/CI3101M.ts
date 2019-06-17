/*@通用-数据层*/
import {
    create_cpe_template, delete_cpe_template,
    get_device_model,
    get_lan_template,
    update_cpe_template,
    get_cpe_template,
    duplicate_cpe_template
} from "../../services/Company/companyS";
import {get_wifi_template} from "../../services/CI/CI2702S";
import {get_company_list} from "../../services/CI/CI1001S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "ci3101Info",
    state: {
        cpeTemplateList:[],
        modelList: [],
        lanList:[],
        wifiTemplateList:[],
        lanId:1,
        companyList:[]
    },
    effects: {
        *get_cpe_template({payload},{call,put}){
            const backData = yield call(get_cpe_template, payload);
            yield put({
                type: "update",
                payload: {
                    cpeTemplateList: backData.result
                }
            })
        },
        * get_device_model({payload}, {call, put}) {
            const backData = yield call(get_device_model, payload);
            yield put({
                type: "update",
                payload: {
                    modelList: backData.result
                }
            })
        },
        * get_company_list({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })
        },
        *get_lan_template({payload},{call,put}){
            const backData = yield call(get_lan_template, payload);
            let lanId;
            for(let key in backData.result){
                if(backData.result[key].name==='lan'){
                    lanId=backData.result[key].id
                }
            }
            yield put({
                type: "update",
                payload: {
                    lanList: backData.result,
                    lanId:lanId
                }
            })
        },
        *get_wifi_template({payload},{call,put}){
            const backData=yield call(get_wifi_template,payload);
            yield put({
                type:"update",
                payload:{
                    wifiTemplateList:backData.result
                }
            })
        },
        *create_cpe_template({payload},{call,put}){
            const backData = yield call(create_cpe_template, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_cpe_template",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *update_cpe_template({payload},{call,put}){
            const backData = yield call(update_cpe_template, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_cpe_template",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *delete_cpe_template({payload},{call,put}){
            const backData = yield call(delete_cpe_template, payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_cpe_template",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *duplicate_cpe_template({payload},{call,put}){
            const backData = yield call(duplicate_cpe_template, payload.update);
            if (backData.success) {
                BossMessage(true, "@复制成功");
                yield put({
                    type:"get_cpe_template",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@复制失败" + backData.result);
            }
        }


    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model