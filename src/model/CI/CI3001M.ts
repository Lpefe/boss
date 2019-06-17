/*@通用-数据层*/
import {
    get_agency_list, get_company_list,
    get_cpe_template_agency,
    get_device_list,
    update_cpe_template_agency,
    update_device
} from "../../services/Company/companyS";
import {Model} from "dva";
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "ci3001Info",
    state: {
        deviceList: [],
        agencyList: [],
        templateList: [],
        total:0,
        companyList:[],
    },
    effects: {
        * get_device_list({payload}, {call, put}) {
            const backData = yield call(get_device_list, payload);
            if(backData.result[0]){
                for(let key in backData.result){
                    if(backData.result[key].agency_id===null){
                        backData.result[key].agency_id=undefined
                    }
                    if(backData.result[key].cta_id===0){
                        backData.result[key].cta_id=undefined
                    }
                }
            }
            yield put({
                type: "update",
                payload: {
                    deviceList: backData.result,
                    total:backData.total
                }
            })
        },
        * get_agency_list({payload}, {call, put}) {
            if (sessionStorage.getItem('companyId')==="1"){
                delete payload.company_id;
            }
            const backData = yield call(get_agency_list, payload);
            yield put({
                type: "update",
                payload: {
                    agencyList: backData.result
                }
            })
        },
        * get_cpe_template_agency({payload}, {call, put}) {
            if (sessionStorage.getItem('companyId')==="1"){
                delete payload.company_id;
            }
            const backData = yield call(get_cpe_template_agency, payload);
            yield put({
                type: "update",
                payload: {
                    templateList: backData.result
                }
            })
        },
        * bind_device({payload}, {call, put}) {
            const backData1 = yield call(update_device, {
                id: payload.update.device_id,
                name: payload.update.name,
                agency_id: payload.update.agency_id
            });
            let backData2;
            if(payload.update.type!=='AP'){
                backData2 = yield call(update_cpe_template_agency, {
                    id: payload.update.cta_id,
                    device_id: payload.update.device_id
                });
            }
            if(payload.update.type!=='AP'){
                if (backData1.success&&backData2.success) {
                    BossMessage(true, "@设备绑定成功");
                    yield put({
                        type:"get_device_list",
                        payload:payload.init
                    })
                } else {
                    BossMessage(false, "@设备绑定失败")
                }
            }else{
                if (backData1.success) {
                    BossMessage(true, "@设备绑定成功");
                    yield put({
                        type:"get_device_list",
                        payload:payload.init
                    })
                } else {
                    BossMessage(false, "@设备绑定失败")
                }
            }

        },
        * unbind_device({payload}, {call}) {
            const backData1 = yield call(update_device, {
                id: payload.device_id,
                agency_id: 0
            });
            let backData2;
            if(payload.type!=='AP'){
                backData2 = yield call(update_cpe_template_agency, {id: payload.cta_id, device_id: 0});
            }
            if(payload.type!=='AP'){
                if (backData1.success&&backData2.success) {
                    BossMessage(true, "@设备解绑成功")
                } else {
                    BossMessage(false, "@设备解绑失败")
                }
            }else{
                if (backData1.success) {
                    BossMessage(true, "@设备解绑成功")
                } else {
                    BossMessage(false, "@设备解绑失败")
                }
            }


        },
        * get_company_list({payload}, {call, put}) {
            const backData=yield call(get_company_list,payload);
            yield put({
                type:"update",
                payload:{
                    companyList:backData.result
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