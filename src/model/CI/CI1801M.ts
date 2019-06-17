/*@通用-数据层*/
import {get_lte_4g,update_lte_4g,create_lte_4g,delete_lte_4g} from "../../services/CI/CI1801S";
import {get_agency_list, get_device_list, get_isp_dict} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "ci1801Info",
    state: {
        lteData: [],
        agencyList: [],
        deviceList:[],
        ispList:[],
    },
    effects: {
        * get_lte_4g({payload}, {call, put}) {
            const backData = yield call(get_lte_4g, payload);
            yield put({
                type: "update",
                payload: {
                    lteData: backData.result
                }
            })
        },
        * get_agency_list({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            yield put({
                type: "update",
                payload: {
                    agencyList: backData.result
                }
            })
        },
        *get_device_list({payload},{call,put}){
            const backData = yield call(get_device_list, payload);
            yield put({
                type: "update",
                payload: {
                    deviceList: backData.result
                }
            })
        },
        *get_isp_list({payload},{call,put}){
            const backData = yield call(get_isp_dict, payload);
            yield put({
                type: "update",
                payload: {
                    ispList: backData.result
                }
            })
        },
        *create_lte_4g({payload},{call,put}){
            const backData=yield call(create_lte_4g,payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"get_lte_4g",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *update_lte_4g({payload},{call,put}){
            const backData=yield call(update_lte_4g,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_lte_4g",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *delete_lte_4g({payload},{call,put}){
            const backData=yield call(delete_lte_4g,payload.delete);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                yield put({
                    type:"get_lte_4g",
                    payload:payload.init
                })
            }else{
                BossMessage(false,"@删除失败:"+backData.result);
            }
        },

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    },
}as Model