
import {get_device_list} from "../../services/CI/CI1101S";
import {get_wan_info, update_device} from "../../services/Company/companyS";
import {Model} from "dva";

export default {
    namespace: "ci0001Info",
    state:{
        wanInfo:[],
        deviceInfo:[],
        link_path:[],
    },
    effects:{
        *update_device({payload},{call}){
            yield call(update_device,payload)
        },
        *get_wan_info({payload},{call,put}){
            const backData=yield call(get_wan_info,payload);
            yield put({
                type:"update",
                payload:{
                    wanInfo:backData.result
                }
            })
        },
        *get_device_list({payload},{call,put}){
            const backData=yield call(get_device_list,payload);
            yield put({
                type:"update",
                payload:{
                    deviceInfo:backData.result[0]
                }
            })
        },
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model