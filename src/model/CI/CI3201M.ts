/*@通用-数据层*/
import {get_wifi_template,create_wifi_template,get_device_model,get_lan_template,update_wifi_template,delete_wifi_template,duplicate_wifi_template} from "../../services/CI/CI2702S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "ci3201Info",
    state: {
        dataSource:[],
        deviceList:[],
        templateList:[]
        
    },
    effects: {
        *get_wifi_template({payload},{call,put}){
            const backData=yield call(get_wifi_template,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        },
        *duplicate_wifi_template({payload},{call,put}){
            const backData=yield call(duplicate_wifi_template,payload.data);
            if (backData.success) {
                BossMessage(true, "@复制成功");
                yield put({
                    type:"get_wifi_template",
                    payload:{
                        company_id:parseInt(sessionStorage.getItem("companyId")||""),
                        name:payload.init.selectName
                    }
                });
            } else {
                BossMessage(false, "@复制失败" + backData.result);
            }
        },
        *get_device_model({payload},{call,put}){
            const backData=yield call(get_device_model,payload);
            yield put({
                type:"update",
                payload:{
                    deviceList:backData.result
                }
            })
        },
        *get_lan_template({payload},{call,put}){
            const backData=yield call(get_lan_template,payload);
            yield put({
                type:"update",
                payload:{
                    templateList:backData.result
                }
            })
        },
        *create_wifi_template({payload},{call}){
            const backData = yield call(create_wifi_template, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *delete_wifi_template({payload},{call,put}){
            const backData=yield call(delete_wifi_template,{ids:payload.init.ids,record:payload.init.record});
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type:"get_wifi_template",
                    payload:{
                        company_id:parseInt(sessionStorage.getItem("companyId")||""),
                        name:payload.init.selectName
                    }
                });
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *update_wifi_template({payload},{call,put}){
            const backData=yield call(update_wifi_template,payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model